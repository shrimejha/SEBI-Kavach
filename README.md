# Investor Kavach 🛡️

**AI-Driven Multi-Modal Detection & Cryptographic Authentication Platform for Securities Markets**

Investor Kavach is an end-to-end, regulator-anchored trust and detection platform designed to protect retail investors, stock exchanges, and registered market intermediaries from synthetic deepfakes, cloned-voice vishing, financial phishing, forged circulars, and stock tip pump-and-dump fraud.

By combining **cryptographic perceptual hashing (pHash)** with a **multi-modal AI forensic engine** (Google Gemini 3.6, PyTorch Vision Transformers, 2D FFT Spectral Analysis, ELA, and Acoustic Vocoder Forensics), Investor Kavach delivers real-time protection across web, mobile, and Telegram channels.

---

## 🔑 Prepared Demo Accounts

For evaluator testing and demo presentations, the following pre-configured accounts are available directly on the login terminal (`/login`):

| Role | Email / ID | Password | Access & Capabilities |
| :--- | :--- | :--- | :--- |
| **Corporate Admin** | `admin@sebi.gov.in` | `sebi_admin_2026!` | Full software control, Admin Console (`/admin`), C2PA Manifest Issuance Authority, Scammer UPI Intel Store, Global Protection Metrics. |
| **Retail Investor** | `investor@sebi.gov.in` | `investor_pass_2026!` | Investor Dashboard (`/`), VerifyNet Hub (`/verifynet`), Scam Radar (`/radar`), Live 10s Liveness Challenge, ShieldTrain (`/training`). |
| **Market Analyst** | `analyst@nseindia.com` | `analyst_pass_2026!` | pHash Cryptographic Registry Search, Content Credentials Badge Inspection, Verification Audits. |

> 💡 **Quick Login**: Clicking any of the **Prepared Demo Accounts** buttons on the Login page auto-fills the credentials and logs in with 1 click.

---

## 🌟 Key Platform Features & UI Components

### 1. Executive Overview Dashboard (`InvestorDashboard.tsx`)
- **Real-Time Threat Level Status**: Displays live system health (`Current Threat Level: LOW`).
- **Interactive Immunity Score Gauge**: Dynamic SVG circular ring tracking user protection (e.g. `85% Immunity Score`).
- **VerifyNet Quick Check Bento Widget**: Multi-mode tabbed interface (*Upload*, *Link*, *Text*, *Registry*) for instant media & link inspection.
- **Live AI Detection Feed**: Auto-scrolling real-time audit log of intercepted scam attempts, phishing links, and fake circulars.
- **Market Sentiment Tracker**: Tracks trending fraud keywords (e.g. *"Pre-IPO Allocation Guaranteed"*).
- **Floating Scan Button**: Quick action pill button (`Scan Now`) providing instant access to the dropzone.

### 2. VerifyNet Trust Hub (`VerifyNetHub.tsx` & `phash_registry.py`)
- **Multi-Format Dropzone**: Drag & drop media inspection supporting Audio (`.mp3`, `.wav`), Video (`.mp4`), Images (`.jpg`, `.png`), and Documents (`.pdf`).
- **Official pHash Registry Search**: Instant search against SEBI/Exchange cryptographic hash databases.
- **Multi-Stage Real-Time Progress Indicators**:
  - `Mel-spectrogram extraction: 100%`
  - `Vision Transformer scan: 84%`
  - `pHash Registry lookup: Complete`
- **Interactive Verdict Cards**: Categorized responses (`VERIFIED`, `CONFIRMED SYNTHETIC`, `UNVERIFIED`) detailing technical artifacts (e.g. *Audio Anomalies (98%)*, *Registry Miss*).

### 3. Public Scam Radar Portal (`ScamRadarFeed.tsx`)
- **Global Activity Clusters Heat Map**: Real-time visual threat map showing scam origination nodes.
- **Threat Intelligence Table**: Detailed database of active threats featuring status badges (`Takedown Requested`, `Active Alert` pulsing dot, `Resolved`).
- **Search & Filter Controls**: Filter threats by ticker, channel (YouTube Shorts, WhatsApp Groups, Telegram), or threat type.
- **Community Reporting CTA**: Direct threat submission portal (*Spotted a Suspicious Activity? Submit a Threat Report*).

### 4. ShieldTrain Education Hub (`ShieldTrain.tsx`)
- **Immunity Score Ring (80%)**: Measures investor resilience against simulated phishing attempts.
- **Department Leaderboard**: Gamified ranking tracking top-performing organization members (*Amit Raj - 950 pts*, *Sneha Kapoor*, *Rahul Jain*).
- **Recent Simulated Campaigns**: History of simulated phishing tests with status pills (`Passed (Didn't share OTP)`, `Failed (Clicked Link)`).
- **Micro-Learning Moments**: 30-second targeted video lesson cards triggered after failed simulation tests.
- **Certifications & Badges Grid**: Earnable badges celebrating cybersecurity milestones.

### 5. Secure Access Terminal & Role-Based Auth (`Login.tsx`)
- **1:1 Visual Parity**: Built matching `Login_page_code.html` & `Login page design.png` with deep navy backdrop (`#0b1c30`), high-contrast `.glass-panel` card, and regulator warning disclaimer footer (`#ffdad6`).
- **Role-Based Accounts (Admin vs Investor)**: Top Account Role Selector supporting **Individual Investor** (redirects to `/`) and **Corporate / Admin Access** (redirects to `/admin` Admin Console for corporate software controls and C2PA authority management).
- **Supabase Auth Integration**: Supports Password login (`signInWithPassword`), Magic Link / OTP (`signInWithOtp`), and quick-start demo credentials.

### 6. Dynamic Dual-Theme System (`Layout.tsx` & `index.css`)
- **Day Mode (Light)**: Pristine pure white cards (`#ffffff`), soft ice-blue background (`#f8f9ff`), dark navy typography (`#0b1c30`).
- **Night Mode (Dark)**: Deep night blue background (`#060b17`), dark navy glass cards (`#0d162d`), white typography (`#ffffff`).
- **WebGL Shader Background**: Custom WebGL canvas shader (`WebGLShaderBackground.tsx`) rendering smooth background gradients.

---

## 🧠 Multi-Modal AI Engine & Forensic Pipeline

Investor Kavach operates a **Pure AI Inference Engine** (with 0 hardcoded demo rules or filename heuristics) that evaluates media based entirely on content:

```
                  ┌─────────────────────────────────────────┐
                  │ Inbound Media / Text / Link / Document  │
                  └────────────────────┬────────────────────┘
                                       │
                 ┌─────────────────────┴─────────────────────┐
                 ▼                                           ▼
   ┌───────────────────────────┐               ┌───────────────────────────┐
   │ Cryptographic pHash       │               │ Multi-Modal AI            │
   │ Registry Lookup (<150ms)  │               │ Forensic Inspection       │
   └─────────────┬─────────────┘               └─────────────┬─────────────┘
                 │                                           │
                 │                               ┌───────────┴───────────┐
                 │                               ▼                       ▼
                 │                 ┌───────────────────────────┐   ┌───────────────────────────┐
                 │                 │ PyTorch Vision            │   │ 2D FFT Spatial Frequency  │
                 │                 │ Transformer (ViT)         │   │ & ELA Compression         │
                 │                 └─────────────┬─────────────┘   └─────────────┬─────────────┘
                 │                               │                               │
                 │                               └───────────┬───────────────────┘
                 │                                           │
                 ▼                                           ▼
   ┌───────────────────────────────────────────────────────────────────────┐
   │ Google Gemini 3.6 Multimodal AI (Vision & Financial NLP Reasoning)    │
   └───────────────────────────────────┬───────────────────────────────────┘
                                       │
                                       ▼
   ┌───────────────────────────────────────────────────────────────────────┐
   │ Final Ensemble Verdict: VERIFIED | UNVERIFIED | CONFIRMED SYNTHETIC   │
   └───────────────────────────────────────────────────────────────────────┘
```

### 1. Google Gemini 3.6 Multimodal AI (`gemini-3.6-flash`)
- **Vision AI**: Inspects images for deepfake face swapping, synthetic skin textures, digital art generation, and impossible lighting.
- **Financial NLP**: Analyzes text messages and URLs for SEBI notice forgery, guaranteed return promises, stock tip scams, and demat unfreeze phishing domains.

### 2. Local PyTorch Vision Transformer (`zotac-pc/verilens-deepfake-detector`)
- Evaluates spatial pixel boundaries and deepfake facial distortion signatures.

### 3. 2D Fast Fourier Transform (FFT) Spectral Forensics
- Computes 2D Fast Fourier Transform magnitude spectra (`np.fft.fft2`) to identify periodic high-frequency grid lattice artifacts characteristic of Midjourney, DALL-E, Stable Diffusion, and GAN generators.

### 4. Error Level Analysis (ELA) Compression Forensics
- Re-compresses images at 95% JPEG quality and measures per-pixel difference variance across regions to detect digital manipulation boundaries.

### 5. Acoustic Neural Vocoder Zero-Crossing Forensics
- Analyzes audio clips for zero-crossing rate dynamics, high-frequency phase alignment, and spectral pitch variance to detect synthetic voice clones (ElevenLabs, WaveNet, Tacotron).

### 6. Perceptual Hashing (pHash) Cryptographic Lookup
- Computes 64-bit perceptual hashes (`imagehash.phash`) during official registration and matches inbound media via Hamming distance ($d \le 6$) regardless of downscaling or re-encoding.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS v4, WebGL Shader, Material Symbols
- **Backend**: FastAPI (Python 3.11), Uvicorn, Async Background Worker
- **AI & ML**: Google Gemini SDK (`google-genai`), PyTorch (`torch`), HuggingFace `transformers`, NumPy, Pillow, OpenCV (`cv2`), `imagehash`
- **Database & Auth**: Supabase PostgreSQL, Row-Level Security (RLS), Supabase Auth
- **Bot Integration**: Telegram Bot API (`python-telegram-bot` / `httpx`)
- **Deployment**: Vercel (Frontend SPA), Railway (Backend API), Supabase Cloud (Database)

---

## 🚀 How to Run Locally

### 1. Prerequisites
- Node.js (v18+)
- Python 3.10+
- Google Gemini API Key

### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt
```

Configure `backend/.env`:
```env
TELEGRAM_BOT_TOKEN="your_telegram_bot_token"
GEMINI_API_KEY="your_gemini_api_key"
HF_API_TOKEN="your_huggingface_token"
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your_supabase_service_role_key"
PORT=8000
```

Start the FastAPI backend server:
```bash
uvicorn main:app --reload --port 8000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Configure `frontend/.env`:
```env
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your_supabase_anon_key"
VITE_BACKEND_URL="http://localhost:8000"
```

Start the Vite development server:
```bash
npm run dev
```
Access the application at `http://localhost:5173`.

---

## 🌐 Production Deployment Guide

### 1. Database Provisioning (Supabase PostgreSQL)
1. Create a PostgreSQL project on [Supabase](https://supabase.com).
2. Execute the database schema script from [`supabase_setup.sql`](file:///d:/SEBI/SEBI_Kavach/supabase_setup.sql) in the Supabase SQL Editor.
3. Provisions `public.profiles`, `public.scan_history`, Row Level Security (RLS) policies, and automated user creation triggers.

### 2. Backend API Deployment (Railway)
1. Deploy the root repository to [Railway](https://railway.app).
2. Set root directory or launch command: `uvicorn main:app --host 0.0.0.0 --port $PORT`.
3. Set health check path: `/health`.

### 3. Frontend Deployment (Vercel)
1. Import repository into [Vercel](https://vercel.com).
2. Set root directory to `frontend`.
3. Build command: `npm run build`, Output directory: `dist`.

---

## 🔍 Verification & Monitoring Endpoints

- **System Health Probe**: `GET /health` $\rightarrow$ `{"status": "ok"}`
- **Integration Debug Check**: `GET /debug/env`
- **Interactive OpenAPI Documentation**: `GET /docs`
