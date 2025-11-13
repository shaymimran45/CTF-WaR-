"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AdminService } from "@/lib/adminService";
import { Challenge } from "@/lib/supabase";

export default function ManageChallengesPage() {
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<number | null>(null);

    useEffect(() => {
        loadChallenges();
    }, []);

    const loadChallenges = async () => {
        setLoading(true);
        const data = await AdminService.getAllChallengesAdmin();
        setChallenges(data);
        setLoading(false);
    };

    const handleDelete = async (id: number, title: string) => {
        if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
            return;
        }

        setDeleting(id);
        const result = await AdminService.deleteChallenge(id);

        if (result.success) {
            setChallenges(challenges.filter(c => c.id !== id));
            alert("Challenge deleted successfully!");
        } else {
            alert(`Failed to delete challenge: ${result.error}`);
        }
        setDeleting(null);
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case "Easy":
                return "text-green-600 bg-green-100";
            case "Medium":
                return "text-yellow-600 bg-yellow-100";
            case "Hard":
                return "text-red-600 bg-red-100";
            default:
                return "text-gray-600 bg-gray-100";
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Manage Challenges</h1>
                        <p className="text-gray-600">View, edit, and delete existing challenges</p>
                    </div>
                    <Link
                        href="/admin"
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                        + Create New
                    </Link>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <p className="mt-4 text-gray-600">Loading challenges...</p>
                    </div>
                ) : challenges.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <p className="text-gray-500 text-lg mb-4">No challenges found</p>
                        <Link
                            href="/admin"
                            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                        >
                            Create Your First Challenge
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {challenges.map((challenge) => (
                            <div
                                key={challenge.id}
                                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-semibold text-gray-900">
                                                {challenge.title}
                                            </h3>
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(
                                                    challenge.difficulty
                                                )}`}
                                            >
                                                {challenge.difficulty}
                                            </span>
                                        </div>

                                        <p className="text-gray-600 mb-3 line-clamp-2">
                                            {challenge.description}
                                        </p>

                                        <div className="flex items-center gap-6 text-sm text-gray-600">
                                            <span className="capitalize">
                                                📁 {challenge.category}
                                            </span>
                                            <span>🎯 {challenge.points} points</span>
                                            <span>✅ {challenge.solves} solves</span>
                                            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                                                Flag: {challenge.flag}
                                            </span>
                                        </div>

                                        {challenge.hints && challenge.hints.length > 0 && (
                                            <div className="mt-3 text-sm text-gray-500">
                                                💡 {challenge.hints.length} hint{challenge.hints.length !== 1 ? 's' : ''}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-2 ml-4">
                                        <Link
                                            href={`/challenges/${challenge.id}`}
                                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                                        >
                                            View
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(challenge.id, challenge.title)}
                                            disabled={deleting === challenge.id}
                                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50"
                                        >
                                            {deleting === challenge.id ? "Deleting..." : "Delete"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Stats Summary */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="text-3xl font-bold text-blue-600 mb-2">
                            {challenges.length}
                        </div>
                        <div className="text-gray-600 text-sm">Total Challenges</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="text-3xl font-bold text-green-600 mb-2">
                            {challenges.filter(c => c.difficulty === "Easy").length}
                        </div>
                        <div className="text-gray-600 text-sm">Easy</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="text-3xl font-bold text-yellow-600 mb-2">
                            {challenges.filter(c => c.difficulty === "Medium").length}
                        </div>
                        <div className="text-gray-600 text-sm">Medium</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="text-3xl font-bold text-red-600 mb-2">
                            {challenges.filter(c => c.difficulty === "Hard").length}
                        </div>
                        <div className="text-gray-600 text-sm">Hard</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
