"""
train.py — Fine-tune EfficientNet-B0 on the PlantVillage dataset.

Designed to run locally (CPU or GPU) or on Google Colab (free T4 GPU).
Outputs plantvillage.onnx — drop it into backend/model/ when done.

─── QUICK START ──────────────────────────────────────────────────────────────
1. Make sure your dataset is at:
       dataset/PlantVillage/PlantVillage/
   with one sub-folder per class, e.g.:
       Pepper__bell___Bacterial_spot/
       Pepper__bell___healthy/
       Potato___Early_blight/
       ...

2. Install dependencies:
       pip install torch torchvision timm onnx Pillow

3. Run from the repo root:
       python backend/train/train.py

4. Copy the output model into place:
       cp backend/model/plantvillage.onnx backend/model/plantvillage.onnx
──────────────────────────────────────────────────────────────────────────────

Dataset classes (15 total, sorted alphabetically — must match inference.py):
   0  Pepper__bell___Bacterial_spot
   1  Pepper__bell___healthy
   2  Potato___Early_blight
   3  Potato___healthy
   4  Potato___Late_blight
   5  Tomato__Target_Spot
   6  Tomato__Tomato_mosaic_virus
   7  Tomato__Tomato_YellowLeaf__Curl_Virus
   8  Tomato_Bacterial_spot
   9  Tomato_Early_blight
  10  Tomato_healthy
  11  Tomato_Late_blight
  12  Tomato_Leaf_Mold
  13  Tomato_Septoria_leaf_spot
  14  Tomato_Spider_mites_Two_spotted_spider_mite
"""

import os
import time
from pathlib import Path

import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, random_split
from torchvision import transforms
from torchvision.datasets import ImageFolder
from torchvision.models import efficientnet_b0, EfficientNet_B0_Weights

# ─── Config ──────────────────────────────────────────────────────────────────
# Path to the folder that contains one sub-directory per class.
DATASET_DIR = "./dataset/PlantVillage/PlantVillage"
OUTPUT_PATH = "./backend/model/plantvillage.onnx"

IMG_SIZE   = 224
BATCH_SIZE = 32
EPOCHS     = 15       # total epochs (phase 1: 5 frozen, phase 2: 10 unfrozen)
LR         = 1e-3
VAL_SPLIT  = 0.2
SEED       = 42

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
print(f"Using device: {DEVICE}")

# ─── Transforms ──────────────────────────────────────────────────────────────
train_transform = transforms.Compose([
    transforms.RandomResizedCrop(IMG_SIZE, scale=(0.7, 1.0)),
    transforms.RandomHorizontalFlip(),
    transforms.RandomVerticalFlip(),
    transforms.ColorJitter(brightness=0.3, contrast=0.3, saturation=0.2),
    transforms.RandomRotation(30),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std =[0.229, 0.224, 0.225]),
])

val_transform = transforms.Compose([
    transforms.Resize((IMG_SIZE, IMG_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std =[0.229, 0.224, 0.225]),
])


# ─── Model ───────────────────────────────────────────────────────────────────
def build_model(num_classes: int, freeze_base: bool = True) -> nn.Module:
    """Load pretrained EfficientNet-B0 and replace the classifier head."""
    model = efficientnet_b0(weights=EfficientNet_B0_Weights.DEFAULT)

    if freeze_base:
        for param in model.parameters():
            param.requires_grad = False

    in_features = model.classifier[1].in_features
    model.classifier[1] = nn.Linear(in_features, num_classes)

    return model


# ─── Training / validation loops ─────────────────────────────────────────────
def train_epoch(model, loader, criterion, optimizer, device):
    model.train()
    total_loss, correct, total = 0.0, 0, 0
    for images, labels in loader:
        images, labels = images.to(device), labels.to(device)
        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
        total_loss += loss.item() * images.size(0)
        correct    += (outputs.argmax(1) == labels).sum().item()
        total      += images.size(0)
    return total_loss / total, correct / total


def val_epoch(model, loader, criterion, device):
    model.eval()
    total_loss, correct, total = 0.0, 0, 0
    with torch.no_grad():
        for images, labels in loader:
            images, labels = images.to(device), labels.to(device)
            outputs = model(images)
            loss = criterion(outputs, labels)
            total_loss += loss.item() * images.size(0)
            correct    += (outputs.argmax(1) == labels).sum().item()
            total      += images.size(0)
    return total_loss / total, correct / total


# ─── ONNX export ─────────────────────────────────────────────────────────────
def export_onnx(model: nn.Module, output_path: str, img_size: int = 224):
    model.eval()
    Path(output_path).parent.mkdir(parents=True, exist_ok=True)
    dummy = torch.randn(1, 3, img_size, img_size)
    torch.onnx.export(
        model,
        dummy,
        output_path,
        input_names=["input"],
        output_names=["output"],
        dynamic_axes={"input": {0: "batch_size"}, "output": {0: "batch_size"}},
        opset_version=17,
    )
    print(f"\n✅  Model exported to {output_path}")


# ─── Main ─────────────────────────────────────────────────────────────────────
def main():
    torch.manual_seed(SEED)
    np.random.seed(SEED)

    # ── Load full dataset with training transforms first to get class names ──
    full_dataset = ImageFolder(DATASET_DIR, transform=train_transform)
    num_classes  = len(full_dataset.classes)

    print(f"Dataset: {len(full_dataset)} images across {num_classes} classes")
    print("Classes (index → folder name):")
    for idx, name in enumerate(full_dataset.classes):
        print(f"  {idx:2d}  {name}")

    # ── Train / validation split ─────────────────────────────────────────────
    val_size   = int(len(full_dataset) * VAL_SPLIT)
    train_size = len(full_dataset) - val_size
    train_subset, val_subset = random_split(
        full_dataset,
        [train_size, val_size],
        generator=torch.Generator().manual_seed(SEED),
    )

    # Apply val_transform to the validation subset via a wrapper
    class TransformSubset(torch.utils.data.Dataset):
        def __init__(self, subset, transform):
            self.subset    = subset
            self.transform = transform

        def __len__(self):
            return len(self.subset)

        def __getitem__(self, idx):
            img, label = self.subset[idx]
            # img is already a tensor from train_transform; we need the PIL image
            # Re-load from the underlying dataset using the original index
            orig_idx = self.subset.indices[idx]
            path, label = self.subset.dataset.samples[orig_idx]
            from PIL import Image
            img = Image.open(path).convert("RGB")
            return self.transform(img), label

    val_dataset   = TransformSubset(val_subset, val_transform)
    train_dataset = train_subset   # already has train_transform applied

    train_loader = DataLoader(
        train_dataset, batch_size=BATCH_SIZE, shuffle=True,
        num_workers=0, pin_memory=(DEVICE == "cuda"),
    )
    val_loader = DataLoader(
        val_dataset, batch_size=BATCH_SIZE, shuffle=False,
        num_workers=0, pin_memory=(DEVICE == "cuda"),
    )

    # ── Phase 1: train only the classifier head (base frozen, 5 epochs) ──────
    print("\n── Phase 1: Training classifier head (base frozen) ──")
    model     = build_model(num_classes, freeze_base=True).to(DEVICE)
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.classifier.parameters(), lr=LR)
    scheduler = optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=5)

    for epoch in range(5):
        t0 = time.time()
        tr_loss, tr_acc = train_epoch(model, train_loader, criterion, optimizer, DEVICE)
        vl_loss, vl_acc = val_epoch(model, val_loader,   criterion, DEVICE)
        scheduler.step()
        print(f"  Epoch {epoch+1:02d}/05 | "
              f"train loss {tr_loss:.4f} acc {tr_acc:.3f} | "
              f"val loss {vl_loss:.4f} acc {vl_acc:.3f} | "
              f"{time.time()-t0:.1f}s")

    # ── Phase 2: unfreeze all layers and fine-tune ───────────────────────────
    remaining = EPOCHS - 5
    print(f"\n── Phase 2: Fine-tuning all layers ({remaining} more epochs) ──")
    for param in model.parameters():
        param.requires_grad = True

    optimizer = optim.Adam(model.parameters(), lr=LR * 0.1)
    scheduler = optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=remaining)

    best_val_acc = 0.0
    best_state   = None

    for epoch in range(remaining):
        t0 = time.time()
        tr_loss, tr_acc = train_epoch(model, train_loader, criterion, optimizer, DEVICE)
        vl_loss, vl_acc = val_epoch(model, val_loader,   criterion, DEVICE)
        scheduler.step()
        print(f"  Epoch {epoch+1:02d}/{remaining:02d} | "
              f"train loss {tr_loss:.4f} acc {tr_acc:.3f} | "
              f"val loss {vl_loss:.4f} acc {vl_acc:.3f} | "
              f"{time.time()-t0:.1f}s")

        if vl_acc > best_val_acc:
            best_val_acc = vl_acc
            best_state   = {k: v.cpu().clone() for k, v in model.state_dict().items()}
            print(f"  ★ New best val accuracy: {best_val_acc:.3f}")

    # Load best weights before export
    if best_state:
        model.load_state_dict(best_state)
        model.to(DEVICE)

    print(f"\nFinal best validation accuracy: {best_val_acc:.3f} ({best_val_acc*100:.1f}%)")

    export_onnx(model.cpu(), OUTPUT_PATH)
    print("\nDone. Place plantvillage.onnx in backend/model/ and start the server.")


if __name__ == "__main__":
    main()
