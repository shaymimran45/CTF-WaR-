'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
    const [matrixChars, setMatrixChars] = useState<string[]>([]);

    useEffect(() => {
        // Generate matrix rain characters
        const chars = '01アイウエオカキクケコサシスセソタチツテト'.split('');
        setMatrixChars(chars);
    }, []);

    return (
        <main className="min-h-screen bg-black text-matrix-green relative overflow-hidden">
            {/* Scan Line Effect */}
            <div className="scan-line"></div>

            {/* Hero Section */}
            <section className="relative py-32 px-6">
                <div className="max-w-6xl mx-auto text-center relative z-10">
                    <div className="mb-6">
                        <span className="text-neon-cyan text-xl">&gt;&gt;&gt; INITIALIZING SYSTEM...</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-bold neon-green mb-8 glitch-text terminal-cursor">
                        CTF-WaR
                    </h1>
                    <p className="text-2xl md:text-3xl mb-4 text-neon-cyan">
                        [ CAPTURE THE FLAG PLATFORM ]
                    </p>
                    <p className="text-xl mb-12 text-gray-400 max-w-3xl mx-auto">
                        Master cybersecurity through real-world hacking challenges. Test your skills in web exploitation, cryptography, forensics, and binary exploitation.
                    </p>
                    <div className="flex gap-6 justify-center flex-wrap">
                        <Link href="/challenges" className="cyber-button px-10 py-4 text-lg">
                            &gt; START_HACKING
                        </Link>
                        <Link href="/learn" className="cyber-button px-10 py-4 text-lg border-neon-cyan text-neon-cyan">
                            &gt; LEARN_CTF
                        </Link>
                        <Link href="/leaderboard" className="cyber-button px-10 py-4 text-lg border-neon-purple text-neon-purple">
                            &gt; LEADERBOARD
                        </Link>
                    </div>
                </div>

                {/* Animated Background Elements */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-10 text-4xl neon-green animate-pulse">{'{'}</div>
                    <div className="absolute top-40 right-20 text-4xl neon-cyan animate-pulse delay-100">{'}'}</div>
                    <div className="absolute bottom-20 left-1/4 text-4xl neon-red animate-pulse delay-200">{'<>'}</div>
                    <div className="absolute bottom-40 right-1/3 text-4xl neon-green animate-pulse delay-300">{'[]'}</div>
                </div>
            </section>

            {/* System Status */}
            <section className="py-12 px-6 border-t border-b border-matrix-green bg-black bg-opacity-50">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="cyber-card text-center p-6">
                            <div className="text-5xl font-bold neon-green mb-2">500+</div>
                            <div className="text-neon-cyan text-sm">[CHALLENGES]</div>
                        </div>
                        <div className="cyber-card text-center p-6">
                            <div className="text-5xl font-bold neon-cyan mb-2">6</div>
                            <div className="text-neon-cyan text-sm">[CATEGORIES]</div>
                        </div>
                        <div className="cyber-card text-center p-6">
                            <div className="text-5xl font-bold neon-purple mb-2">10K+</div>
                            <div className="text-neon-cyan text-sm">[HACKERS]</div>
                        </div>
                        <div className="cyber-card text-center p-6">
                            <div className="text-5xl font-bold neon-red mb-2">LIVE</div>
                            <div className="text-neon-cyan text-sm">[STATUS]</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-bold neon-cyan mb-4">
                            &lt; ATTACK_VECTORS /&gt;
                        </h2>
                        <p className="text-gray-400 text-lg">Choose your specialization</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                href={`/challenges?category=${category.id}`}
                                className="cyber-card p-8 group"
                            >
                                <div className="text-6xl mb-4">{category.icon}</div>
                                <h3 className="text-2xl font-bold neon-green mb-3 group-hover:glitch-text">
                                    {category.name}
                                </h3>
                                <p className="text-gray-400 mb-4">{category.description}</p>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-neon-cyan">{category.count} challenges</span>
                                    <span className="text-matrix-green">&gt;&gt;</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-6 bg-black bg-opacity-50 border-t border-matrix-green">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-bold neon-cyan mb-4">
                            {'>'} SYSTEM_FEATURES
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="cyber-card p-6 text-center">
                            <div className="text-5xl mb-4">🎯</div>
                            <h3 className="text-xl font-bold neon-green mb-2">Real Challenges</h3>
                            <p className="text-gray-400 text-sm">
                                Practice with realistic CTF challenges
                            </p>
                        </div>

                        <div className="cyber-card p-6 text-center">
                            <div className="text-5xl mb-4">📚</div>
                            <h3 className="text-xl font-bold neon-green mb-2">Learn & Grow</h3>
                            <p className="text-gray-400 text-sm">
                                Video tutorials and tool guides
                            </p>
                        </div>

                        <div className="cyber-card p-6 text-center">
                            <div className="text-5xl mb-4">🏆</div>
                            <h3 className="text-xl font-bold neon-green mb-2">Compete</h3>
                            <p className="text-gray-400 text-sm">
                                Climb the leaderboard rankings
                            </p>
                        </div>

                        <div className="cyber-card p-6 text-center">
                            <div className="text-5xl mb-4">💡</div>
                            <h3 className="text-xl font-bold neon-green mb-2">Hints Available</h3>
                            <p className="text-gray-400 text-sm">
                                Get help when you need it
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6 relative">
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="cyber-card p-12">
                        <h2 className="text-4xl md:text-5xl font-bold neon-green mb-6">
                            {'>> READY TO HACK?'}
                        </h2>
                        <p className="text-xl mb-8 text-gray-400">
                            Join the elite community of security researchers and start your journey today
                        </p>
                        <div className="flex gap-6 justify-center flex-wrap">
                            <Link href="/register" className="cyber-button px-10 py-4 text-lg">
                                CREATE_ACCOUNT()
                            </Link>
                            <Link href="/login" className="cyber-button px-10 py-4 text-lg border-neon-cyan text-neon-cyan">
                                LOGIN()
                            </Link>
                        </div>

                        {/* Terminal-like Output */}
                        <div className="mt-12 text-left bg-black border border-matrix-green p-6 font-mono text-sm">
                            <div className="text-neon-cyan mb-2">$ ./init_hacker.sh</div>
                            <div className="text-gray-500">Loading modules...</div>
                            <div className="text-gray-500">Initializing environment...</div>
                            <div className="text-matrix-green">✓ System ready</div>
                            <div className="text-matrix-green">✓ 500+ challenges loaded</div>
                            <div className="text-matrix-green">✓ All categories online</div>
                            <div className="text-neon-cyan mt-2 terminal-cursor">Waiting for user input...</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer Stats */}
            <section className="py-12 px-6 border-t border-matrix-green bg-black">
                <div className="max-w-6xl mx-auto text-center">
                    <div className="text-gray-500 text-sm mb-4">
                        {'[SYSTEM_STATUS: OPERATIONAL]'}
                    </div>
                    <div className="flex justify-center gap-8 flex-wrap text-sm">
                        <span className="text-matrix-green">UPTIME: 99.9%</span>
                        <span className="text-neon-cyan">LATENCY: {'<'}50ms</span>
                        <span className="text-neon-purple">USERS_ONLINE: 1,234</span>
                    </div>
                </div>
            </section>
        </main>
    );
}

const categories = [
    {
        id: 'web',
        name: 'WEB EXPLOITATION',
        description: 'SQL Injection, XSS, CSRF, Authentication bypass, and web vulnerabilities',
        icon: '🌐',
        count: 120
    },
    {
        id: 'crypto',
        name: 'CRYPTOGRAPHY',
        description: 'RSA, AES, Hash functions, Classical ciphers, and encryption challenges',
        icon: '🔐',
        count: 85
    },
    {
        id: 'forensics',
        name: 'FORENSICS',
        description: 'File analysis, Steganography, Memory dumps, Network forensics',
        icon: '🔍',
        count: 95
    },
    {
        id: 'pwn',
        name: 'BINARY EXPLOITATION',
        description: 'Buffer overflow, ROP, Heap exploitation, Format string vulnerabilities',
        icon: '💥',
        count: 75
    },
    {
        id: 'reversing',
        name: 'REVERSE ENGINEERING',
        description: 'Binary analysis, Disassembly, Debugging, Malware analysis',
        icon: '🔄',
        count: 65
    },
    {
        id: 'misc',
        name: 'MISCELLANEOUS',
        description: 'Programming, Logic puzzles, OSINT, Networking challenges',
        icon: '🎯',
        count: 60
    }
];
