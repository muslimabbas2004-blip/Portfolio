# Muslim Abbas — Portfolio

**Supply Chain & Procurement Professional**
Karachi, Pakistan

A professional portfolio showcasing case studies in Sustainable Supply Chain Management and Industry 4.0 Adoption, built with Vite and deployed on Netlify.

---

## Tech Stack

| Layer        | Technology                          |
|--------------|-------------------------------------|
| Build Tool   | [Vite](https://vitejs.dev/) v6      |
| Frontend     | Vanilla HTML + CSS + JavaScript (ESM)|
| Styling      | Custom CSS (IBM Plex Sans, IBM Plex Mono) |
| Backend      | Netlify Forms + Netlify Function     |
| Deployment   | [Netlify](https://netlify.com/)     |

---

## Project Structure

```
Portfolio/
├── index.html                  # Main entry point (SEO, form, modals)
├── netlify.toml                # Netlify build + routing + headers config
├── package.json                # Build scripts + devDependencies
├── .env.example                # Environment variable template
├── .gitignore
│
├── src/
│   ├── css/
│   │   └── style.css           # All styles (extracted from original)
│   ├── data/
│   │   ├── profile.js          # Personal info, highlights, metrics
│   │   ├── experience.js       # Work history
│   │   ├── skills.js           # Skill categories + certifications
│   │   └── projects.js         # Full structured data for both case studies
│   └── js/
│       ├── main.js             # App entry point / orchestrator
│       ├── modal.js            # Case study modal controller + deep linking
│       ├── render-case-study.js# Renders case study HTML from projects.js data
│       └── contact.js          # Netlify Forms submission + validation
│
├── public/                     # Static assets (copied to dist/ by Vite)
│   ├── favicon.svg
│   ├── og-image.svg            # Open Graph social preview
│   ├── robots.txt
│   ├── sitemap.xml
│   └── site.webmanifest
│
├── netlify/
│   └── functions/
│       └── contact.js          # Serverless function (fallback contact endpoint)
│
└── dist/                       # Production build output (auto-generated)
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- npm v9+

### Install
```bash
npm install
```

### Run locally
```bash
npm run dev
```
Visit `http://localhost:5173`

### Build for production
```bash
npm run build
```
Output is in the `dist/` folder.

### Preview production build locally
```bash
npm run preview
```
Visit `http://localhost:4173`

---

## Contact Form

The contact form uses **Netlify Forms** natively:
- The form includes `data-netlify="true"` and a hidden `form-name` field
- Netlify automatically intercepts and stores submissions at deploy time
- A honeypot `bot-field` prevents spam bots from submitting
- A Netlify serverless function at `/.netlify/functions/contact` provides a fallback endpoint
- All validation (name, email, subject, message) runs client-side before submission

**After deploying to Netlify**, form submissions will appear in your Netlify dashboard under **Forms** → **contact**.

---

## Environment Variables

Copy `.env.example` to `.env` for local overrides:

```env
VITE_SITE_URL=https://muslimabbas.netlify.app
VITE_CONTACT_FORM_ENDPOINT=/.netlify/functions/contact
```

> **Note:** Variables prefixed `VITE_` are bundled into the client. Never store private API secrets in frontend variables.

---

## How to Edit Content

### Personal info, metrics, links
→ Edit `src/data/profile.js`

### Work experience
→ Edit `src/data/experience.js`

### Skills and certifications
→ Edit `src/data/skills.js`

### Case study content (Power Cement / Industry 4.0)
→ Edit `src/data/projects.js`

Each project in `projects.js` is a structured object with:
- `id`, `title`, `subtitle`, `category`, `tags`
- `overview`, `metrics`, `methodology`, `focusAreas`
- `sdgs`, `challenges`, `findings`, `recommendations`
- `limitations`, `takeaway` (Power Cement)
- `evolution`, `complexity`, `people`, `techStack`, `frameworks`, `hypothesis`, `benefits`, `roadmap`, `pillars`, `insight` (Industry 4.0)

The UI automatically renders from this data — no hard-coded HTML in JS files.

---

## Case Study Deep Links

Both case studies support direct URL navigation:

| Case Study            | URL                                    |
|-----------------------|----------------------------------------|
| Power Cement          | `/projects/power-cement`               |
| Industry 4.0          | `/projects/industry-4`                 |

These are handled by:
1. Netlify SPA redirect rule (`netlify.toml`)
2. JavaScript `handleDirectRoute()` in `src/js/modal.js`

---

## Netlify Deployment

### First Deployment
1. Push repository to GitHub
2. Go to [netlify.com](https://app.netlify.com) → **Add new site** → **Import from Git**
3. Select your repository
4. Netlify will auto-detect `netlify.toml`:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Functions directory:** `netlify/functions`
5. Click **Deploy**

### Updating
Every push to your main branch triggers an automatic rebuild.

### Forms
After first deploy, go to **Netlify Dashboard** → **Forms** to see contact submissions.

---

## SEO & Sharing

- `<title>`, `<meta description>`, `<link rel="canonical">` are set in `index.html`
- Open Graph tags (`og:title`, `og:image`, etc.) are configured for social sharing
- Twitter Card metadata is included
- `robots.txt` allows all crawlers
- `sitemap.xml` lists all canonical URLs

---

## Performance Notes

- Total JS bundle: ~52 KB (gzip: ~13 KB)
- Total CSS: ~38 KB (gzip: ~7 KB)
- All diagrams and illustrations are pure SVG (zero image assets)
- Fonts loaded from Google Fonts CDN with `preconnect`
- `prefers-reduced-motion` is respected — all animations are disabled when the user prefers it

---

## Browser Support

Modern browsers (Chrome, Firefox, Safari, Edge). IE is not supported.
