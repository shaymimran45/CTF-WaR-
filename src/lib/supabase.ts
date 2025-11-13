import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface Challenge {
    id: number;
    title: string;
    description: string;
    category: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    points: number;
    solves: number;
    flag: string;
    hints: string[];
    files?: { name: string; url: string }[];
    created_at: string;
}

export interface User {
    id: string;
    username: string;
    email: string;
    created_at: string;
}

export interface UserProgress {
    user_id: string;
    problem_id: number;
    solved: boolean;
    solved_at?: string;
}

export interface LeaderboardEntry {
    username: string;
    points: number;
    solves: number;
    rank: number;
}

export interface Submission {
    id: number;
    user_id: string;
    problem_id: number;
    flag: string;
    correct: boolean;
    submitted_at: string;
}
