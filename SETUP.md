# 🚀 Deployment Setup Guide

## ✅ What's Already Done

- **GitHub Repo:** https://github.com/Rjchauhan18/testimonial-widget
- **Supabase:** Connected (Mumbai region)
- **Cloudinary:** Connected (dir9vnghv)

## 🔐 GitHub Environment Variables Setup

To deploy securely, set up environment variables in GitHub:

### Step 1: Create Production Environment

1. Go to: https://github.com/Rjchauhan18/testimonial-widget/settings/environments
2. Click **"New environment"**
3. Name: `production`
4. Click **"Configure environment"**

### Step 2: Add Variables

Click **"Add variable"** for each:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://gasknkywayrtaqzfjhev.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_EshOhfkC-L1m1ZclDZ_bUQ_uy3LrT6W` |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | `dir9vnghv` |
| `CLOUDINARY_API_KEY` | `937197446614785` |
| `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` (update after deployment) |

### Step 3: Add Secrets

Click **"Add secret"** for sensitive values:

| Name | Value |
|------|-------|
| `CLOUDINARY_API_SECRET` | `uR2uyhXzTpbO3HgKsWV8MbZmjzg` |

## 🌐 Deploy to Vercel

### Option 1: Vercel Dashboard (Easiest)

1. Go to https://vercel.com
2. Click **"Add New Project"**
3. Import your GitHub repo: `Rjchauhan18/testimonial-widget`
4. Vercel will auto-detect Next.js
5. Add the environment variables from above
6. Click **"Deploy"**

### Option 2: Vercel CLI

```bash
npm i -g vercel
cd testimonial-widget
vercel login
vercel --prod
```

## 🧪 Local Development

```bash
cd testimonial-widget
npm install
npm run dev
```

Open http://localhost:3000

## 📁 Project Structure

```
testimonial-widget/
├── app/                    # Next.js 14 App Router
│   ├── (auth)/            # Login/Signup pages
│   ├── (main)/            # Dashboard pages
│   ├── api/               # API routes
│   └── page.tsx           # Landing page
├── components/            # React components
├── lib/                   # Utilities (Supabase, Cloudinary)
├── .env.local            # Local env (gitignored)
├── .env.example          # Template for env vars
└── supabase-schema.sql   # Database schema
```

## 🔧 Services Connected

### Supabase
- **URL:** https://gasknkywayrtaqzfjhev.supabase.co
- **Region:** Mumbai (ap-south-1)
- **Tables:** users, testimonials, collection_pages, widgets
- **Auth:** Email + Password enabled
- **RLS:** Enabled on all tables

### Cloudinary
- **Cloud Name:** dir9vnghv
- **Plan:** Free (25GB storage)
- **Use:** Video & image storage for testimonials

---

**Need help?** Check the main README.md or open an issue on GitHub.
