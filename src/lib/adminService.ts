import { supabase } from './supabase';

export class AdminService {
    // Create a new challenge
    static async createChallenge(challengeData: {
        title: string;
        description: string;
        category: string;
        difficulty: 'Easy' | 'Medium' | 'Hard';
        points: number;
        flag: string;
        hints?: string[];
        files?: { name: string; url: string }[];
    }) {
        try {
            const { data, error } = await supabase
                .from('problems')
                .insert({
                    ...challengeData,
                    solves: 0,
                    created_at: new Date().toISOString(),
                })
                .select()
                .single();

            if (error) throw error;
            return { success: true, data };
        } catch (error: any) {
            console.error('Error creating challenge:', error);
            return { success: false, error: error.message };
        }
    }

    // Update an existing challenge
    static async updateChallenge(
        id: number,
        challengeData: Partial<{
            title: string;
            description: string;
            category: string;
            difficulty: 'Easy' | 'Medium' | 'Hard';
            points: number;
            flag: string;
            hints: string[];
            files: { name: string; url: string }[];
        }>
    ) {
        try {
            const { data, error } = await supabase
                .from('problems')
                .update(challengeData)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return { success: true, data };
        } catch (error: any) {
            console.error('Error updating challenge:', error);
            return { success: false, error: error.message };
        }
    }

    // Delete a challenge
    static async deleteChallenge(id: number) {
        try {
            const { error } = await supabase
                .from('problems')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return { success: true };
        } catch (error: any) {
            console.error('Error deleting challenge:', error);
            return { success: false, error: error.message };
        }
    }

    // Get all challenges for admin (includes flags)
    static async getAllChallengesAdmin() {
        try {
            const { data, error } = await supabase
                .from('problems')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching challenges:', error);
            return [];
        }
    }

    // Get user statistics
    static async getUserStats() {
        try {
            const { count: totalUsers } = await supabase
                .from('users')
                .select('*', { count: 'exact', head: true });

            const { count: totalChallenges } = await supabase
                .from('problems')
                .select('*', { count: 'exact', head: true });

            const { count: totalSubmissions } = await supabase
                .from('submissions')
                .select('*', { count: 'exact', head: true });

            return {
                totalUsers: totalUsers || 0,
                totalChallenges: totalChallenges || 0,
                totalSubmissions: totalSubmissions || 0,
            };
        } catch (error) {
            console.error('Error fetching stats:', error);
            return {
                totalUsers: 0,
                totalChallenges: 0,
                totalSubmissions: 0,
            };
        }
    }

    // Get all users with their stats
    static async getAllUsers() {
        try {
            const { data, error } = await supabase
                .from('users')
                .select(`
          *,
          user_progress (
            problem_id,
            solved,
            problems (
              points
            )
          )
        `)
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Calculate points and solves for each user
            return data?.map((user: any) => {
                const solves = user.user_progress?.filter((p: any) => p.solved).length || 0;
                const points = user.user_progress
                    ?.filter((p: any) => p.solved)
                    .reduce((sum: number, p: any) => sum + (p.problems?.points || 0), 0) || 0;

                return {
                    ...user,
                    solves,
                    points,
                };
            }) || [];
        } catch (error) {
            console.error('Error fetching users:', error);
            return [];
        }
    }
}
