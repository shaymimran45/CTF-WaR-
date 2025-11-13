# 🚀 Render Deployment Configuration

## Render Settings for CTF-WaR

Use these **exact settings** when deploying on Render:

### Basic Configuration

| Setting | Value |
|---------|-------|
| **Name** | `CTF-WaR` (or your preferred name) |
| **Language** | Node |
| **Branch** | `main` |
| **Region** | Oregon (US West) - or closest to you |
| **Root Directory** | *(leave empty)* |

### Build & Start Commands

| Command | Value |
|---------|-------|
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |

> ⚠️ **Important**: Do NOT use `yarn`. Use `npm` commands as shown above.

### Instance Type

For testing: **Free** ($0/month)
- ⚠️ Free instances spin down after inactivity
- Takes ~30 seconds to wake up on first request
- Perfect for testing and development

For production: **Starter** ($7/month) or higher
- No spin-down
- Faster performance
- Supports SSH, scaling, and persistent disks

### Environment Variables

Click **"Add Environment Variable"** and add these **two variables**:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |

**Where to find these values:**
1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy **Project URL** and **anon public** key

### Example:

```
NEXT_PUBLIC_SUPABASE_URL=https://vxsymuykobxshxzlctdm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step-by-Step Deployment

### 1. Fill in the Render Form

```
Name: CTF-WaR
Language: Node
Branch: main
Root Directory: (leave empty)
Build Command: npm install && npm run build
Start Command: npm start
```

### 2. Add Environment Variables

Click **"Add Environment Variable"** (twice) and add:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Select Instance Type

Choose **Free** for testing, or **Starter** ($7/mo) for production.

### 4. Deploy

Click **"Deploy web service"** at the bottom.

## What Happens Next

1. **Build phase** (~3-5 minutes)
   - Render installs dependencies
   - Compiles Next.js application
   - Creates production build

2. **Deploy phase** (~1 minute)
   - Starts the server
   - Runs health checks
   - Makes your site live

3. **Your site is live!** 🎉
   - URL: `https://ctf-war.onrender.com` (or similar)
   - First request may take 30 seconds (free tier only)

## Post-Deployment Steps

### 1. Test Your Site

Visit your Render URL and verify:
- ✅ Homepage loads
- ✅ You can register an account
- ✅ You can login
- ✅ Challenges display correctly
- ✅ Leaderboard works

### 2. Make Yourself Admin

1. Register an account on your live site
2. Go to Supabase SQL Editor
3. Run this query:

```sql
UPDATE users SET is_admin = true WHERE username = 'your_username';
```

4. Visit `/admin` on your site to create challenges

### 3. Update Supabase Auth Settings

1. Go to Supabase → **Authentication** → **URL Configuration**
2. Add these URLs:

**Site URL:**
```
https://ctf-war.onrender.com
```

**Redirect URLs:** (add both)
```
https://ctf-war.onrender.com/login
https://ctf-war.onrender.com/register
```

## Troubleshooting

### Build Fails

**Error**: "Command failed"
- **Solution**: Check build command is exactly: `npm install && npm run build`

**Error**: "Out of memory"
- **Solution**: Upgrade to Starter instance ($7/mo)

### Environment Variables Not Working

**Error**: "Failed to connect to Supabase"
- **Solution**: Double-check variables start with `NEXT_PUBLIC_`
- **Solution**: Verify values are correct (no extra spaces)
- **Solution**: Redeploy after adding variables

### Site Won't Load

**Error**: "Application failed to respond"
- **Solution**: Check start command is: `npm start`
- **Solution**: Check logs in Render dashboard

### 502 Bad Gateway (Free Tier)

This is normal for free tier after inactivity. Just wait 30 seconds and refresh.

## Monitoring Your Deployment

### View Logs

In Render dashboard:
1. Click your service
2. Go to **Logs** tab
3. See real-time server logs

### Check Status

- Green dot = Running
- Yellow dot = Building
- Red dot = Failed (check logs)

### Auto-Deploy

Render automatically redeploys when you push to GitHub!

```bash
git add .
git commit -m "Update challenge"
git push
```

Render will detect the push and redeploy automatically. ✨

## Performance Tips

### Speed Up Free Tier

Free instances sleep after 15 minutes. To keep them awake:
- Use a uptime monitoring service (e.g., UptimeRobot)
- Ping your site every 10 minutes
- Or upgrade to Starter ($7/mo) for always-on

### Optimize Build Time

Current build time: ~3-5 minutes (normal for Next.js)

To speed up:
- Use build cache (automatic on paid plans)
- Optimize dependencies
- Remove unused packages

## Cost Breakdown

| Plan | Price | Best For |
|------|-------|----------|
| **Free** | $0/mo | Testing, demos, personal projects |
| **Starter** | $7/mo | Small CTF events, always-on sites |
| **Standard** | $25/mo | Medium CTF events, better performance |

## Custom Domain (Optional)

### Add Your Domain

1. Go to Render → Service → **Settings**
2. Click **Add Custom Domain**
3. Enter: `ctf.yourdomain.com`
4. Add CNAME record in your DNS:

```
Type: CNAME
Name: ctf
Value: ctf-war.onrender.com
```

5. Wait for DNS propagation (~5-60 minutes)
6. SSL certificate auto-configured! 🔒

## Support & Help

- **Render Docs**: [render.com/docs](https://render.com/docs)
- **Render Discord**: Community support
- **GitHub Issues**: Report bugs in your repo

---

## Quick Reference

**Build Command:**
```bash
npm install && npm run build
```

**Start Command:**
```bash
npm start
```

**Environment Variables:**
```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

**Your Site Will Be At:**
```
https://ctf-war.onrender.com
```

---

**Ready to deploy? Click "Deploy web service" and watch your CTF platform come to life! 🚀**
