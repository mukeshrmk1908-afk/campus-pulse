# CampusPulse — Deployment Guide

## 1. Current Live Preview URL
Your application is already deployed and accessible at:
- **Shared Live Link:** https://ais-pre-ok7h2nlixwk254fsqa4hws-703672351919.asia-southeast1.run.app
- **Development Link:** https://ais-dev-ok7h2nlixwk254fsqa4hws-703672351919.asia-southeast1.run.app

---

## 2. Deploy to Vercel (Recommended — Free & Fast)

### Option A: Via GitHub (Continuous Deployment)
1. **Create a new repository on GitHub:**
   - Go to [github.com/new](https://github.com/new)
   - Name it `campuspulse` (or any name you prefer) and leave it public or private.
2. **Push your code to GitHub:**
   ```bash
   git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/campuspulse.git
   git push -u origin main
   ```
3. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
   - Click **"Add New..."** → **"Project"**.
   - Select your `campuspulse` repository.
   - Vercel automatically detects the configuration:
     - **Framework Preset:** `Vite`
     - **Build Command:** `npm run build`
     - **Output Directory:** `dist`
   - *(Optional)* Under **Environment Variables**, you can add your Supabase credentials:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
     *(If omitted, the app will run with full `localStorage` persistence automatically).*
   - Click **"Deploy"**.

### Option B: Deploy in 1 Minute via Vercel CLI
If you have Node.js installed on your computer:
```bash
# 1. Install Vercel CLI globally
npm install -g vercel

# 2. Run deploy command in the project folder
vercel

# 3. Follow the 3 prompts, and your site is instantly live!
```

---

## 3. Deploy to Netlify

### Option A: Drag-and-Drop (Instant No-Code)
1. Run `npm run build` locally (this generates the `dist/` directory).
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
3. Drag and drop the `dist` folder into the browser window.
4. Your site will be deployed immediately with a free `.netlify.app` URL.

### Option B: Netlify CLI
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

---

## 4. SPA Routing Notice
The file `vercel.json` has already been added to the root directory with the following contents:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```
This ensures that navigating directly to sub-routes (such as `/submit`, `/requests`, `/staff`, and `/faq`) or refreshing the page will never show a 404 error.
