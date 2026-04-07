# Testimonial Widget 🎉

A simple, beautiful testimonial collection tool inspired by Testimonial.to

## Features

- ✅ **Video & Text Testimonials** - Collect both formats with ease
- ✅ **4 Widget Layouts** - Grid, Carousel, Masonry, Wall of Love
- ✅ **One-Line Embed** - Add to any website with a script tag
- ✅ **Custom Branding** - Match your brand colors and logo
- ✅ **Moderation Dashboard** - Approve/reject before going live
- ✅ **Free Tier** - 10 testimonials/month free

## Tech Stack

- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Auth)
- **Video Storage:** Cloudinary
- **Hosting:** Vercel
- **Payments:** Stripe (coming tomorrow)

## Quick Start

### 1. Create Accounts (5 minutes)

- **Supabase:** https://supabase.com (free tier)
- **Cloudinary:** https://cloudinary.com (free tier - 25GB)
- **Vercel:** https://vercel.com (free tier)

### 2. Set Up Supabase (5 minutes)

1. Create a new project at https://supabase.com
2. Go to SQL Editor
3. Copy/paste the contents of `supabase-schema.sql`
4. Run it (creates all tables, policies, and triggers)
5. Get your Project URL and Anon Key from Settings → API

### 3. Set Up Cloudinary (2 minutes)

1. Sign up at https://cloudinary.com
2. Get your Cloud Name, API Key, and API Secret from Dashboard
3. Add them to `.env.local`

### 4. Configure Environment Variables

Copy `.env.local.example` to `.env.local` and fill in:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Run Locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

### 6. Deploy to Vercel (5 minutes)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
# Go to: Project Settings → Environment Variables
# Add all the variables from .env.local

# Redeploy
vercel --prod
```

## Usage

### For Users (Collecting Testimonials):

1. Sign up at your deployed URL
2. Get your unique collection page: `yourdomain.com/c/your-slug`
3. Share the link with customers
4. Approve testimonials in dashboard
5. Copy embed code and add to your website

### For Customers (Submitting Testimonials):

1. Click the collection page link
2. Fill in name, role, company
3. Write testimonial or record video
4. Submit!

### Embed on Website:

```html
<!-- Add this where you want testimonials to appear -->
<div id="testimonial-widget"></div>
<script src="https://yourdomain.com/api/embed?userId=YOUR_USER_ID" async></script>
```

## Pricing (Planned)

- **Free:** 10 testimonials/month, basic widgets
- **Pro ($19/mo):** Unlimited testimonials, all layouts, custom branding
- **Business ($49/mo):** Multiple users, API access, priority support

## Project Structure

```
testimonial-widget/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Landing page
│   │   ├── login/page.tsx        # Login
│   │   ├── signup/page.tsx       # Signup
│   │   ├── dashboard/page.tsx    # User dashboard
│   │   ├── c/[slug]/page.tsx     # Collection page
│   │   └── api/
│   │       ├── embed/route.ts    # Embed widget API
│   │       └── submit-testimonial/route.ts
│   ├── components/
│   │   ├── TestimonialForm.tsx   # Submission form
│   │   └── TestimonialWidget.tsx # Display widget
│   └── lib/
│       ├── supabase.ts           # Supabase client
│       └── cloudinary.ts         # Cloudinary integration
├── supabase-schema.sql           # Database schema
├── .env.local                    # Environment variables
└── README.md                     # This file
```

## Next Steps (Tomorrow)

- [ ] Add Stripe payments
- [ ] Create pricing page
- [ ] Add usage limits (free vs pro)
- [ ] Launch on Reddit
- [ ] Create demo video

## Support

Contact: your-email@example.com

---

Built with ❤️ in one night!
