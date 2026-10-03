# Smart Farmer

Smart Farmer is an agricultural crop-disease diagnosis product. This repository contains the
marketing site plus a working **Product Demo**: a farmer uploads a photo of a leaf and receives a
diagnosis — crop, disease, severity, status and agronomic recommendations.

- **Frontend** — React + TypeScript + Vite (this is the whole site and the demo UI).
- **Backend** — FastAPI service in `backend/` that runs the actual diagnosis.

The demo is wired: the frontend posts the image to the backend, the backend runs the
diagnosis and returns JSON that the UI renders. The one exception is the **Use Demo Image**
button — see the note in [Known limitations](#known-limitations).

---

## Repository layout

```
src/                 React app (components, pages, router, services, types)
  services/          diagnosisService.ts — the frontend/backend contract
backend/             FastAPI service
  main.py            API app (endpoints, CORS, upload limits, provider switch)
  bedrock_inference.py  Default provider — Amazon Bedrock (Amazon Nova)
  inference.py       Optional local ONNX provider (DIAGNOSIS_PROVIDER=onnx)
  taxonomy.py        15 PlantVillage labels + crop/severity/status/recommendations maps
  .env.example       Template for backend configuration (copy to .env)
  requirements.txt       Dependencies for the default Bedrock path
  requirements-onnx.txt  Extra dependencies for the local ONNX path only
  train/train.py     Fine-tuning script (EfficientNet-B0 → plantvillage.onnx)
  model/             Where a local .onnx model file goes (gitignored, not shipped)
vite.config.ts       Dev server + /api proxy to the backend
```

---

## Frontend

Requirements: Node.js and npm.

```bash
npm install
npm run dev      # Vite dev server, http://localhost:5173
```

Other scripts defined in `package.json`:

```bash
npm run build    # tsc -b && vite build  → output in dist/
npm run lint     # eslint .
npm run preview  # serve the production build locally (port 4173)
```

`vite.config.ts` proxies every request starting with `/api` to `http://localhost:8000`, so the dev
server can call the backend with same-origin URLs and no CORS problems. In production, point the
frontend at the deployed API instead by setting `VITE_API_BASE` (see
`src/services/diagnosisService.ts`).

---

## Backend

Requirements: Python 3.10+ (the backend uses `X | None` type syntax).

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

The server must be started from inside `backend/` — the module is imported as `main:app`. Interactive
API docs are then available at `http://localhost:8000/docs`.

### Endpoints

| Method | Path               | Description                                                                                                       |
| ------ | ------------------ | ----------------------------------------------------------------------------------------------------------------- |
| POST   | `/api/v1/diagnose` | Accepts a leaf image (multipart file or base64 data URL) and returns the diagnosis JSON.                          |
| GET    | `/api/v1/health`   | Liveness check plus the currently active diagnosis provider.                                                       |

`POST /api/v1/diagnose` accepts the image in either of two form fields — a multipart file upload in
`image`, or a base64 data URL string in `image_b64` (this is what the browser sends). It also accepts
optional `crop` and `location` hints. It returns JSON shaped like:

```json
{
  "crop": "Tomato",
  "disease": "Late Blight",
  "confidence": 91.2,
  "severity": "High",
  "status": "Affected",
  "recommendations": ["Act immediately — late blight can collapse a tomato crop within a week.", "..."]
}
```

Images are limited to 10 MB. The frontend file picker offers JPEG, PNG and WebP, and the backend
decodes anything Pillow can read. Note that **HEIC is not currently decodable** — see the limitations
section.

---

## How the diagnosis works today

The backend calls **Amazon Bedrock** using an **Amazon Nova vision model**:

1. The uploaded image is sent to the model.
2. The model is constrained to answer with exactly one of the 15 PlantVillage class labels.
3. `backend/taxonomy.py` maps that label to the crop, display name, severity, status and
   agronomic recommendations returned to the site.

There is **no local model file and no GPU** involved in this path — inference happens in AWS.

---

## AWS setup (required)

This is the part that trips people up. Work through it in order.

1. **Install and configure the AWS CLI**, or set the credentials as environment variables. Confirm
   they resolve before touching the app:

   ```bash
   aws configure          # or: export AWS_ACCESS_KEY_ID=... AWS_SECRET_ACCESS_KEY=... AWS_DEFAULT_REGION=us-east-1
   aws sts get-caller-identity
   ```

2. **Grant the AWS Marketplace permissions to the IAM principal.** Amazon Bedrock model access is
   enabled automatically the first time you invoke a model, but that first-time auto-enablement
   calls AWS Marketplace under the hood, so the principal needs:

   - `aws-marketplace:Subscribe`
   - `aws-marketplace:Unsubscribe`
   - `aws-marketplace:ViewSubscriptions`

   Without them, the first call fails with `AccessDeniedException`.

3. **Know which models need the use-case form.** Amazon Nova models are Amazon first-party models
   and do **not** require the Anthropic first-time use-case form. Anthropic Claude models on Bedrock
   **do** require a one-time use-case submission before first use.

4. **Grant `bedrock:InvokeModel`** to the IAM principal.

5. **Pick a region that has a Bedrock *runtime* endpoint.** Africa (Cape Town) `af-south-1` does
   **not**. Use `us-east-1` unless you have a specific reason not to.

6. **Never put AWS credentials in the frontend.** The browser must never talk to AWS directly — the
   backend holds the credentials and is the only thing that calls Bedrock.

---

## Configuration

Copy the template and adjust it:

```bash
cp backend/.env.example backend/.env      # Windows: copy backend\.env.example backend\.env
```

`backend/.env` is gitignored and must never be committed. Variables:

| Variable                | Purpose                                                                                          |
| ----------------------- | ------------------------------------------------------------------------------------------------ |
| `DIAGNOSIS_PROVIDER`    | Which engine to use: `bedrock` (default, calls AWS) or `onnx` (local model file).                 |
| `AWS_REGION`            | Region for the Bedrock runtime endpoint. Must have one — `us-east-1` is the default.              |
| `AWS_PROFILE`           | Optional named profile from `~/.aws/credentials`; leave blank to use the default chain.           |
| `BEDROCK_MODEL_ID`      | Amazon Nova model id that accepts **image** input (e.g. `amazon.nova-lite-v1:0`).                 |
| `BEDROCK_MAX_IMAGE_DIM` | Longest edge (px) an uploaded image is downscaled to before being sent to Bedrock (cost/latency). |
| `BEDROCK_MAX_TOKENS`    | Max tokens the model may generate for its JSON answer.                                            |
| `BEDROCK_TEMPERATURE`   | Sampling temperature; `0` is correct for a classification task.                                   |
| `ALLOWED_ORIGINS`       | Comma-separated browser origins allowed to call the API (defaults to the local dev servers).      |
| `MODEL_PATH`            | Path to a local `.onnx` file — only used when `DIAGNOSIS_PROVIDER=onnx`.                          |

AWS credentials are not read from `.env` by the application: the AWS SDK resolves them through its
normal credential chain (AWS CLI config, environment variables, or an IAM role on the host). If the
CLI is already configured, leave the AWS keys out of `.env` entirely.

---

## Optional: local ONNX inference

There is an optional local-inference path, and it is **not the default**:

- Set `DIAGNOSIS_PROVIDER=onnx` and point `MODEL_PATH` at an ONNX model file.
- The model file is **gitignored and is not present in this repository** (`backend/model/` ships
  empty), so this path does nothing until someone trains a model and drops the file in.
- It requires extra dependencies (see `backend/requirements-onnx.txt`).
- `backend/train/train.py` is the training script: it fine-tunes EfficientNet-B0 on the PlantVillage
  dataset and exports `plantvillage.onnx`. See the docstring in that file for the dataset layout and
  how to run it.

---

## Known limitations

- **Limited crop coverage.** The demo classifies only the 15 PlantVillage classes, which cover
  Tomato, Potato and Bell Pepper. Cassava, Maize, Beans, Banana, Coffee and Rice are **not**
  supported by the model yet, even though the site markets them.
- **Confidence is not calibrated.** The confidence figure is a model self-report, not a calibrated
  probability. With Bedrock this is the model's own estimate; with the ONNX provider it is a genuine
  softmax probability. Treat them differently.
- **HEIC uploads fail.** `validateImage()` in `src/services/diagnosisService.ts` lists `image/heic`
  as supported, but Pillow cannot decode HEIC without the `pillow-heif` package, so an iPhone photo
  in HEIC format passes client-side validation and then fails on decode. Either install `pillow-heif`
  or drop `image/heic` from that list.
- **The sample image is not shipped.** The Product Demo's "Use Demo Image" button fetches
  `public/demo-leaf.jpg`, and no such file is in this repository, so the button shows an error until
  you drop a leaf photo (JPEG, PNG or WebP) at that path.
- **Decision support only.** Results are an aid, not a replacement for an agronomist.
