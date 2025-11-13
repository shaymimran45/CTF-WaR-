-- ============================================
-- CTF Platform Database Schema
-- ============================================

-- Drop existing tables if they exist (in correct order)
DROP TABLE IF EXISTS user_progress CASCADE;
DROP TABLE IF EXISTS submissions CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS problems CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- ============================================
-- Create categories table
-- ============================================
CREATE TABLE categories (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  color VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Create problems table
-- ============================================
CREATE TABLE problems (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  points INTEGER NOT NULL CHECK (points > 0),
  solves INTEGER DEFAULT 0 CHECK (solves >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  flag VARCHAR(255) NOT NULL,
  hints TEXT[] DEFAULT '{}',
  files JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT TRUE
);

-- Create index for faster queries
CREATE INDEX idx_problems_category ON problems(category);
CREATE INDEX idx_problems_difficulty ON problems(difficulty);
CREATE INDEX idx_problems_is_active ON problems(is_active);

-- ============================================
-- Create users table
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  is_admin BOOLEAN DEFAULT FALSE
);

-- Create index for faster username lookups
CREATE INDEX idx_users_username ON users(username);

-- ============================================
-- Create submissions table
-- ============================================
CREATE TABLE submissions (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  problem_id INTEGER NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  flag VARCHAR(255) NOT NULL,
  correct BOOLEAN NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX idx_submissions_user_id ON submissions(user_id);
CREATE INDEX idx_submissions_problem_id ON submissions(problem_id);
CREATE INDEX idx_submissions_correct ON submissions(correct);

-- ============================================
-- Create user_progress table
-- ============================================
CREATE TABLE user_progress (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  problem_id INTEGER NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  solved BOOLEAN DEFAULT FALSE,
  solved_at TIMESTAMP WITH TIME ZONE,
  PRIMARY KEY (user_id, problem_id)
);

-- Create index for leaderboard queries
CREATE INDEX idx_user_progress_solved ON user_progress(solved);

-- ============================================
-- Create function to update problem solves
-- ============================================
CREATE OR REPLACE FUNCTION update_problem_solves()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.solved = TRUE AND (OLD.solved IS NULL OR OLD.solved = FALSE) THEN
    UPDATE problems 
    SET solves = solves + 1 
    WHERE id = NEW.problem_id;
  ELSIF NEW.solved = FALSE AND OLD.solved = TRUE THEN
    UPDATE problems 
    SET solves = GREATEST(solves - 1, 0) 
    WHERE id = NEW.problem_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-updating solves
CREATE TRIGGER trigger_update_problem_solves
AFTER INSERT OR UPDATE ON user_progress
FOR EACH ROW
EXECUTE FUNCTION update_problem_solves();

-- ============================================
-- Create function to update problems updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for problems updated_at
CREATE TRIGGER trigger_problems_updated_at
BEFORE UPDATE ON problems
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Enable Row Level Security (RLS)
-- ============================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS Policies for categories
-- ============================================
-- Everyone can read categories
CREATE POLICY "categories_select_policy"
  ON categories FOR SELECT
  TO public
  USING (true);

-- Only admins can insert categories
CREATE POLICY "categories_insert_policy"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Only admins can update categories
CREATE POLICY "categories_update_policy"
  ON categories FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- ============================================
-- RLS Policies for problems
-- ============================================
-- Everyone can read active problems
CREATE POLICY "problems_select_policy"
  ON problems FOR SELECT
  TO public
  USING (is_active = true);

-- Admins can read all problems
CREATE POLICY "problems_select_admin_policy"
  ON problems FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Admins can insert problems
CREATE POLICY "problems_insert_policy"
  ON problems FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Admins can update problems
CREATE POLICY "problems_update_policy"
  ON problems FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Admins can delete problems
CREATE POLICY "problems_delete_policy"
  ON problems FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- ============================================
-- RLS Policies for users
-- ============================================
-- Users can read their own profile
CREATE POLICY "users_select_own_policy"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Everyone can read all user profiles (for leaderboard)
CREATE POLICY "users_select_all_policy"
  ON users FOR SELECT
  TO public
  USING (true);

-- Users can insert their own profile
CREATE POLICY "users_insert_policy"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "users_update_policy"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================
-- RLS Policies for submissions
-- ============================================
-- Users can insert their own submissions
CREATE POLICY "submissions_insert_policy"
  ON submissions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can read their own submissions
CREATE POLICY "submissions_select_own_policy"
  ON submissions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Admins can read all submissions
CREATE POLICY "submissions_select_admin_policy"
  ON submissions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- ============================================
-- RLS Policies for user_progress
-- ============================================
-- Users can read their own progress
CREATE POLICY "user_progress_select_own_policy"
  ON user_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Everyone can read all progress (for leaderboard)
CREATE POLICY "user_progress_select_all_policy"
  ON user_progress FOR SELECT
  TO public
  USING (true);

-- Users can insert their own progress
CREATE POLICY "user_progress_insert_policy"
  ON user_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own progress
CREATE POLICY "user_progress_update_policy"
  ON user_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- Insert default categories
-- ============================================
INSERT INTO categories (id, name, description, color) VALUES
('web', 'Web Exploitation', 'XSS, SQL injection, CSRF, and other web vulnerabilities', 'from-red-500 to-orange-500'),
('crypto', 'Cryptography', 'Break ciphers and encryption algorithms', 'from-green-500 to-emerald-500'),
('reversing', 'Reverse Engineering', 'Analyze and decompile binaries', 'from-blue-500 to-cyan-500'),
('forensics', 'Forensics', 'Investigate digital evidence and hidden data', 'from-purple-500 to-violet-500'),
('pwn', 'Binary Exploitation', 'Buffer overflows and memory corruption', 'from-yellow-500 to-amber-500'),
('misc', 'Miscellaneous', 'Programming, OSINT, steganography, and more', 'from-pink-500 to-rose-500');

-- ============================================
-- Insert sample challenges
-- ============================================
INSERT INTO problems (title, description, category, difficulty, points, flag, hints, files) VALUES
(
  'Caesar Cipher',
  'Decrypt this message: "Wklv lv d vlpsoh fdhvdu flskhu". The flag format is CTF{decrypted_message}',
  'crypto',
  'Easy',
  100,
  'CTF{this_is_a_simple_caesar_cipher}',
  ARRAY['Try all possible shifts (ROT1 to ROT25)', 'ROT13 is the most popular Caesar cipher', 'Use an online decoder or write a simple script'],
  '[]'::jsonb
),
(
  'SQL Injection 101',
  'Login to the admin panel without valid credentials. The login form is vulnerable to SQL injection. Find the flag in the admin dashboard after successful login.',
  'web',
  'Easy',
  150,
  'CTF{sql_injection_master}',
  ARRAY['Try using OR 1=1 in the username field', 'Comment out the rest of the query with --', 'Classic injection: admin'' OR ''1''=''1'],
  '[{"name": "login.php", "url": "/files/sql-login.zip"}]'::jsonb
),
(
  'Hidden Flag',
  'Download the image and find the hidden flag inside. The flag has been embedded using steganography techniques.',
  'forensics',
  'Medium',
  250,
  'CTF{st3g0_m4st3r_2024}',
  ARRAY['Check file metadata with exiftool', 'Use strings command to find hidden text', 'Try steghide with an empty password'],
  '[{"name": "image.jpg", "url": "/files/hidden-flag.jpg"}]'::jsonb
),
(
  'Buffer Overflow',
  'Exploit the buffer overflow vulnerability in this binary to execute arbitrary code and capture the flag. The binary has NX disabled for easier exploitation.',
  'pwn',
  'Hard',
  500,
  'CTF{buff3r_0v3rfl0w_pwn3d}',
  ARRAY['Check the buffer size - it''s only 64 bytes', 'Use pwntools to craft your payload', 'The win() function is at address 0x08048596'],
  '[{"name": "vuln", "url": "/files/buffer-overflow"}, {"name": "vuln.c", "url": "/files/buffer-overflow.c"}]'::jsonb
),
(
  'XSS Challenge',
  'Inject JavaScript code to steal the admin cookie and get the flag. The application has basic XSS protections, but they can be bypassed.',
  'web',
  'Medium',
  300,
  'CTF{xss_cookie_stealer_pro}',
  ARRAY['Try different XSS payloads', 'Bypass the filter that blocks <script> tags', 'Use event handlers like onerror or onload'],
  '[{"name": "xss-challenge.html", "url": "/files/xss.zip"}]'::jsonb
),
(
  'Base64 Layers',
  'The flag has been encoded multiple times with base64. Decode it layer by layer to find the original flag. Encoded string: V0ZSSk1HRlJUa1pOUlVrelgwSmhjMlUyTkY5TWRXRjVaWEp6WHc9PQ==',
  'crypto',
  'Easy',
  100,
  'CTF{Base64_Layers}',
  ARRAY['Decode multiple times until you get readable text', 'Use CyberChef or command line: echo "string" | base64 -d', 'You need to decode exactly 4 times'],
  '[]'::jsonb
),
(
  'Find the Admin',
  'Use OSINT techniques to find the admin''s secret social media account. The flag is in their latest post. Start with username: ctf_admin_2024',
  'misc',
  'Medium',
  200,
  'CTF{0s1nt_m4st3r_f0und_m3}',
  ARRAY['Search for the username on popular social media platforms', 'Check Twitter, Instagram, and GitHub', 'Look for recent activity in the last 30 days'],
  '[]'::jsonb
),
(
  'Reverse Me',
  'Reverse engineer this binary to find the correct password. Once you enter the right password, the program will give you the flag.',
  'reversing',
  'Hard',
  450,
  'CTF{r3v3rs3_3ng1n33r1ng_pr0}',
  ARRAY['Use tools like Ghidra or IDA Pro', 'Look for string comparisons in the code', 'The password check function is called check_password()'],
  '[{"name": "reverse-me", "url": "/files/reverse-challenge"}]'::jsonb
);

-- ============================================
-- Create view for leaderboard
-- ============================================
CREATE OR REPLACE VIEW leaderboard_view AS
SELECT 
  u.id,
  u.username,
  COUNT(CASE WHEN up.solved = true THEN 1 END) as challenges_solved,
  COALESCE(SUM(CASE WHEN up.solved = true THEN p.points END), 0) as total_points,
  MAX(up.solved_at) as last_solve
FROM users u
LEFT JOIN user_progress up ON u.id = up.user_id
LEFT JOIN problems p ON up.problem_id = p.id
GROUP BY u.id, u.username
ORDER BY total_points DESC, last_solve ASC;

-- ============================================
-- Create view for challenge statistics
-- ============================================
CREATE OR REPLACE VIEW challenge_stats AS
SELECT 
  p.id,
  p.title,
  p.category,
  p.difficulty,
  p.points,
  p.solves,
  COUNT(DISTINCT s.user_id) as attempt_count,
  ROUND(
    CASE 
      WHEN COUNT(DISTINCT s.user_id) > 0 
      THEN (p.solves::DECIMAL / COUNT(DISTINCT s.user_id)) * 100 
      ELSE 0 
    END, 
    2
  ) as solve_rate
FROM problems p
LEFT JOIN submissions s ON p.id = s.problem_id
GROUP BY p.id, p.title, p.category, p.difficulty, p.points, p.solves
ORDER BY p.id;

-- ============================================
-- Grant permissions
-- ============================================
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- ============================================
-- Database setup complete!
-- ============================================
-- Next steps:
-- 1. Run this SQL in your Supabase SQL Editor
-- 2. Create a .env.local file with your Supabase credentials
-- 3. Update your first user to admin: UPDATE users SET is_admin = true WHERE username = 'your_username';
-- 4. Access the admin panel at /admin
-- ============================================
