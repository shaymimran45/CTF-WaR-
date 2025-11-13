import { supabase, Challenge } from './supabase';

export class ChallengeService {
    // Get all challenges
    static async getAllChallenges(): Promise<Challenge[]> {
        try {
            const { data, error } = await supabase
                .from('problems')
                .select('*')
                .order('points', { ascending: true });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching challenges:', error);
            return [];
        }
    }

    // Get challenges by category
    static async getChallengesByCategory(category: string): Promise<Challenge[]> {
        try {
            const { data, error } = await supabase
                .from('problems')
                .select('*')
                .eq('category', category)
                .order('points', { ascending: true });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching challenges by category:', error);
            return [];
        }
    }

    // Get single challenge by ID
    static async getChallengeById(id: number): Promise<Challenge | null> {
        try {
            const { data, error } = await supabase
                .from('problems')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching challenge:', error);
            return null;
        }
    }

    // Submit flag
    static async submitFlag(userId: string, problemId: number, flag: string): Promise<{
        correct: boolean;
        message: string;
        points?: number;
    }> {
        try {
            // Get the challenge to verify the flag
            const challenge = await this.getChallengeById(problemId);
            if (!challenge) {
                return { correct: false, message: 'Challenge not found' };
            }

            const isCorrect = flag.trim() === challenge.flag.trim();

            // Record the submission
            const { error: submissionError } = await supabase
                .from('submissions')
                .insert({
                    user_id: userId,
                    problem_id: problemId,
                    flag: flag,
                    correct: isCorrect,
                    submitted_at: new Date().toISOString(),
                });

            if (submissionError) throw submissionError;

            // If correct and not already solved, update user progress
            if (isCorrect) {
                const { data: existingProgress } = await supabase
                    .from('user_progress')
                    .select('*')
                    .eq('user_id', userId)
                    .eq('problem_id', problemId)
                    .single();

                if (!existingProgress) {
                    // Add to user progress
                    await supabase
                        .from('user_progress')
                        .insert({
                            user_id: userId,
                            problem_id: problemId,
                            solved: true,
                            solved_at: new Date().toISOString(),
                        });

                    // Increment solve count
                    await supabase
                        .from('problems')
                        .update({ solves: (challenge.solves || 0) + 1 })
                        .eq('id', problemId);

                    return {
                        correct: true,
                        message: 'Correct! Challenge solved!',
                        points: challenge.points,
                    };
                } else {
                    return {
                        correct: true,
                        message: 'You already solved this challenge!',
                        points: 0,
                    };
                }
            }

            return { correct: false, message: 'Incorrect flag. Try again!' };
        } catch (error) {
            console.error('Error submitting flag:', error);
            return { correct: false, message: 'An error occurred' };
        }
    }

    // Get user's solved challenges
    static async getUserSolvedChallenges(userId: string): Promise<number[]> {
        try {
            const { data, error } = await supabase
                .from('user_progress')
                .select('problem_id')
                .eq('user_id', userId)
                .eq('solved', true);

            if (error) throw error;
            return data?.map((item) => item.problem_id) || [];
        } catch (error) {
            console.error('Error fetching solved challenges:', error);
            return [];
        }
    }
}
