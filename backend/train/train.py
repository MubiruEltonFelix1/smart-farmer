"""
train.py — Fine-tune EfficientNet-B0 on the Cassava Leaf Disease dataset.

Designed to run on Google Colab (free T4 GPU) or locally if you have a GPU.
Outputs cassava.onnx — drop it into backend/model/ when done.

─── QUICK START (Google Colab) ───────────────────────────────────────────────
1. Go to https://www.kaggle.com/c/cassava-leaf-disease-classification
2. Download the dataset (train_images/ + train.csv + label_num_to_disease_map.json)
3. Upload to your Colab session or mount Google Drive
4. Install deps:
     !pip install torch torchvision timm onnx
5. Set DATASET_DIR below to where you unpacked the dataset
6. Run: python train.py
7. Download the output cassava.onnx and place it in backend/model/
──────────────────────────────────────────────────────────────────────────────

Dataset classes (must match inference.py CASSAVA_CLASSES order):
  0 — Cassava Bacterial Blight
  1 — Cassava Brown Streak Disease
  2 — Cassava Green Mite
  3 — Cassava Mosaic Disease
  4 — Healthy
"""

import os
import time
from pathlib import Path

import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, Dataset, random_split
from torchvision import transforms
from torchvision.models import efficientnet_b0, EfficientNet_B0_Weights
from PIL import Image
import pandas as pd

# ─── Config — change these to match your setup ───────────────────────────────
DATASET_DIR  = "./cassava-leaf-disease-classification"  # unzipped Kaggle folder
TRAIN_CSV    = os.path.join(DATASET_DIR, "train.csv")
TRAIN_IMAGES = os.path.join(DATASET_DIR, "train_images")
OUTPUT_PATH  = "../model/cassava.onnx"

NUM_CLASSES  = 5
IMG_SIZE     = 224
BATCH_SIZE   = 32
EPOCHS       = 15
LR           = 1e-3
VAL_SPLIT    = 0.2
SEED         = 42

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
print(f"Using device: {DEVICE}")

# ─── Dataset ─────────────────────────────────────────────────────────────────
class CassavaDataset(Dataset):
    def __init__(self, df: pd.DataFrame, image_dir: str, transform=None):
        self.df        = df.reset_index(drop=True)
        self.image_dir = image_dir
        self.transform = transform

    def __len__(self):
        return len(self.df)

    def __getitem__(self, idx):
        row   = self.df.iloc[idx]
        path  = os.path.join(self.image_dir, row["image_id"])
        image = Image.open(path).convert("RGB")
        label = int(row["label"])
        if self.transform:
            image = self.transform(image)
        return image, label


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

    # Replace the final classification layer
    in_features = model.classifier[1].in_features
    model.classifier[1] = nn.Linear(in_features, num_classes)

    return model


# ─── Training loop ────────────────────────────────────────────────────────────
def train_epoch(model, loader, criterion, optimizer, device):
    model.train()
    total_loss, correct, total = 0.0, 0, 0
    for images, labels in loader:
        images, labels = images.to(device), labels.to(device)
        optimizer.zero_grad()
        outputs = model(images)
        loss    = criterion(outputs, labels)
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
            loss    = criterion(outputs, labels)
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

    # Load CSV
    df = pd.read_csv(TRAIN_CSV)
    print(f"Dataset: {len(df)} images, {df['label'].nunique()} classes")

    # Train / val split
    val_size   = int(len(df) * VAL_SPLIT)
    train_size = len(df) - val_size
    train_df   = df.iloc[:train_size]
    val_df     = df.iloc[train_size:]

    train_dataset = CassavaDataset(train_df, TRAIN_IMAGES, train_transform)
    val_dataset   = CassavaDataset(val_df,   TRAIN_IMAGES, val_transform)

    train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True,  num_workers=2, pin_memory=True)
    val_loader   = DataLoader(val_dataset,   batch_size=BATCH_SIZE, shuffle=False, num_workers=2, pin_memory=True)

    # Phase 1: train only the new classifier head (base frozen, 5 epochs)
    print("\n── Phase 1: Training classifier head (base frozen) ──")
    model     = build_model(NUM_CLASSES, freeze_base=True).to(DEVICE)
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

    # Phase 2: unfreeze all layers and fine-tune (lower LR, remaining epochs)
    print(f"\n── Phase 2: Fine-tuning all layers ({EPOCHS - 5} more epochs) ──")
    for param in model.parameters():
        param.requires_grad = True

    optimizer = optim.Adam(model.parameters(), lr=LR * 0.1)
    scheduler = optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=EPOCHS - 5)

    best_val_acc = 0.0
    best_state   = None

    for epoch in range(EPOCHS - 5):
        t0 = time.time()
        tr_loss, tr_acc = train_epoch(model, train_loader, criterion, optimizer, DEVICE)
        vl_loss, vl_acc = val_epoch(model, val_loader,   criterion, DEVICE)
        scheduler.step()
        print(f"  Epoch {epoch+1:02d}/{EPOCHS-5:02d} | "
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

    # Export to ONNX
    export_onnx(model.cpu(), OUTPUT_PATH)
    print("\nDone. Place cassava.onnx in backend/model/ and start the server.")


if __name__ == "__main__":
    main()
