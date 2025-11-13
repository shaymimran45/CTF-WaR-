"use client";

import { useState, useEffect } from "react";
import { LeaderboardService } from "@/lib/leaderboardService";
import { LeaderboardEntry } from "@/lib/supabase";
import { AnimatedCard } from "@/components/Animations";

export default function LeaderboardPage() {
    const [timeframe, setTimeframe] = useState<"all" | "month" | "week">("all");
    const [players, setPlayers] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadLeaderboard();
    }, [timeframe]);

    const loadLeaderboard = async () => {
        setLoading(true);
        try {
            const data = await LeaderboardService.getLeaderboard(50);
            setPlayers(data);
        } catch (error) {
            console.error("Error loading leaderboard:", error);
        } finally {
            setLoading(false);
        }
    }; const getRankMedal = (rank: number) => {
        switch (rank) {
            case 1:
                return "🥇";
            case 2:
                return "🥈";
            case 3:
                return "🥉";
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Leaderboard</h1>
                    <p className="text-gray-600">
                        Top players ranked by total points earned
                    </p>
                </div>

                {/* Timeframe Filter */}
                <div className="bg-white rounded-lg shadow-md p-4 mb-8">
                    <div className="flex justify-center gap-4">
                        {[
                            { value: "all", label: "All Time" },
                            { value: "month", label: "This Month" },
                            { value: "week", label: "This Week" },
                        ].map((option) => (
                            <button
                                key={option.value}
                                onClick={() => setTimeframe(option.value as any)}
                                className={`px-6 py-2 rounded-lg font-medium transition ${timeframe === option.value
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Top 3 Podium */}
                {!loading && players.length > 0 && (
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        {players.slice(0, 3).map((player) => (
                            <div
                                key={player.rank}
                                className={`bg-white rounded-lg shadow-lg p-6 text-center ${player.rank === 1 ? "transform scale-110" : ""
                                    }`}
                            >
                                <div className="text-5xl mb-2">{getRankMedal(player.rank)}</div>
                                <div className="text-3xl font-bold text-gray-800 mb-1">
                                    #{player.rank}
                                </div>
                                <div className="font-semibold text-gray-900 mb-2">
                                    {player.username}
                                </div>
                                <div className="text-2xl font-bold text-blue-600 mb-1">
                                    {player.points}
                                </div>
                                <div className="text-sm text-gray-600">{player.solves} solves</div>
                            </div>
                        ))}
                    </div>
                )}

                {loading && (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <p className="mt-4 text-gray-600">Loading leaderboard...</p>
                    </div>
                )}

                {/* Rest of Leaderboard */}
                {!loading && players.length > 3 && (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Rank
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Username
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Solves
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Points
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {players.slice(3).map((player) => (
                                    <tr key={player.rank} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                #{player.rank}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-semibold text-gray-900">
                                                {player.username}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="text-sm text-gray-600">{player.solves}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="text-sm font-bold text-blue-600">
                                                {player.points}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
