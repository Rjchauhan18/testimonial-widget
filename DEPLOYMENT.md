# 🚀 DEPLOYMENT GUIDE

## Step 1: Push to GitHub (2 minutes)

```bash
cd /mnt/data/openclaw/workspace/testimonial-widget

# Initialize git
git init
git add .
git commit -m "Initial commit"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/testimonial-widget.git
git push -u origin main
```

---

## Step 2: Deploy to Vercel (5 minutes)

### Option A: Vercel Dashboard (Easiest)

1. Go to https://vercel.com
2. Click "Add New Project"
3. Import your GitHub repository
4. Add environment variables (see below)
5. Click "Deploy"

### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

---

## Step 3: Add Environment Variables

In Vercel Dashboard → Project Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc... (from Supabase)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dxxxxxx
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghij1234567890
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
```

---

## Step 4: Set Up Supabase (10 minutes)

1. Go to https://supabase.com
2. Create new project
3. Go to SQL Editor
4. Copy/paste `supabase-schema.sql` content
5. Click "Run"
6. Go to Settings → API
7. Copy "Project URL" and "anon public" key
8. Add to Vercel environment variables

---

## Step 5: Set Up Cloudinary (3 minutes)

1. Go to https://cloudinary.com
2. Sign up (free)
3. Copy from Dashboard:
   - Cloud Name
   - API Key
   - API Secret
4. Add to Vercel environment variables

---

## Step 6: Test Everything (5 minutes)

1. Open your deployed URL
2. Sign up for an account
3. Create a collection page
4. Submit a test testimonial
5. Approve it in dashboard
6. Copy embed code
7. Test on a test page

---

## Step 7: Tomorrow - Add Stripe

1. Create Stripe account
2. Add Stripe environment variables
3. Create pricing page
4. Launch on Reddit!

---

## Common Issues

**"Failed to submit testimonial"**
- Check Cloudinary credentials
- Verify video file size < 50MB

**"Database error"**
- Check Supabase credentials
- Ensure schema was run successfully

**"Widget not loading"**
- Check CORS settings in Supabase
- Verify userId is correct in embed URL

---

## Support

If you get stuck:
1. Check Vercel deployment logs
2. Check Supabase logs
3. Test locally first: `npm run dev`

Good luck! 🎉
