# Deployment Guide 🚀

Complete guide for deploying the CTF Practice Platform to various hosting services.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Vercel Deployment](#vercel-deployment-recommended)
- [Render Deployment](#render-deployment)
- [Netlify Deployment](#netlify-deployment)
- [Railway Deployment](#railway-deployment)
- [Post-Deployment Setup](#post-deployment-setup)

---

## Prerequisites

Before deploying, ensure you have:

1. ✅ A GitHub account
2. ✅ Your code pushed to a GitHub repository
3. ✅ A Supabase project with the database schema set up
4. ✅ Your Supabase URL and Anon Key ready

---

## Vercel Deployment (Recommended)

Vercel is the easiest way to deploy Next.js applications.

### Step 1: Push to GitHub

\`\`\`bash
cd "d:\\WSL\\CTF\\ctf practice\\ctf-practice 2.0"
git init
git add .
git commit -m "Initial commit: CTF Practice Platform 2.0"
git branch -M main
git remote add origin https://github.com/yourusername/ctf-practice-2.0.git
git push -u origin main
\`\`\`

### Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New Project"**
3. Import your `ctf-practice-2.0` repository
4. Configure project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./`
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

### Step 3: Add Environment Variables

In Vercel dashboard, add:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
\`\`\`

### Step 4: Deploy

Click **"Deploy"** and wait for the build to complete. Your site will be live at `https://your-project.vercel.app`!

---

## Render Deployment

Render is a great alternative with free tier support.

### Step 1: Create Web Service

1. Go to [render.com](https://render.com) and sign in
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository

### Step 2: Configure Service

- **Name**: `ctf-practice-platform`
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Root Directory**: Leave blank
- **Runtime**: `Node`
- **Build Command**:
  \`\`\`bash
  npm install && npm run build
  \`\`\`
- **Start Command**:
  \`\`\`bash
  npm start
  \`\`\`

### Step 3: Add Environment Variables

Click **"Environment"** and add:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NODE_VERSION=18
\`\`\`

### Step 4: Deploy

Click **"Create Web Service"**. Render will build and deploy your app at `https://ctf-practice-platform.onrender.com`

---

## Netlify Deployment

### Step 1: Create Site

1. Go to [netlify.com](https://netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect to GitHub and select your repository

### Step 2: Build Settings

- **Base directory**: Leave blank
- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Functions directory**: Leave blank

### Step 3: Add Environment Variables

In **Site settings** → **Environment variables**, add:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
\`\`\`

### Step 4: Add netlify.toml

Create `netlify.toml` in project root:

\`\`\`toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
\`\`\`

### Step 5: Deploy

Push changes and Netlify will auto-deploy!

---

## Railway Deployment

### Step 1: Create Project

1. Go to [railway.app](https://railway.app)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**

### Step 2: Configure

- Railway auto-detects Next.js
- **Start Command**: `npm start`

### Step 3: Add Environment Variables

In project settings, add:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
\`\`\`

### Step 4: Deploy

Railway will automatically deploy. Your app will be available at `https://your-app.up.railway.app`

---

## Post-Deployment Setup

### 1. Test Your Deployment

Visit your deployed URL and verify:
- ✅ Homepage loads correctly
- ✅ Registration works
- ✅ Login works
- ✅ Challenges display
- ✅ Leaderboard loads

### 2. Create Admin User

1. Register a user on your deployed site
2. In Supabase SQL Editor:
   \`\`\`sql
   UPDATE users SET is_admin = true WHERE username = 'your_username';
   \`\`\`
3. Access `/admin` to create challenges

### 3. Update Supabase Auth Settings

In Supabase Dashboard → **Authentication** → **URL Configuration**, add:

- **Site URL**: `https://your-deployed-app.com`
- **Redirect URLs**: 
  - `https://your-deployed-app.com/login`
  - `https://your-deployed-app.com/register`

### 4. Configure CORS (if needed)

In Supabase → **Settings** → **API**, ensure your domain is allowed.

---

## Troubleshooting

### Build Fails

- Check Node.js version (use 18+)
- Verify all dependencies are in `package.json`
- Check build logs for specific errors

### Environment Variables Not Working

- Ensure variables start with `NEXT_PUBLIC_`
- Redeploy after adding variables
- Check spelling and formatting

### Database Connection Issues

- Verify Supabase URL and key are correct
- Check Supabase project is active
- Ensure RLS policies are set up

### 404 Errors

- Make sure `package.json` has correct start script
- Verify Next.js version is 15+
- Check deployment logs

---

## Performance Optimization

### 1. Enable Caching

Add to `next.config.ts`:

\`\`\`typescript
const nextConfig = {
  swcMinify: true,
  images: {
    domains: ['your-supabase-project.supabase.co'],
  },
};
\`\`\`

### 2. Add CDN

- Vercel: Built-in CDN
- Render: Add Cloudflare
- Netlify: Built-in CDN

### 3. Database Optimization

- Add indexes in Supabase
- Use connection pooling
- Enable caching for static data

---

## Custom Domain Setup

### Vercel

1. Go to project settings → **Domains**
2. Add your domain
3. Update DNS records as shown

### Render

1. Settings → **Custom Domains**
2. Add domain and configure DNS

### Netlify

1. Domain settings → **Add custom domain**
2. Follow DNS configuration steps

---

## Monitoring & Analytics

### Add Analytics

1. **Vercel Analytics**: Built-in (upgrade required)
2. **Google Analytics**: Add script to `layout.tsx`
3. **Plausible**: Privacy-friendly alternative

### Monitor Performance

- Use Vercel Speed Insights
- Check Lighthouse scores
- Monitor Supabase usage

---

## Security Checklist

- ✅ Environment variables are secret
- ✅ RLS policies are enabled
- ✅ HTTPS is enforced
- ✅ CORS is configured
- ✅ No hardcoded credentials
- ✅ Regular dependency updates

---

## Need Help?

- Check deployment logs
- Review platform documentation
- Open an issue on GitHub
- Contact support for hosting provider

---

**Your CTF platform is now live! 🎉**
