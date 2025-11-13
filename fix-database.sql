-- DATABASE FIX FOR CTF PLATFORM
-- Run this in Supabase SQL Editor

-- 1. Drop existing users table if it has foreign key issues
DROP TABLE IF EXISTS users CASCADE;

-- 2. Create users table WITHOUT foreign key to auth.users
CREATE TABLE users (
  id UUID PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'user',
  points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies for users table

-- Allow anonymous users to insert (for registration)
CREATE POLICY "users_insert_anon" ON users
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated users to insert
CREATE POLICY "users_insert_authenticated" ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow everyone to read all users (for leaderboard)
CREATE POLICY "users_select_all" ON users
  FOR SELECT
  TO public
  USING (true);

-- Allow users to update their own data
CREATE POLICY "users_update_own" ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- 5. Create challenges table if not exists
CREATE TABLE IF NOT EXISTS challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  points INTEGER NOT NULL DEFAULT 100,
  flag TEXT NOT NULL,
  hints TEXT[] DEFAULT ARRAY[]::TEXT[],
  files JSONB DEFAULT '[]'::JSONB,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for challenges
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;

-- Everyone can read challenges
CREATE POLICY "challenges_select_all" ON challenges
  FOR SELECT
  TO public
  USING (true);

-- Only authenticated users can create challenges
CREATE POLICY "challenges_insert_authenticated" ON challenges
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Users can update their own challenges
CREATE POLICY "challenges_update_own" ON challenges
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by);

-- Users can delete their own challenges
CREATE POLICY "challenges_delete_own" ON challenges
  FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- 6. Create submissions table if not exists
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
  flag_submitted TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, challenge_id)
);

-- Enable RLS for submissions
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Users can read their own submissions
CREATE POLICY "submissions_select_own" ON submissions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own submissions
CREATE POLICY "submissions_insert_own" ON submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 7. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_points ON users(points DESC);
CREATE INDEX IF NOT EXISTS idx_challenges_category ON challenges(category);
CREATE INDEX IF NOT EXISTS idx_challenges_difficulty ON challenges(difficulty);
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_challenge_id ON submissions(challenge_id);

-- 8. IMPORTANT: Disable email confirmation in Supabase Dashboard
-- Go to: Authentication → Settings → Enable email confirmations → Turn OFF

-- SUCCESS MESSAGE
DO $$
BEGIN
  RAISE NOTICE '✅ Database setup complete!';
  RAISE NOTICE '⚠️ IMPORTANT: Go to Supabase Dashboard → Authentication → Settings';
  RAISE NOTICE '⚠️ Turn OFF "Enable email confirmations" for signup to work!';
END $$;
