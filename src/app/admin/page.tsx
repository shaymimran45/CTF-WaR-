"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Form state
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("web");
    const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Easy");
    const [points, setPoints] = useState(100);
    const [flag, setFlag] = useState("");
    const [hints, setHints] = useState<string[]>([""]);
    const [files, setFiles] = useState<{ name: string; url: string }[]>([]);
    const [fileName, setFileName] = useState("");
    const [fileUrl, setFileUrl] = useState("");

    const categories = [
        { id: "web", name: "Web Exploitation" },
        { id: "crypto", name: "Cryptography" },
        { id: "reversing", name: "Reverse Engineering" },
        { id: "forensics", name: "Forensics" },
        { id: "pwn", name: "Binary Exploitation" },
        { id: "misc", name: "Miscellaneous" },
    ];

    const addHint = () => {
        setHints([...hints, ""]);
    };

    const updateHint = (index: number, value: string) => {
        const newHints = [...hints];
        newHints[index] = value;
        setHints(newHints);
    };

    const removeHint = (index: number) => {
        setHints(hints.filter((_, i) => i !== index));
    };

    const addFile = () => {
        if (fileName && fileUrl) {
            setFiles([...files, { name: fileName, url: fileUrl }]);
            setFileName("");
            setFileUrl("");
        }
    };

    const removeFile = (index: number) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        if (!user) {
            setError("You must be logged in to create challenges");
            setLoading(false);
            return;
        }

        try {
            // Filter out empty hints
            const validHints = hints.filter((hint) => hint.trim() !== "");

            const { data, error: insertError } = await supabase
                .from("problems")
                .insert({
                    title,
                    description,
                    category,
                    difficulty,
                    points,
                    flag,
                    hints: validHints,
                    files: files.length > 0 ? JSON.stringify(files) : null,
                    solves: 0,
                })
                .select();

            if (insertError) throw insertError;

            setSuccess(`Challenge "${title}" created successfully!`);

            // Reset form
            setTitle("");
            setDescription("");
            setCategory("web");
            setDifficulty("Easy");
            setPoints(100);
            setFlag("");
            setHints([""]);
            setFiles([]);

            setTimeout(() => {
                setSuccess("");
            }, 3000);
        } catch (err: any) {
            setError(err.message || "Failed to create challenge");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-2">
                            <h1 className="text-4xl font-bold text-gray-900">Admin Panel</h1>
                            <Link
                                href="/admin/manage"
                                className="bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-700 transition"
                            >
                                Manage Challenges
                            </Link>
                        </div>
                        <p className="text-gray-600">Create and manage CTF challenges</p>
                    </div>

                    {error && (
                        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Challenge Title *
                            </label>
                            <input
                                type="text"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., SQL Injection Challenge"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description *
                            </label>
                            <textarea
                                required
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={6}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Describe the challenge, what players need to do, and any context..."
                            />
                        </div>

                        {/* Category and Difficulty */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category *
                                </label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Difficulty *
                                </label>
                                <select
                                    value={difficulty}
                                    onChange={(e) => setDifficulty(e.target.value as "Easy" | "Medium" | "Hard")}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="Easy">Easy</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Hard">Hard</option>
                                </select>
                            </div>
                        </div>

                        {/* Points */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Points *
                            </label>
                            <input
                                type="number"
                                required
                                min="50"
                                max="1000"
                                step="50"
                                value={points}
                                onChange={(e) => setPoints(parseInt(e.target.value))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Typical values: Easy (100-150), Medium (200-350), Hard (400-600)
                            </p>
                        </div>

                        {/* Flag */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Flag *
                            </label>
                            <input
                                type="text"
                                required
                                value={flag}
                                onChange={(e) => setFlag(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="CTF{example_flag_here}"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                The correct flag that players need to submit
                            </p>
                        </div>

                        {/* Hints */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Hints
                            </label>
                            {hints.map((hint, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={hint}
                                        onChange={(e) => updateHint(index, e.target.value)}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder={`Hint ${index + 1}`}
                                    />
                                    {hints.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeHint(index)}
                                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addHint}
                                className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                            >
                                + Add Hint
                            </button>
                        </div>

                        {/* Files */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Challenge Files
                            </label>

                            {files.length > 0 && (
                                <div className="mb-4 space-y-2">
                                    {files.map((file, index) => (
                                        <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                                            <div>
                                                <span className="font-medium">{file.name}</span>
                                                <a
                                                    href={file.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="ml-2 text-sm text-blue-600 hover:underline"
                                                >
                                                    {file.url}
                                                </a>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeFile(index)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="space-y-2">
                                <input
                                    type="text"
                                    value={fileName}
                                    onChange={(e) => setFileName(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="File name (e.g., challenge.zip)"
                                />
                                <input
                                    type="url"
                                    value={fileUrl}
                                    onChange={(e) => setFileUrl(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="File URL (e.g., https://example.com/file.zip)"
                                />
                                <button
                                    type="button"
                                    onClick={addFile}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                                    disabled={!fileName || !fileUrl}
                                >
                                    + Add File
                                </button>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                                Upload files to a hosting service and provide the download URL
                            </p>
                        </div>

                        {/* Submit Button */}
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Creating Challenge..." : "Create Challenge"}
                            </button>
                            <button
                                type="button"
                                onClick={() => router.push("/challenges")}
                                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
                            >
                                View Challenges
                            </button>
                        </div>
                    </form>
                </div>

                {/* Quick Stats */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-2">📝</div>
                        <div className="text-gray-600 text-sm">Create Challenges</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <div className="text-3xl font-bold text-green-600 mb-2">🎯</div>
                        <div className="text-gray-600 text-sm">Manage Categories</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <div className="text-3xl font-bold text-purple-600 mb-2">👥</div>
                        <div className="text-gray-600 text-sm">View Users</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
