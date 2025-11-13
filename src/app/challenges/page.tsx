"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChallengeService } from "@/lib/challengeService";
import { useAuth } from "@/contexts/AuthContext";
import { Challenge } from "@/lib/supabase";
import { AnimatedCard, StaggerContainer, StaggerItem } from "@/components/Animations";

export default function ChallengesPage() {
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [solvedIds, setSolvedIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        loadChallenges();
    }, [selectedCategory]);

    useEffect(() => {
        if (user) {
            loadSolvedChallenges();
        }
    }, [user]);

    const loadChallenges = async () => {
        setLoading(true);
        try {
            let data;
            if (selectedCategory === "all") {
                data = await ChallengeService.getAllChallenges();
            } else {
                data = await ChallengeService.getChallengesByCategory(selectedCategory);
            }
            setChallenges(data);
        } catch (error) {
            console.error("Error loading challenges:", error);
        } finally {
            setLoading(false);
        }
    };

    const loadSolvedChallenges = async () => {
        if (!user) return;
        try {
            const solved = await ChallengeService.getUserSolvedChallenges(user.id);
            setSolvedIds(solved);
        } catch (error) {
            console.error("Error loading solved challenges:", error);
        }
    }; const categories = [
        { id: "all", name: "All Categories", icon: "🎯" },
        { id: "web", name: "Web", icon: "🌐" },
        { id: "crypto", name: "Crypto", icon: "🔐" },
        { id: "reversing", name: "Reversing", icon: "🔍" },
        { id: "forensics", name: "Forensics", icon: "🔬" },
        { id: "pwn", name: "Pwn", icon: "💥" },
        { id: "misc", name: "Misc", icon: "🎲" },
    ];

    const difficulties = ["all", "Easy", "Medium", "Hard"];

    const filteredChallenges = challenges.filter((challenge) => {
        const categoryMatch =
            selectedCategory === "all" || challenge.category === selectedCategory;
        const difficultyMatch =
            selectedDifficulty === "all" || challenge.difficulty === selectedDifficulty;
        return categoryMatch && difficultyMatch;
    }); const getDifficultyColor = (difficulty: string) => {
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
                <h1 className="text-4xl font-bold text-gray-900 mb-8">Challenges</h1>

                {loading && (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <p className="mt-4 text-gray-600">Loading challenges...</p>
                    </div>
                )}

                {!loading && (
                    <>
                        {/* Filters */}
                        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Category Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category
                                    </label>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                        {categories.map((category) => (
                                            <button
                                                key={category.id}
                                                onClick={() => setSelectedCategory(category.id)}
                                                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${selectedCategory === category.id
                                                    ? "bg-blue-600 text-white"
                                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                    }`}
                                            >
                                                {category.icon} {category.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Difficulty Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Difficulty
                                    </label>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                        {difficulties.map((difficulty) => (
                                            <button
                                                key={difficulty}
                                                onClick={() => setSelectedDifficulty(difficulty)}
                                                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${selectedDifficulty === difficulty
                                                    ? "bg-blue-600 text-white"
                                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                    }`}
                                            >
                                                {difficulty === "all" ? "All" : difficulty}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Challenges List */}
                        <StaggerContainer>
                            <div className="space-y-4">
                                {filteredChallenges.length === 0 ? (
                                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                                        <p className="text-gray-500 text-lg">
                                            No challenges found with the selected filters.
                                        </p>
                                    </div>
                                ) : (
                                    filteredChallenges.map((challenge) => (
                                        <StaggerItem key={challenge.id}>
                                            <Link
                                                href={`/challenges/${challenge.id}`}
                                                className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 hover:-translate-y-1"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h3 className="text-xl font-semibold text-gray-900">
                                                                {challenge.title}
                                                            </h3>
                                                            {solvedIds.includes(challenge.id) && (
                                                                <span className="text-green-500 text-2xl">✓</span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                                            <span className="capitalize">{challenge.category}</span>
                                                            <span>•</span>
                                                            <span>{challenge.solves} solves</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <span
                                                            className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(
                                                                challenge.difficulty
                                                            )}`}
                                                        >
                                                            {challenge.difficulty}
                                                        </span>
                                                        <span className="text-2xl font-bold text-blue-600">
                                                            {challenge.points}
                                                        </span>
                                                    </div>
                                                </div>
                                            </Link>
                                        </StaggerItem>
                                    ))
                                )}
                            </div>
                        </StaggerContainer>
                    </>
                )}
            </div>
        </div>
    );
}
