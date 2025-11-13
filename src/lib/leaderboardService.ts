import { supabase, LeaderboardEntry } from './supabase';

export class LeaderboardService {
    // Get leaderboard
    static async getLeaderboard(limit: number = 50): Promise<LeaderboardEntry[]> {
        try {
            // Get all users with their progress
            const { data, error } = await supabase
                .from('users')
                .select(`
          username,
          user_progress (
            problem_id,
            solved,
            problems (
              points
            )
          )
        `);

            if (error) throw error;

            // Calculate points and solves for each user
            const leaderboard = data?.map((user: any) => {
                const solves = user.user_progress?.filter((p: any) => p.solved).length || 0;
                const points = user.user_progress
                    ?.filter((p: any) => p.solved)
                    .reduce((sum: number, p: any) => sum + (p.problems?.points || 0), 0) || 0;

                return {
                    username: user.username,
                    points,
                    solves,
                    rank: 0, // Will be set after sorting
                };
            }) || [];

            // Sort by points (descending) and assign ranks
            leaderboard.sort((a, b) => b.points - a.points);
            leaderboard.forEach((entry, index) => {
                entry.rank = index + 1;
            });

            return leaderboard.slice(0, limit);
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
            return [];
        }
    }

    // Get user stats
    static async getUserStats(userId: string) {
        try {
            const { data: progress, error } = await supabase
                .from('user_progress')
                .select(`
          problem_id,
          solved,
          solved_at,
          problems (
            title,
            category,
            points
          )
        `)
                .eq('user_id', userId)
                .eq('solved', true)
                .order('solved_at', { ascending: false });

            if (error) throw error;

            const solves = progress?.length || 0;
            const points = progress?.reduce((sum, p: any) => sum + (p.problems?.points || 0), 0) || 0;

            // Get user rank
            const leaderboard = await this.getLeaderboard(1000);
            const userRank = leaderboard.findIndex((entry) => entry.points === points) + 1;

            return {
                solves,
                points,
                rank: userRank || 0,
                recentSolves: progress?.slice(0, 5) || [],
            };
        } catch (error) {
            console.error('Error fetching user stats:', error);
            return { solves: 0, points: 0, rank: 0, recentSolves: [] };
        }
    }
}
