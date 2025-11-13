'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthService } from '@/lib/authService';

export default function RegisterPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validation
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            setLoading(false);
            return;
        }

        try {
            await AuthService.signUp(email, password, username);
            setSuccess(true);
            setTimeout(() => {
                router.push('/challenges');
            }, 2000);
        } catch (err: any) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-black text-matrix-green flex items-center justify-center p-6">
                <div className="scan-line"></div>
                <div className="cyber-card p-12 max-w-md text-center">
                    <div className="text-6xl mb-6">✓</div>
                    <h2 className="text-3xl font-bold neon-green mb-4">ACCOUNT_CREATED</h2>
                    <p className="text-neon-cyan mb-6">
                        Welcome to CTF-WaR! Redirecting...
                    </p>
                    <div className="bg-black border border-matrix-green p-4 font-mono text-sm">
                        <div className="text-matrix-green">✓ User registered</div>
                        <div className="text-matrix-green">✓ Database updated</div>
                        <div className="text-neon-cyan">→ Redirecting to challenges...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-matrix-green flex items-center justify-center p-6 relative">
            <div className="scan-line"></div>

            <div className="max-w-md w-full relative z-10">
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-bold neon-green mb-4 terminal-cursor">
                        {'>> REGISTER'}
                    </h1>
                    <p className="text-neon-cyan">
                        Join the hacker community
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
                                {'>> USERNAME:'}
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                minLength={3}
                                className="cyber-input w-full"
                                placeholder="elite_hacker"
                                autoComplete="username"
                            />
                        </div>

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
                                minLength={6}
                                className="cyber-input w-full"
                                placeholder="••••••••"
                                autoComplete="new-password"
                            />
                            <div className="text-xs text-gray-500 mt-1">
                                Minimum 6 characters
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-neon-cyan mb-2 text-sm">
                                {'>> CONFIRM_PASSWORD:'}
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={6}
                                className="cyber-input w-full"
                                placeholder="••••••••"
                                autoComplete="new-password"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="cyber-button w-full py-4 text-lg mb-6"
                        >
                            {loading ? '⏳ CREATING_ACCOUNT...' : '🚀 CREATE_ACCOUNT'}
                        </button>
                    </form>

                    <div className="text-center">
                        <Link href="/login" className="text-neon-cyan hover:text-matrix-green">
                            {'>> ALREADY_HAVE_ACCOUNT? LOGIN'}
                        </Link>
                    </div>

                    {/* Terminal Output */}
                    <div className="mt-8 bg-black border border-matrix-green p-4 font-mono text-xs">
                        <div className="text-gray-500">$ ./create_user.sh</div>
                        <div className="text-gray-500">Initializing registration...</div>
                        <div className="text-matrix-green">✓ System ready</div>
                        <div className="text-neon-cyan terminal-cursor">Enter your details...</div>
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
                <div className="absolute top-20 right-10 text-6xl neon-green">{'{'}</div>
                <div className="absolute bottom-20 left-20 text-6xl neon-cyan">{'}'}</div>
                <div className="absolute top-1/2 right-1/4 text-6xl neon-purple">{'[]'}</div>
            </div>
        </div>
    );
}
