# Muslim Abbas — Portfolio

**Supply Chain & Procurement Professional**  
Karachi, Pakistan

A professional portfolio showcasing case studies in Sustainable Supply Chain Management and Industry 4.0 Adoption. Built with Vite and deployed on Railway.

---

## Tech Stack

| Layer        | Technology                                 |
|--------------|--------------------------------------------|
| Build Tool   | [Vite](https://vitejs.dev/) v6             |
| Frontend     | Vanilla HTML + CSS + JavaScript (ES Modules)|
| Styling      | Custom CSS (IBM Plex Sans, IBM Plex Mono)  |
| Server       | [Express](https://expressjs.com/) v4       |
| Contact Form | Nodemailer + Gmail SMTP                    |
| Deployment   | [Railway](https://railway.app/)            |

---

## Project Structure

```
Portfolio/
├── server.js                   # Express production server (Railway entry point)
├── index.html                  # Main SPA entry point
├── railway.json                # Railway build/start/health configuration
├── package.json                # Scripts + dependencies
├── .env.example                # Environment variable template
├── .gitignore
│
├── src/
│   ├── css/
│   │   └── style.css           # All styles
│   ├── data/
│   │   ├── profile.js          # Personal info, highlights, metrics
│   │   ├── experience.js       # Work history
│   │   ├── skills.js           # Skill categories + certifications
│   │   └── projects.js         # Full data for both case studies
│   └── js/
│       ├── main.js             # App entry point / orchestrator
│       ├── modal.js            # Case study modal controller + deep linking
│       ├── render-case-study.js# Renders case study HTML from data
│       └── contact.js          # Contact form -> POST /api/contact
│
├── public/                     # Static assets (copied to dist/ by Vite)
│   ├── favicon.svg
│   ├── og-image.svg
│   ├── robots.txt
│   ├── sitemap.xml
│   └── site.webmanifest
│
└── dist/                       # Production build output (auto-generated)
```

---

## Local Development

### Prerequisites
- Node.js v18+
- npm v9+

### Install
```bash
npm install
```

### Run dev server (Vite HMR)
```bash
npm run dev
```
Visit `http://localhost:5173`

> Note: In dev mode, `/api/contact` is not served by Vite.
> The form will work after you build and run `npm start`.

### Build for production
```bash
npm run build
```
Output goes to `dist/`.

### Run production server locally
```bash
npm start
```
Visit `http://localhost:3000`

This runs the full Express server exactly as Railway does — including `/api/contact` and SPA routing.

---

## Contact Form

The contact form uses **Nodemailer** to send real emails via Gmail SMTP.

Flow:
1. User fills the form → `POST /api/contact` (server validates + sends email)
2. Server sends an email to `CONTACT_EMAIL_TO` via `SMTP_USER` credentials
3. User sees a success or error message

### Gmail App Password Setup (one-time)
1. Go to https://myaccount.google.com/apppasswords
2. Sign in → Select app: **Mail** → Select device: **Other** → click **Generate**
3. Copy the 16-character password → paste into `SMTP_PASS` environment variable

If SMTP is not configured, submissions are still logged to Railway logs (no email sent).

---

## Environment Variables

Copy `.env.example` to `.env` for local testing:

| Variable            | Required | Description                                      |
|---------------------|----------|--------------------------------------------------|
| `PORT`              | No       | Set automatically by Railway. Default: `3000`    |
| `SITE_URL`          | Yes      | Your Railway public URL (for CORS)               |
| `SMTP_HOST`         | No*      | Gmail: `smtp.gmail.com`                          |
| `SMTP_PORT`         | No*      | Gmail: `587`                                     |
| `SMTP_SECURE`       | No*      | `false` for port 587, `true` for port 465        |
| `SMTP_USER`         | No*      | Your Gmail address                               |
| `SMTP_PASS`         | No*      | Gmail App Password (16 characters)               |
| `CONTACT_EMAIL_TO`  | No*      | Email address to receive form submissions        |
| `NODE_ENV`          | No       | Set to `production` on Railway                   |

*Required only if you want email sending. If omitted, form submissions are logged to console.

---

## Case Study Deep Links

| Case Study     | URL                            |
|----------------|--------------------------------|
| Power Cement   | `/projects/power-cement`       |
| Industry 4.0   | `/projects/industry-4`         |

These are handled by:
1. Express SPA fallback: all unknown routes serve `dist/index.html`
2. Client-side: `handleDirectRoute()` in `src/js/modal.js`

---

## API Endpoints

| Method | Path          | Description                         |
|--------|---------------|-------------------------------------|
| GET    | `/*`          | Serves frontend SPA                 |
| POST   | `/api/contact`| Contact form submission             |
| GET    | `/api/health` | Health check `{"status":"ok"}`      |

---

## RAILWAY DEPLOYMENT

### Step 1 — Push to GitHub

```bash
# If you haven't already added a remote:
git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
git branch -M main
git push -u origin main
```

> Make sure `package-lock.json` is committed (it is — see `.gitignore`).

---

### Step 2 — Create a Railway Project

1. Go to [railway.app](https://railway.app) and sign in (GitHub login is easiest)
2. Click **+ New Project**
3. Choose **Deploy from GitHub repo**
4. Authorize Railway to access your GitHub if prompted
5. Select your `portfolio` repository

---

### Step 3 — Configure the Service

Railway reads `railway.json` automatically. It will:
- **Build command:** `npm run build` (runs Vite)
- **Start command:** `npm start` (runs Express server)
- **Health check:** `GET /api/health`

No manual build/start configuration is needed.

---

### Step 4 — Add Environment Variables

In Railway dashboard → your service → **Variables** tab → click **+ New Variable** for each:

| Variable            | Value                                         |
|---------------------|-----------------------------------------------|
| `NODE_ENV`          | `production`                                  |
| `SITE_URL`          | Your Railway URL (set after getting domain)   |
| `SMTP_HOST`         | `smtp.gmail.com`                              |
| `SMTP_PORT`         | `587`                                         |
| `SMTP_SECURE`       | `false`                                       |
| `SMTP_USER`         | `your-gmail@gmail.com`                        |
| `SMTP_PASS`         | Your Gmail App Password (16 chars)            |
| `CONTACT_EMAIL_TO`  | `your-gmail@gmail.com`                        |

> `PORT` is set automatically by Railway — **do NOT add it manually**.

---

### Step 5 — Generate Public Domain

1. In Railway → your service → **Settings** tab
2. Scroll to **Networking** → click **Generate Domain**
3. Railway gives you a URL like `https://portfolio-production-xxxx.up.railway.app`
4. Copy this URL → go back to **Variables** → set `SITE_URL` to this URL
5. Railway will auto-redeploy with the updated variable

---

### Step 6 — Verify Deployment

Test these URLs after deployment:

| URL                                    | Expected                    |
|----------------------------------------|-----------------------------|
| `https://your-domain.up.railway.app/`  | Portfolio loads             |
| `https://your-domain.up.railway.app/projects/power-cement` | Modal opens  |
| `https://your-domain.up.railway.app/api/health` | `{"status":"ok"}`  |
| Contact form submission                | Success message + email     |

---

### Step 7 — Redeploy After Changes

Every `git push` to your `main` branch triggers an automatic Railway redeploy:

```bash
git add .
git commit -m "your change description"
git push
```

Railway builds and deploys within ~1-2 minutes.

---

## Performance

- Total JS bundle: ~52 KB gzip ~13 KB
- Total CSS: ~38 KB gzip ~7 KB
- All diagrams are inline SVG (zero image assets)
- Google Fonts loaded with `preconnect`
- Hashed assets cached for 1 year (immutable)
- `prefers-reduced-motion` respected

## Security

- `helmet` sets security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy etc.)
- CORS locked to `SITE_URL` + localhost in development
- Input size limited to 10kb per request
- Server-side validation on all contact form fields
- Honeypot field rejects bots silently
- No secrets committed to git

## Browser Support

Modern browsers (Chrome, Firefox, Safari, Edge). IE is not supported.
