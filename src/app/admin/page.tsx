'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export default function AdminPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [uploadMode, setUploadMode] = useState<'single' | 'csv'>('single');

    // Single Challenge Form
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('web');
    const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Easy');
    const [points, setPoints] = useState(100);
    const [flag, setFlag] = useState('');
    const [hints, setHints] = useState<string[]>(['']);

    // CSV Upload
    const [csvUrl, setCsvUrl] = useState('');
    const [csvFile, setCsvFile] = useState<File | null>(null);

    const categories = [
        { id: 'web', name: 'Web Exploitation' },
        { id: 'crypto', name: 'Cryptography' },
        { id: 'reversing', name: 'Reverse Engineering' },
        { id: 'forensics', name: 'Forensics' },
        { id: 'pwn', name: 'Binary Exploitation' },
        { id: 'misc', name: 'Miscellaneous' },
    ];

    const csvExample = `https://docs.google.com/spreadsheets/d/YOUR_ID/export?format=csv`;

    const parseCSV = (text: string) => {
        const lines = text.trim().split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        const challenges = [];

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim());
            const challenge: any = {};

            headers.forEach((header, index) => {
                challenge[header] = values[index];
            });

            challenges.push(challenge);
        }

        return challenges;
    };

    const handleCSVUpload = async () => {
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            let csvText = '';

            if (csvUrl) {
                const response = await fetch(csvUrl);
                if (!response.ok) throw new Error('Failed to fetch CSV from URL');
                csvText = await response.text();
            } else if (csvFile) {
                csvText = await csvFile.text();
            } else {
                throw new Error('Please provide CSV URL or upload a file');
            }

            const challenges = parseCSV(csvText);
            let successCount = 0;
            let errorCount = 0;

            for (const challenge of challenges) {
                try {
                    const { error: insertError } = await supabase
                        .from('challenges')
                        .insert({
                            title: challenge.title,
                            description: challenge.description,
                            category: challenge.category,
                            difficulty: challenge.difficulty,
                            points: parseInt(challenge.points) || 100,
                            flag: challenge.flag,
                            hints: challenge.hints ? challenge.hints.split('|') : [],
                            created_by: user?.id
                        });

                    if (insertError) throw insertError;
                    successCount++;
                } catch (err) {
                    console.error('Error inserting challenge:', err);
                    errorCount++;
                }
            }

            setSuccess(`✅ Successfully uploaded ${successCount} challenges! ${errorCount > 0 ? `(${errorCount} failed)` : ''}`);
            setCsvUrl('');
            setCsvFile(null);
        } catch (err: any) {
            setError(err.message || 'Failed to upload challenges from CSV');
        } finally {
            setLoading(false);
        }
    };

    const handleSingleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const { error: insertError } = await supabase
                .from('challenges')
                .insert({
                    title,
                    description,
                    category,
                    difficulty,
                    points,
                    flag,
                    hints: hints.filter(h => h.trim() !== ''),
                    created_by: user?.id
                });

            if (insertError) throw insertError;

            setSuccess('✅ Challenge created successfully!');

            setTitle('');
            setDescription('');
            setCategory('web');
            setDifficulty('Easy');
            setPoints(100);
            setFlag('');
            setHints(['']);
        } catch (err: any) {
            setError(err.message || 'Failed to create challenge');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-matrix-green p-8 relative">
            <div className="scan-line"></div>

            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold neon-green terminal-cursor">Admin Panel</h1>
                    <Link href="/admin/manage" className="cyber-button px-6 py-3">
                        Manage Challenges
                    </Link>
                </div>

                <div className="flex gap-4 mb-8">
                    <button
                        onClick={() => setUploadMode('single')}
                        className={`cyber-button px-6 py-3 ${uploadMode === 'single' ? 'bg-matrix-green text-black' : ''}`}
                    >
                        📝 Single Challenge
                    </button>
                    <button
                        onClick={() => setUploadMode('csv')}
                        className={`cyber-button px-6 py-3 ${uploadMode === 'csv' ? 'bg-matrix-green text-black' : ''}`}
                    >
                        📊 CSV Upload
                    </button>
                </div>

                {error && (
                    <div className="cyber-card border-neon-red text-neon-red mb-6 p-4">
                        ❌ {error}
                    </div>
                )}
                {success && (
                    <div className="cyber-card border-matrix-green text-matrix-green mb-6 p-4">
                        {success}
                    </div>
                )}

                {uploadMode === 'csv' && (
                    <div className="cyber-card p-8">
                        <h2 className="text-2xl font-bold neon-cyan mb-6">📊 Bulk Upload via CSV</h2>

                        <div className="mb-6">
                            <label className="block text-neon-cyan mb-2">CSV URL (Google Sheets/Online CSV)</label>
                            <input
                                type="url"
                                value={csvUrl}
                                onChange={(e) => setCsvUrl(e.target.value)}
                                placeholder={csvExample}
                                className="cyber-input w-full"
                            />
                            <p className="text-sm text-gray-500 mt-2">
                                💡 Example: Share Google Sheet as CSV → Copy link
                            </p>
                        </div>

                        <div className="text-center text-gray-500 my-4">OR</div>

                        <div className="mb-6">
                            <label className="block text-neon-cyan mb-2">Upload CSV File</label>
                            <input
                                type="file"
                                accept=".csv"
                                onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                                className="cyber-input w-full"
                            />
                        </div>

                        <div className="bg-black border border-matrix-green p-4 mb-6">
                            <h3 className="text-neon-green mb-2">📋 CSV Format:</h3>
                            <code className="text-sm text-gray-400">
                                title,description,category,difficulty,points,flag,hints<br />
                                SQL Injection,Basic SQLi challenge,web,Easy,100,flag{'{'}sql123{'}'},Try UNION|Check comments<br />
                                Caesar Cipher,Classic crypto,crypto,Easy,50,flag{'{'}caesar{'}'},Shift by 13
                            </code>
                        </div>

                        <button
                            onClick={handleCSVUpload}
                            disabled={loading || (!csvUrl && !csvFile)}
                            className="cyber-button w-full py-4 text-lg"
                        >
                            {loading ? '⏳ Uploading...' : '📤 Upload Challenges'}
                        </button>
                    </div>
                )}

                {uploadMode === 'single' && (
                    <form onSubmit={handleSingleSubmit} className="cyber-card p-8">
                        <h2 className="text-2xl font-bold neon-cyan mb-6">Create New Challenge</h2>

                        <div className="mb-6">
                            <label className="block text-neon-cyan mb-2">Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                className="cyber-input w-full"
                                placeholder="Challenge title..."
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-neon-cyan mb-2">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                rows={4}
                                className="cyber-input w-full resize-none"
                                placeholder="Challenge description..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-neon-cyan mb-2">Category</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="cyber-input w-full"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-neon-cyan mb-2">Difficulty</label>
                                <select
                                    value={difficulty}
                                    onChange={(e) => setDifficulty(e.target.value as 'Easy' | 'Medium' | 'Hard')}
                                    className="cyber-input w-full"
                                >
                                    <option value="Easy">Easy</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Hard">Hard</option>
                                </select>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-neon-cyan mb-2">Points</label>
                            <input
                                type="number"
                                value={points}
                                onChange={(e) => setPoints(parseInt(e.target.value))}
                                required
                                min="10"
                                step="10"
                                className="cyber-input w-full"
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-neon-cyan mb-2">Flag</label>
                            <input
                                type="text"
                                value={flag}
                                onChange={(e) => setFlag(e.target.value)}
                                required
                                className="cyber-input w-full"
                                placeholder="flag{example}"
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-neon-cyan mb-2">Hints</label>
                            {hints.map((hint, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={hint}
                                        onChange={(e) => {
                                            const newHints = [...hints];
                                            newHints[index] = e.target.value;
                                            setHints(newHints);
                                        }}
                                        className="cyber-input flex-1"
                                        placeholder={`Hint ${index + 1}`}
                                    />
                                    {hints.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => setHints(hints.filter((_, i) => i !== index))}
                                            className="cyber-button px-4 border-neon-red text-neon-red"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => setHints([...hints, ''])}
                                className="cyber-button px-4 py-2 mt-2"
                            >
                                + Add Hint
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="cyber-button w-full py-4 text-lg"
                        >
                            {loading ? '⏳ Creating...' : '✅ Create Challenge'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
