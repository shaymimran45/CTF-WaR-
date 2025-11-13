'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChallengeService } from '@/lib/challengeService';
import { useAuth } from '@/contexts/AuthContext';
import { Challenge } from '@/lib/supabase';

export default function ChallengesPage() {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
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
            if (selectedCategory === 'all') {
                data = await ChallengeService.getAllChallenges();
            } else {
                data = await ChallengeService.getChallengesByCategory(selectedCategory);
            }
            setChallenges(data);
        } catch (error) {
            console.error('Error loading challenges:', error);
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
            console.error('Error loading solved challenges:', error);
        }
    };

    const categories = [
        { id: 'all', name: 'ALL', icon: '🎯' },
        { id: 'web', name: 'WEB', icon: '🌐' },
        { id: 'crypto', name: 'CRYPTO', icon: '🔐' },
        { id: 'forensics', name: 'FORENSICS', icon: '🔍' },
        { id: 'pwn', name: 'PWN', icon: '💥' },
        { id: 'reversing', name: 'REVERSING', icon: '🔄' },
        { id: 'misc', name: 'MISC', icon: '🎲' },
    ];

    const difficulties = ['all', 'Easy', 'Medium', 'Hard'];

    const filteredChallenges = challenges.filter((challenge) => {
        const categoryMatch = selectedCategory === 'all' || challenge.category === selectedCategory;
        const difficultyMatch = selectedDifficulty === 'all' || challenge.difficulty === selectedDifficulty;
        return categoryMatch && difficultyMatch;
    });

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Easy':
                return 'border-matrix-green text-matrix-green';
            case 'Medium':
                return 'border-neon-cyan text-neon-cyan';
            case 'Hard':
                return 'border-neon-red text-neon-red';
            default:
                return 'border-gray-500 text-gray-500';
        }
    };

    return (
        <div className="min-h-screen bg-black text-matrix-green p-8 relative">
            <div className="scan-line"></div>

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-5xl font-bold neon-green mb-4 terminal-cursor">
                        &lt; CHALLENGE_DATABASE /&gt;
                    </h1>
                    <p className="text-neon-cyan text-lg">
                        {filteredChallenges.length} challenges loaded | Select category to begin
                    </p>
                </div>

                {/* Filters */}
                <div className="mb-12">
                    {/* Category Filter */}
                    <div className="mb-6">
                        <label className="block text-neon-cyan mb-4 text-sm">
                            {'>> SELECT_CATEGORY:'}
                        </label>
                        <div className="flex flex-wrap gap-3">
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`cyber-button px-6 py-3 ${selectedCategory === category.id ? 'bg-matrix-green text-black' : ''
                                        }`}
                                >
                                    {category.icon} {category.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Difficulty Filter */}
                    <div>
                        <label className="block text-neon-cyan mb-4 text-sm">
                            {'>> SELECT_DIFFICULTY:'}
                        </label>
                        <div className="flex flex-wrap gap-3">
                            {difficulties.map((difficulty) => (
                                <button
                                    key={difficulty}
                                    onClick={() => setSelectedDifficulty(difficulty)}
                                    className={`cyber-button px-6 py-3 ${selectedDifficulty === difficulty ? 'bg-matrix-green text-black' : ''
                                        }`}
                                >
                                    {difficulty.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-20">
                        <div className="text-4xl neon-green mb-4">⏳</div>
                        <div className="text-neon-cyan">LOADING_CHALLENGES...</div>
                    </div>
                )}

                {/* Challenges Grid */}
                {!loading && filteredChallenges.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredChallenges.map((challenge) => {
                            const isSolved = solvedIds.includes(challenge.id);
                            return (
                                <Link
                                    key={challenge.id}
                                    href={`/challenges/${challenge.id}`}
                                    className="cyber-card p-6 group relative"
                                >
                                    {/* Solved Badge */}
                                    {isSolved && (
                                        <div className="absolute top-4 right-4 bg-matrix-green text-black px-3 py-1 text-xs font-bold">
                                            ✓ SOLVED
                                        </div>
                                    )}

                                    {/* Category & Difficulty */}
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-neon-cyan text-sm font-mono">
                                            [{challenge.category.toUpperCase()}]
                                        </span>
                                        <span className={`text-xs px-3 py-1 border ${getDifficultyColor(challenge.difficulty)}`}>
                                            {challenge.difficulty.toUpperCase()}
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-2xl font-bold neon-green mb-3 group-hover:glitch-text">
                                        {challenge.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-gray-400 mb-4 text-sm line-clamp-3">
                                        {challenge.description}
                                    </p>

                                    {/* Footer */}
                                    <div className="flex justify-between items-center pt-4 border-t border-matrix-green">
                                        <span className="text-neon-purple font-bold">
                                            {challenge.points} PTS
                                        </span>
                                        <span className="text-matrix-green group-hover:text-neon-cyan">
                                            HACK &gt;&gt;
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}

                {/* Empty State */}
                {!loading && filteredChallenges.length === 0 && (
                    <div className="text-center py-20">
                        <div className="cyber-card p-12 max-w-md mx-auto">
                            <div className="text-6xl mb-4">🔍</div>
                            <h3 className="text-2xl font-bold neon-red mb-4">NO_CHALLENGES_FOUND</h3>
                            <p className="text-gray-400 mb-6">
                                No challenges match your current filters. Try selecting a different category or difficulty.
                            </p>
                            <button
                                onClick={() => {
                                    setSelectedCategory('all');
                                    setSelectedDifficulty('all');
                                }}
                                className="cyber-button px-6 py-3"
                            >
                                RESET_FILTERS
                            </button>
                        </div>
                    </div>
                )}

                {/* Stats Footer */}
                {!loading && filteredChallenges.length > 0 && (
                    <div className="mt-16 cyber-card p-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                            <div>
                                <div className="text-3xl font-bold neon-green mb-2">
                                    {filteredChallenges.length}
                                </div>
                                <div className="text-sm text-gray-500">TOTAL CHALLENGES</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold neon-cyan mb-2">
                                    {solvedIds.length}
                                </div>
                                <div className="text-sm text-gray-500">SOLVED BY YOU</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold neon-purple mb-2">
                                    {filteredChallenges.reduce((sum, c) => sum + c.points, 0)}
                                </div>
                                <div className="text-sm text-gray-500">TOTAL POINTS</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold neon-red mb-2">
                                    {Math.round((solvedIds.length / challenges.length) * 100) || 0}%
                                </div>
                                <div className="text-sm text-gray-500">COMPLETION RATE</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
