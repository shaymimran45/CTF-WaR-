"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Challenge } from "@/lib/supabase";
import { ChallengeService } from "@/lib/challengeService";
import { useAuth } from "@/contexts/AuthContext";
import { SlideUp, FadeIn } from "@/components/Animations";

export default function ChallengePage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [challenge, setChallenge] = useState<Challenge | null>(null);
    const [flag, setFlag] = useState("");
    const [result, setResult] = useState<{ type: "success" | "error"; message: string } | null>(null);
    const [showHints, setShowHints] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadChallenge();
    }, [params.id]);

    const loadChallenge = async () => {
        try {
            const id = parseInt(params.id as string);
            const data = await ChallengeService.getChallengeById(id);
            setChallenge(data);
        } catch (error) {
            console.error("Error loading challenge:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            setResult({ type: "error", message: "Please login to submit flags" });
            setTimeout(() => router.push("/login"), 2000);
            return;
        }

        if (!challenge) return;

        setSubmitting(true);
        setResult(null);

        try {
            const response = await ChallengeService.submitFlag(user.id, challenge.id, flag);

            if (response.correct) {
                setResult({
                    type: "success",
                    message: response.points ? `Correct! +${response.points} points` : response.message
                });
                setFlag("");
            } else {
                setResult({ type: "error", message: response.message });
            }
        } catch (error) {
            setResult({ type: "error", message: "An error occurred" });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-gray-600">Loading challenge...</p>
                </div>
            </div>
        );
    }

    if (!challenge) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">Challenge Not Found</h1>
                    <p className="text-gray-600">The challenge you're looking for doesn't exist.</p>
                </div>
            </div>
        );
    } const getDifficultyColor = (difficulty: string) => {
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
            <div className="max-w-4xl mx-auto">
                {/* Challenge Header */}
                <div className="bg-white rounded-lg shadow-md p-8 mb-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                {challenge.title}
                            </h1>
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
                            <span className="text-3xl font-bold text-blue-600">
                                {challenge.points}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Challenge Description */}
                <div className="bg-white rounded-lg shadow-md p-8 mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
                    <div className="prose max-w-none">
                        <pre className="whitespace-pre-wrap text-gray-700 font-sans">
                            {challenge.description}
                        </pre>
                    </div>
                </div>

                {/* Files */}
                {challenge.files && challenge.files.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md p-8 mb-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Files</h2>
                        <div className="space-y-2">
                            {challenge.files.map((file: any, index: number) => (
                                <a
                                    key={index}
                                    href={file.url}
                                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                                >
                                    📎 {file.name}
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {/* Hints */}
                <div className="bg-white rounded-lg shadow-md p-8 mb-6">
                    <button
                        onClick={() => setShowHints(!showHints)}
                        className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2 hover:text-blue-600"
                    >
                        💡 Hints ({challenge.hints?.length || 0})
                        <span className="text-sm">{showHints ? "▼" : "▶"}</span>
                    </button>
                    {showHints && challenge.hints && (
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            {challenge.hints.map((hint: string, index: number) => (
                                <li key={index}>{hint}</li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Submit Flag */}
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Submit Flag</h2>

                    {result && (
                        <div
                            className={`mb-4 px-4 py-3 rounded-lg ${result.type === "success"
                                ? "bg-green-50 border border-green-200 text-green-700"
                                : "bg-red-50 border border-red-200 text-red-700"
                                }`}
                        >
                            {result.message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex gap-4">
                        <input
                            type="text"
                            value={flag}
                            onChange={(e) => setFlag(e.target.value)}
                            placeholder="CTF{...}"
                            disabled={submitting}
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                        />
                        <button
                            type="submit"
                            disabled={submitting || !flag.trim()}
                            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? "Submitting..." : "Submit"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
