# Kebeera — AI-Powered Crop Disease Detection

> Turn a photo of your crop into actionable farming intelligence.

Kebeera is a mobile-first web application for African smallholder farmers. It provides AI-powered crop leaf disease diagnosis, weather forecasts, local disease outbreak tracking, a multilingual AI farming assistant, and a complete farmer portal.

---

## Quick Start (Development)

```bash
# Install frontend dependencies
npm install

# Copy and configure environment variables
cp .env.example .env
# (edit .env — see Environment Variables section below)

# Start the frontend dev server
npm run dev
# → http://localhost:5173

# In a separate terminal, start the backend (optional for demo mode)
cd backend
pip install -r requirements.txt
python main.py
# → http://localhost:8000
```

### Demo Account

Sign in at `/signin` with:
- **Email:** `demo@smartfarmer.ai`
- **Password:** any password (demo bypass)

Or create a new account at `/signup`. Demo data is pre-seeded automatically.

All portal data is stored in `localStorage` in demo mode — nothing is sent to a server unless the backend is running.

---

## Routes

| Path | Description |
|------|-------------|
| `/` | Landing page |
| `/product` | Crop diagnosis demo |
| `/how-it-works` | Process explanation |
| `/technology` | Technology overview |
| `/solutions` | Partner & solutions |
| `/pricing` | Pricing page |
| `/about` | About page |
| `/signin` | Farmer sign-in |
| `/signup` | Create farmer account |
| `/onboarding` | Post-signup farm setup wizard |
| `/portal/dashboard` | Farmer portal dashboard |
| `/portal/scan` | Crop leaf scan |
| `/portal/history` | Scan history |
| `/portal/weather` | Weather forecast & alerts |
| `/portal/outbreaks` | Local disease outbreak trends |
| `/portal/profile` | Farm & farmer profile |
| `/portal/assistant` | AI farm assistant chat |
| `/portal/plans` | Plans & credits |
| `/portal/settings` | Settings & account management |

All routes work on direct load and refresh (Vercel SPA rewrite configured in `vercel.json`).

---

## Environment Variables

### Frontend (Vite — prefix `VITE_`)

Create a `.env` file in the project root:

```env
# Base URL of your deployed backend API
# Leave empty in development (Vite proxies /api → localhost:8000)
VITE_API_BASE=

# Optional shared secret for the backend API key check
# Sent as X-API-Key header. Not a substitute for real auth.
VITE_API_KEY=

# Set to "true" to allow the demo account shortcut in production
VITE_DEMO_ENABLED=true
```

### Backend (FastAPI)

Create `backend/.env` from `backend/.env.example`:

```env
# AI provider: "bedrock" (default) or "onnx"
DIAGNOSIS_PROVIDER=bedrock

# AWS (for Bedrock provider)
AWS_REGION=us-east-1
AWS_PROFILE=
BEDROCK_MODEL_ID=amazon.nova-lite-v1:0
BEDROCK_MAX_IMAGE_DIM=1024
BEDROCK_MAX_TOKENS=400
BEDROCK_TEMPERATURE=0

# CORS — add your frontend URL
ALLOWED_ORIGINS=http://localhost:5173,https://your-app.vercel.app

# Optional: shared API key (empty = disabled)
API_KEY=

# ONNX local model path (only if DIAGNOSIS_PROVIDER=onnx)
# MODEL_PATH=./model/plantvillage.onnx
```

---

## Auth Setup

The portal uses a **mock auth service** (`src/auth/mockAuthService.ts`) that persists data in `localStorage`. This is intentional for the demo — no external auth service is required to run locally.

### Replacing with real auth (e.g. Supabase)

1. Install your auth client: `npm install @supabase/supabase-js`
2. Create `src/auth/supabaseAuthService.ts` implementing the same interface as `mockAuthService`
3. Add env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
4. Update `src/auth/mockAuthService.ts` imports to point to your new service
5. Run database migrations (see Data Model below)

The `AuthContext` interface does not change — only the service implementation.

---

## Weather API Setup

The weather page uses **demo data** by default (`src/data/seedData.ts`).

To connect a real weather API:

1. Sign up for [Open-Meteo](https://open-meteo.com/) (free) or [OpenWeatherMap](https://openweathermap.org/)
2. Add a backend endpoint: `GET /api/v1/weather?lat=...&lng=...`
3. Cache responses appropriately (e.g. 30 min TTL)
4. Update `src/pages/portal/WeatherPage.tsx` — replace `DEMO_WEATHER` with a fetch call
5. **Never expose API keys in client code** — all weather API calls must go through the backend

```env
# Backend .env
WEATHER_API_KEY=your_key_here
WEATHER_PROVIDER=open-meteo
```

---

## AI Model Setup

### Option A: Amazon Bedrock (default)

- Ensure your AWS credentials have `bedrock:InvokeModel` permission
- Set `DIAGNOSIS_PROVIDER=bedrock` and configure AWS env vars
- The backend sends leaf images to `amazon.nova-lite-v1:0` with a structured prompt
- No model file required

### Option B: Local ONNX

1. Train the model: `python backend/train/train.py` (requires PlantVillage dataset)
2. Place the output at `backend/model/plantvillage.onnx`
3. Set `DIAGNOSIS_PROVIDER=onnx` and `MODEL_PATH=./model/plantvillage.onnx`
4. Install ONNX dependencies: `pip install -r backend/requirements-onnx.txt`

### AI Farm Assistant

The assistant uses a **mock response generator** in `src/pages/portal/AssistantPage.tsx`.

To connect a real LLM:
1. Add a backend endpoint: `POST /api/v1/chat`
2. Accept `{ messages: ChatMessage[], locale: string }`, return `{ reply: string }`
3. Connect OpenAI, Anthropic, or AWS Bedrock on the backend
4. Update `generateAIResponse()` in `AssistantPage.tsx` to call `/api/v1/chat`

---

## Storage

Scan images are currently stored as **data URIs / blob URLs** in the browser for the demo.

For production:
1. Upload images to **private S3 / Supabase Storage / Cloudflare R2**
2. Store time-limited signed URLs in the database
3. Add a backend endpoint: `POST /api/v1/upload` → returns signed URL
4. Update `PortalScanPage.tsx` to upload before analysis

---

## Billing Integration

The Pro plan upgrade flow is a **placeholder** (`plans-billing-notice` in `PlansPage.tsx`).

To enable real payments:
1. Set up a Stripe account and add `STRIPE_SECRET_KEY` to backend `.env`
2. Add `VITE_STRIPE_PUBLIC_KEY` to frontend `.env`
3. Create a backend checkout endpoint: `POST /api/v1/checkout/session`
4. Update `PlansPage.tsx` to call the checkout endpoint
5. Add a webhook handler: `POST /api/v1/webhooks/stripe` to update user plan in DB

---

## Data Model

The current mock uses `localStorage`. For production, use a relational database (PostgreSQL recommended) with these tables:

```sql
users, farmer_profiles, farms, crops,
scan_records, scan_images, disease_results,
weather_cache, weather_alerts, outbreak_aggregates,
chat_conversations, chat_messages,
usage_quotas, credit_ledger, subscriptions,
notifications, consent_records, translations
```

All tables should use **Row Level Security** (Supabase) or equivalent to ensure farmers can only access their own data.

---

## Deployment

### Frontend (Vercel)

```bash
# Build
npm run build

# Deploy
vercel --prod
```

`vercel.json` is already configured with SPA rewrites. No additional configuration needed.

### Backend (AWS Lambda)

```bash
cd deploy
python build_lambda_package.py
python deploy_backend.py
```

Or run as a standalone FastAPI server:

```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000
```

---

## Supported Languages

| Code | Language | Region |
|------|----------|--------|
| `en` | English | All |
| `lg` | Luganda | Central Uganda (Buganda) |
| `nyn` | Runyankole | Western Uganda (Ankole) |

Language selector is available during sign-up, onboarding, and in Settings / Profile. The assistant supports switching language mid-conversation.

To add a new language: add a new locale key to `src/i18n/translations.ts` and add it to the `LOCALE_LABELS` record.

---

## Responsible AI Disclaimer

AI assessments support, but do not replace, qualified agricultural advice or local extension officers. Kebeera is a decision-support tool. For high-risk or unclear situations, always consult a qualified agronomist or your local extension officer.

---

## Project Structure

```
smart-farmer/
├── src/
│   ├── auth/              # AuthContext, mockAuthService
│   ├── components/        # Shared UI components + Icons
│   ├── data/              # Static data + seedData
│   ├── i18n/              # translations.ts (en/lg/nyn)
│   ├── pages/
│   │   ├── auth/          # SignIn, SignUp, Onboarding
│   │   └── portal/        # Dashboard, Scan, History, Weather, Outbreaks,
│   │                      # Profile, Assistant, Plans, Settings
│   ├── portal/            # PortalLayout, ProtectedRoute
│   ├── router/            # Custom SPA router
│   ├── services/          # diagnosisService (API client)
│   ├── types/             # TypeScript interfaces
│   └── App.tsx            # Root: RouterProvider > AuthProvider > AppShell
├── backend/               # FastAPI backend
├── deploy/                # AWS Lambda deployment scripts
├── public/                # Static assets (add demo-leaf.jpg here)
└── vercel.json            # SPA rewrite rules
```

---

*Built for African smallholder farmers. Designed to work on low-cost Android phones and slow connections.*
