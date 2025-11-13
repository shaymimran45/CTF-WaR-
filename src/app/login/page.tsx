'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthService } from '@/lib/authService';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await AuthService.signIn(email, password);
            router.push('/challenges');
        } catch (err: any) {
            setError(err.message || 'Login failed. Check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-matrix-green flex items-center justify-center p-6 relative">
            <div className="scan-line"></div>

            <div className="max-w-md w-full relative z-10">
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-bold neon-green mb-4 terminal-cursor">
                        {'>> LOGIN'}
                    </h1>
                    <p className="text-neon-cyan">
                        Access the CTF platform
                    </p>
                </div>

                <div className="cyber-card p-8">
                    {error && (
                        <div className="cyber-card border-neon-red text-neon-red p-4 mb-6">
                            ❌ {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label className="block text-neon-cyan mb-2 text-sm">
                                {'>> EMAIL_ADDRESS:'}
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="cyber-input w-full"
                                placeholder="hacker@ctf.com"
                                autoComplete="email"
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-neon-cyan mb-2 text-sm">
                                {'>> PASSWORD:'}
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="cyber-input w-full"
                                placeholder="••••••••"
                                autoComplete="current-password"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="cyber-button w-full py-4 text-lg mb-6"
                        >
                            {loading ? '⏳ AUTHENTICATING...' : '🔓 ACCESS_SYSTEM'}
                        </button>
                    </form>

                    <div className="text-center">
                        <Link href="/register" className="text-neon-cyan hover:text-matrix-green">
                            {'>> CREATE_NEW_ACCOUNT'}
                        </Link>
                    </div>

                    {/* Terminal Output */}
                    <div className="mt-8 bg-black border border-matrix-green p-4 font-mono text-xs">
                        <div className="text-gray-500">$ ./authenticate.sh</div>
                        <div className="text-gray-500">Connecting to server...</div>
                        <div className="text-matrix-green">✓ Connection established</div>
                        <div className="text-neon-cyan terminal-cursor">Awaiting credentials...</div>
                    </div>
                </div>

                <div className="text-center mt-6">
                    <Link href="/" className="text-gray-500 hover:text-matrix-green">
                        ← Back to home
                    </Link>
                </div>
            </div>

            {/* Background Elements */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-20 left-10 text-6xl neon-green">{'{'}</div>
                <div className="absolute bottom-20 right-20 text-6xl neon-cyan">{'}'}</div>
                <div className="absolute top-1/2 left-1/4 text-6xl neon-red">{'<>'}</div>
            </div>
        </div>
    );
}
