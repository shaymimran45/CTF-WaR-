'use client';

import { useState } from 'react';
import Link from 'next/link';

interface LearningResource {
    id: number;
    title: string;
    description: string;
    url: string;
    category: string;
    thumbnail: string;
    channel: string;
    duration: string;
    difficulty: string;
    topics: string[];
}

interface Tool {
    id: number;
    name: string;
    description: string;
    category: string;
    downloadUrl: string;
    icon: string;
}

export default function LearnPage() {
    const [activeCategory, setActiveCategory] = useState('All');

    const categories = [
        { name: 'All', icon: '🎯' },
        { name: 'CTF Basics', icon: '📚' },
        { name: 'Web', icon: '🌐' },
        { name: 'Crypto', icon: '🔐' },
        { name: 'Forensics', icon: '🔍' },
        { name: 'Pwn', icon: '💥' },
        { name: 'Reversing', icon: '🔄' },
        { name: 'Tools', icon: '🛠️' }
    ];

    const learningResources: LearningResource[] = [
        {
            id: 1,
            title: 'CTF Introduction - Getting Started',
            description: 'Complete beginner guide to CTF competitions and how to start your journey in cybersecurity challenges.',
            url: 'https://www.youtube.com/watch?v=8ev9ZX9J45A',
            category: 'CTF Basics',
            thumbnail: '🎓',
            channel: 'John Hammond',
            duration: '25:30',
            difficulty: 'Beginner',
            topics: ['CTF Basics', 'Getting Started', 'Competition Tips']
        },
        {
            id: 2,
            title: 'Web Application Hacking - Full Course',
            description: 'Comprehensive web security course covering SQL injection, XSS, CSRF, and modern web vulnerabilities.',
            url: 'https://www.youtube.com/watch?v=X4eRbHgRawI',
            category: 'Web',
            thumbnail: '🌐',
            channel: 'The Cyber Mentor',
            duration: '4:15:00',
            difficulty: 'Intermediate',
            topics: ['SQL Injection', 'XSS', 'CSRF', 'Web Security']
        },
        {
            id: 3,
            title: 'Cryptography for CTF',
            description: 'Learn classical ciphers, modern encryption, RSA attacks, and cryptographic challenges commonly found in CTFs.',
            url: 'https://www.youtube.com/watch?v=3QnD2c4Xovk',
            category: 'Crypto',
            thumbnail: '🔐',
            channel: 'LiveOverflow',
            duration: '35:45',
            difficulty: 'Intermediate',
            topics: ['Ciphers', 'RSA', 'Encryption', 'Hash Functions']
        },
        {
            id: 4,
            title: 'Digital Forensics Fundamentals',
            description: 'Master file analysis, metadata extraction, steganography, and forensic tools for CTF challenges.',
            url: 'https://www.youtube.com/watch?v=Uk2C2RJm1Hk',
            category: 'Forensics',
            thumbnail: '🔍',
            channel: 'HackerSploit',
            duration: '42:20',
            difficulty: 'Beginner',
            topics: ['File Analysis', 'Steganography', 'Metadata', 'Forensic Tools']
        },
        {
            id: 5,
            title: 'Buffer Overflow Exploitation',
            description: 'Deep dive into memory corruption, stack overflows, return-oriented programming, and binary exploitation.',
            url: 'https://www.youtube.com/watch?v=1S0aBV-Waeo',
            category: 'Pwn',
            thumbnail: '💥',
            channel: 'Gynvael Coldwind',
            duration: '1:15:30',
            difficulty: 'Advanced',
            topics: ['Buffer Overflow', 'Stack Exploitation', 'ROP', 'Memory Corruption']
        },
        {
            id: 6,
            title: 'Reverse Engineering Tutorial',
            description: 'Learn assembly, disassembly, debugging techniques, and how to analyze compiled binaries.',
            url: 'https://www.youtube.com/watch?v=gh2RXE9BIN8',
            category: 'Reversing',
            thumbnail: '🔄',
            channel: 'Guided Hacking',
            duration: '52:15',
            difficulty: 'Advanced',
            topics: ['Assembly', 'Disassembly', 'Debugging', 'Binary Analysis']
        },
        {
            id: 7,
            title: 'PicoCTF Walkthrough Series',
            description: 'Complete walkthrough of PicoCTF challenges covering all categories with detailed explanations.',
            url: 'https://www.youtube.com/watch?v=R1w8W6K1_D4',
            category: 'CTF Basics',
            thumbnail: '🏆',
            channel: 'Martin Carlisle',
            duration: '3:45:00',
            difficulty: 'Beginner',
            topics: ['PicoCTF', 'Practice', 'All Categories', 'Walkthroughs']
        },
        {
            id: 8,
            title: 'Essential CTF Tools & Setup',
            description: 'Complete guide to setting up your CTF environment with Kali Linux, essential tools, and automation scripts.',
            url: 'https://www.youtube.com/watch?v=lZAoFs75_cs',
            category: 'Tools',
            thumbnail: '🛠️',
            channel: 'NetworkChuck',
            duration: '28:40',
            difficulty: 'Beginner',
            topics: ['Kali Linux', 'Tool Setup', 'Environment', 'Automation']
        }
    ];

    const tools: Tool[] = [
        {
            id: 1,
            name: 'Burp Suite',
            description: 'Leading web application security testing platform with proxy, scanner, and intruder tools.',
            category: 'Web',
            downloadUrl: 'https://portswigger.net/burp/communitydownload',
            icon: '🌐'
        },
        {
            id: 2,
            name: 'Ghidra',
            description: 'NSA\'s free reverse engineering tool with decompiler, debugger, and binary analysis capabilities.',
            category: 'Reversing',
            downloadUrl: 'https://ghidra-sre.org/',
            icon: '🔄'
        },
        {
            id: 3,
            name: 'Wireshark',
            description: 'World\'s most popular network protocol analyzer for packet capture and forensic analysis.',
            category: 'Forensics',
            downloadUrl: 'https://www.wireshark.org/download.html',
            icon: '🔍'
        },
        {
            id: 4,
            name: 'John the Ripper',
            description: 'Fast password cracker for hash cracking and password recovery in CTF challenges.',
            category: 'Crypto',
            downloadUrl: 'https://www.openwall.com/john/',
            icon: '🔐'
        },
        {
            id: 5,
            name: 'pwntools',
            description: 'Python library for exploit development and binary exploitation in CTF pwn challenges.',
            category: 'Pwn',
            downloadUrl: 'https://github.com/Gallopsled/pwntools',
            icon: '💥'
        },
        {
            id: 6,
            name: 'CyberChef',
            description: 'Web-based tool for encryption, encoding, compression and data analysis operations.',
            category: 'Crypto',
            downloadUrl: 'https://gchq.github.io/CyberChef/',
            icon: '🔐'
        },
        {
            id: 7,
            name: 'Radare2',
            description: 'Advanced reverse engineering framework with disassembler, debugger, and binary analysis.',
            category: 'Reversing',
            downloadUrl: 'https://rada.re/n/',
            icon: '🔄'
        },
        {
            id: 8,
            name: 'sqlmap',
            description: 'Automatic SQL injection and database takeover tool for web application testing.',
            category: 'Web',
            downloadUrl: 'https://sqlmap.org/',
            icon: '🌐'
        }
    ];

    const filteredResources = activeCategory === 'All'
        ? learningResources
        : learningResources.filter(resource => resource.category === activeCategory);

    const filteredTools = activeCategory === 'All' || activeCategory === 'Tools'
        ? tools
        : tools.filter(tool => tool.category === activeCategory);

    return (
        <div className="min-h-screen bg-black text-matrix-green p-8 relative">
            {/* Scan Line Effect */}
            <div className="scan-line"></div>

            {/* Header */}
            <div className="max-w-7xl mx-auto mb-12">
                <h1 className="text-5xl font-bold neon-green mb-4 terminal-cursor">
                    CTF Learning Hub
                </h1>
                <p className="text-xl text-neon-cyan mb-8">
                    Master cybersecurity through comprehensive tutorials, tools, and resources
                </p>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-4 mb-12">
                    {categories.map((category) => (
                        <button
                            key={category.name}
                            onClick={() => setActiveCategory(category.name)}
                            className={`cyber-button px-6 py-3 ${activeCategory === category.name
                                    ? 'bg-matrix-green text-black'
                                    : ''
                                }`}
                        >
                            {category.icon} {category.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Video Tutorials Section */}
            {(activeCategory === 'All' || activeCategory !== 'Tools') && (
                <div className="max-w-7xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold neon-cyan mb-8 flex items-center gap-3">
                        <span>📹</span> Video Tutorials
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredResources.map((resource) => (
                            <div key={resource.id} className="cyber-card">
                                <div className="text-6xl mb-4">{resource.thumbnail}</div>
                                <h3 className="text-xl font-bold neon-green mb-2">{resource.title}</h3>
                                <p className="text-sm text-gray-400 mb-4">{resource.description}</p>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {resource.topics.map((topic, index) => (
                                        <span
                                            key={index}
                                            className="text-xs px-2 py-1 border border-matrix-green text-matrix-green"
                                        >
                                            {topic}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex justify-between items-center mb-4 text-sm">
                                    <span className="neon-cyan">👤 {resource.channel}</span>
                                    <span className="text-gray-500">⏱️ {resource.duration}</span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className={`text-xs px-3 py-1 border ${resource.difficulty === 'Beginner' ? 'border-neon-green text-neon-green' :
                                            resource.difficulty === 'Intermediate' ? 'border-neon-cyan text-neon-cyan' :
                                                'border-neon-red text-neon-red'
                                        }`}>
                                        {resource.difficulty}
                                    </span>
                                    <a
                                        href={resource.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="cyber-button text-sm px-4 py-2"
                                    >
                                        Watch Now →
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Essential Tools Section */}
            {(activeCategory === 'All' || activeCategory === 'Tools' || filteredTools.length > 0) && (
                <div className="max-w-7xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold neon-cyan mb-8 flex items-center gap-3">
                        <span>🛠️</span> Essential CTF Tools
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredTools.map((tool) => (
                            <div key={tool.id} className="cyber-card text-center">
                                <div className="text-5xl mb-4">{tool.icon}</div>
                                <h3 className="text-xl font-bold neon-green mb-2">{tool.name}</h3>
                                <p className="text-sm text-gray-400 mb-4">{tool.description}</p>
                                <span className="text-xs px-3 py-1 border border-neon-cyan text-neon-cyan mb-4 inline-block">
                                    {tool.category}
                                </span>
                                <a
                                    href={tool.downloadUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="cyber-button text-sm px-4 py-2 w-full block"
                                >
                                    Download
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* External Resources */}
            <div className="max-w-7xl mx-auto mb-16">
                <h2 className="text-3xl font-bold neon-cyan mb-8 flex items-center gap-3">
                    <span>🌍</span> External Resources
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="cyber-card">
                        <h3 className="text-2xl font-bold neon-green mb-2">🏆 CTFtime</h3>
                        <p className="text-sm text-gray-400 mb-4">
                            Track ongoing CTF competitions, team rankings, and upcoming events worldwide.
                        </p>
                        <a
                            href="https://ctftime.org/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="cyber-button text-sm px-4 py-2"
                        >
                            Visit CTFtime
                        </a>
                    </div>

                    <div className="cyber-card">
                        <h3 className="text-2xl font-bold neon-green mb-2">📦 Hack The Box</h3>
                        <p className="text-sm text-gray-400 mb-4">
                            Practice penetration testing in realistic environments with guided challenges.
                        </p>
                        <a
                            href="https://www.hackthebox.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="cyber-button text-sm px-4 py-2"
                        >
                            Visit HTB
                        </a>
                    </div>

                    <div className="cyber-card">
                        <h3 className="text-2xl font-bold neon-green mb-2">🎯 TryHackMe</h3>
                        <p className="text-sm text-gray-400 mb-4">
                            Learn cybersecurity through interactive browser-based labs and rooms.
                        </p>
                        <a
                            href="https://tryhackme.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="cyber-button text-sm px-4 py-2"
                        >
                            Visit THM
                        </a>
                    </div>
                </div>
            </div>

            {/* Back to Home */}
            <div className="max-w-7xl mx-auto text-center">
                <Link href="/" className="cyber-button px-8 py-3">
                    ← Back to Home
                </Link>
            </div>
        </div>
    );
}
