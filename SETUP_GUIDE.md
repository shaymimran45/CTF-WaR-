# CyberCTF - Complete Setup Guide

A modern, full-stack CTF platform with Supabase backend, real-time leaderboards, and challenge management.

## 🚀 Features

### Frontend
- ✨ Beautiful UI with Framer Motion animations
- 📱 Fully responsive design
- 🎨 Modern gradients and smooth transitions
- ⚡ Fast page loads with Next.js 15
- 🔄 Real-time updates

### Backend & Features
- 🔐 **Authentication** - Secure user signup/login with Supabase Auth
- 🏆 **Leaderboard** - Real-time rankings based on points and solves
- 🎯 **Challenges** - Dynamic challenge loading from database
- ✅ **Flag Submission** - Automatic validation and scoring
- 📊 **User Progress** - Track solved challenges and points
- 💾 **Database** - PostgreSQL with Row Level Security (RLS)

## 📦 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Backend**: Supabase (PostgreSQL + Auth)
- **State Management**: React Context API

## 🛠️ Installation

### Prerequisites
- Node.js 18+ and npm
- Supabase account ([signup here](https://supabase.com))

### Step 1: Clone and Install

```bash
git clone <your-repo>
cd ctf-practice
npm install
```

### Step 2: Set Up Supabase

1. **Create a new project** on [Supabase](https://supabase.com)

2. **Run the database schema**:
   - Go to SQL Editor in your Supabase dashboard
   - Copy the contents of `database-schema.sql`
   - Execute the script to create tables, policies, and sample data

3. **Get your API credentials**:
   - Go to Project Settings > API
   - Copy the `Project URL` and `anon public` key

### Step 3: Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace the values with your actual Supabase credentials.

### Step 4: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your CTF platform!

## 📁 Project Structure

```
ctf-practice/
├── src/
│   ├── app/                    # Next.js pages
│   │   ├── challenges/         # Challenges list & detail pages
│   │   ├── leaderboard/        # Leaderboard page
│   │   ├── login/              # Login page
│   │   ├── register/           # Registration page
│   │   ├── profile/            # User profile page
│   │   ├── layout.tsx          # Root layout with AuthProvider
│   │   ├── page.tsx            # Home page
│   │   └── globals.css         # Global styles
│   ├── components/             # Reusable components
│   │   ├── Navigation.tsx      # Nav bar with auth state
│   │   └── Animations.tsx      # Animation components
│   ├── contexts/               # React contexts
│   │   └── AuthContext.tsx    # Authentication context
│   └── lib/                    # Backend services
│       ├── supabase.ts         # Supabase client & types
│       ├── authService.ts      # Auth functions
│       ├── challengeService.ts # Challenge CRUD operations
│       └── leaderboardService.ts # Leaderboard logic
├── database-schema.sql         # Supabase database setup
├── .env.local.example          # Example environment variables
└── package.json
```

## 🎮 Usage

### For Players

1. **Sign Up**: Create an account with username, email, and password
2. **Browse Challenges**: View challenges filtered by category and difficulty
3. **Solve Challenges**: Submit flags to earn points
4. **Track Progress**: Check your rank and solved challenges on your profile
5. **Compete**: View the leaderboard and compete with other players

### For Admins

**Add New Challenges** via Supabase Dashboard:

1. Go to Table Editor > `problems`
2. Click "Insert Row"
3. Fill in:
   - Title, description, category
   - Difficulty (Easy/Medium/Hard)
   - Points value
   - Correct flag
   - Hints (array of strings)
   - Optional: Files (JSON format)

**Example challenge insert**:
```sql
INSERT INTO problems (title, description, category, difficulty, points, flag, hints)
VALUES (
  'My Challenge',
  'Challenge description here',
  'crypto',
  'Medium',
  300,
  'CTF{flag_here}',
  ARRAY['Hint 1', 'Hint 2']
);
```

## 🔒 Security Features

- **Row Level Security (RLS)** - Database-level access control
- **Secure Authentication** - Supabase Auth with email/password
- **Password Validation** - Minimum 8 characters required
- **Protected Routes** - Login required for submissions
- **SQL Injection Protection** - Parameterized queries
- **XSS Protection** - React's built-in escaping

## 🎨 Customization

### Change Theme Colors

Edit `src/app/globals.css`:
```css
:root {
  --primary: #your-color;
  --background: #your-bg-color;
}
```

### Add New Categories

1. Insert into `categories` table in Supabase
2. Use Tailwind gradient classes for colors (e.g., `from-color-500 to-color-600`)

### Modify Animations

Edit `src/components/Animations.tsx` to customize animation timings and effects.

## 📊 Database Schema

### Main Tables

- **categories**: Challenge categories (web, crypto, pwn, etc.)
- **problems**: CTF challenges with descriptions, flags, hints
- **users**: User profiles linked to Supabase Auth
- **submissions**: All flag submission attempts
- **user_progress**: Tracks which challenges users have solved

### Relationships

```
users (1) ----< (*) user_progress (*) >---- (1) problems
users (1) ----< (*) submissions (*) >---- (1) problems
categories (1) ----< (*) problems
```

## 🚀 Deployment

### Deploy to Vercel

```bash
npm run build
vercel --prod
```

Add environment variables in Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Other Platforms

The app can be deployed to any platform supporting Next.js:
- Netlify
- Railway
- AWS Amplify
- Self-hosted with Docker

## 🐛 Troubleshooting

### "Failed to fetch challenges"
- Check `.env.local` has correct Supabase credentials
- Verify database schema was executed successfully
- Check RLS policies are enabled

### "Authentication error"
- Ensure Supabase project has Email Auth enabled
- Check API keys are correct
- Verify users table exists with proper schema

### "Submissions not working"
- Login first before submitting flags
- Check `submissions` and `user_progress` tables exist
- Verify RLS policies allow authenticated users to insert

## 📝 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this for your CTF events!

## 🙏 Acknowledgments

- Supabase for the backend infrastructure
- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS
- Framer Motion for smooth animations

---

**Need Help?** Open an issue or check the [Supabase docs](https://supabase.com/docs)

Happy Hacking! 🚩
