# 📦 GitHub & Deployment Quick Start

Your CTF Practice Platform 2.0 is ready to deploy! Follow these simple steps.

## 🎯 Step 1: Create GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click the **"+"** icon → **"New repository"**
3. Name it: `ctf-practice-2.0`
4. Choose **Public** or **Private**
5. **DON'T** initialize with README (we already have one)
6. Click **"Create repository"**

## 🚀 Step 2: Push to GitHub

Run these commands in PowerShell:

\`\`\`powershell
cd "d:\\WSL\\CTF\\ctf practice\\ctf-practice 2.0"

# Add your GitHub repository (replace 'yourusername' with your GitHub username)
git remote add origin https://github.com/yourusername/ctf-practice-2.0.git

# Push to GitHub
git push -u origin main
\`\`\`

If prompted for credentials, use a **Personal Access Token** instead of password:
- Generate token at: https://github.com/settings/tokens
- Use token as password when prompted

## ☁️ Step 3: Deploy to Vercel (Recommended - Free!)

### Option A: Deploy via Website (Easiest)

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Import your `ctf-practice-2.0` repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = Your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your Supabase Anon Key
5. Click **"Deploy"**
6. Done! Your site is live! 🎉

### Option B: Deploy via CLI

\`\`\`powershell
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
cd "d:\\WSL\\CTF\\ctf practice\\ctf-practice 2.0"
vercel

# Add environment variables when prompted
# Or add them later in Vercel dashboard
\`\`\`

## 🌐 Step 4: Deploy to Render (Alternative - Free!)

1. Go to [render.com](https://render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect GitHub and select `ctf-practice-2.0`
4. Configure:
   - **Name**: `ctf-practice-platform`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NODE_VERSION` = `18`
6. Click **"Create Web Service"**
7. Wait for deployment (5-10 minutes)

## 🎊 Step 5: Test Your Live Site

Visit your deployed URL and test:
- ✅ Homepage loads
- ✅ User registration works
- ✅ Login works
- ✅ Challenges display
- ✅ Leaderboard shows

## 👨‍💼 Step 6: Make Yourself Admin

1. Register an account on your live site
2. Go to Supabase SQL Editor
3. Run this query:
   \`\`\`sql
   UPDATE users SET is_admin = true WHERE username = 'your_username';
   \`\`\`
4. Visit `https://your-site.com/admin` to create challenges!

## 🔄 Step 7: Update Your Deployment

When you make changes:

\`\`\`powershell
cd "d:\\WSL\\CTF\\ctf practice\\ctf-practice 2.0"
git add .
git commit -m "Description of changes"
git push
\`\`\`

Vercel/Render will automatically redeploy! ✨

## 📊 Your Project Stats

- ✅ **Framework**: Next.js 15 with React 19
- ✅ **Database**: Supabase PostgreSQL
- ✅ **Auth**: Supabase Auth
- ✅ **Styling**: Tailwind CSS 4
- ✅ **Animations**: Framer Motion
- ✅ **TypeScript**: Full type safety
- ✅ **Admin Panel**: Challenge management
- ✅ **RLS Security**: Database-level security

## 🆘 Troubleshooting

### "remote: Repository not found"
- Make sure you created the GitHub repository
- Replace `yourusername` with your actual GitHub username
- Check repository name matches exactly

### Build fails on Vercel/Render
- Check environment variables are set correctly
- Verify Supabase URL and key are correct
- Check build logs for specific errors

### Can't login after deployment
- Update Supabase Auth settings:
  - Site URL: `https://your-deployed-url.com`
  - Redirect URLs: Add your deployed URL

## 📚 Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)

## 🎉 You're All Set!

Your CTF platform is now:
- ✅ Backed up on GitHub
- ✅ Deployed and live
- ✅ Ready for users
- ✅ Easy to update

**Share your platform URL and start hosting CTF challenges!** 🚀

---

Need help? Check the full [DEPLOYMENT.md](./DEPLOYMENT.md) guide!
