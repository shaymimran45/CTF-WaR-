import Link from "next/link";

export default function Home() {
    return (
        <main className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white py-24 px-6">
                <div className="max-w-6xl mx-auto text-center">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6">
                        Master Cybersecurity
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 text-blue-100">
                        Challenge yourself with real-world CTF problems across multiple categories
                    </p>
                    <div className="flex gap-4 justify-center flex-wrap">
                        <Link
                            href="/challenges"
                            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
                        >
                            Start Hacking
                        </Link>
                        <Link
                            href="/leaderboard"
                            className="bg-transparent border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
                        >
                            View Leaderboard
                        </Link>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-20 px-6 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
                        Challenge Categories
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                href={`/challenges?category=${category.id}`}
                                className={`bg-gradient-to-br ${category.color} p-6 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1`}
                            >
                                <div className="text-white">
                                    <div className="text-4xl mb-4">{category.icon}</div>
                                    <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                                    <p className="text-white/90">{category.description}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 px-6 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div>
                            <div className="text-5xl font-bold text-blue-600 mb-2">500+</div>
                            <div className="text-gray-600 text-lg">Challenges</div>
                        </div>
                        <div>
                            <div className="text-5xl font-bold text-purple-600 mb-2">10K+</div>
                            <div className="text-gray-600 text-lg">Players</div>
                        </div>
                        <div>
                            <div className="text-5xl font-bold text-pink-600 mb-2">50K+</div>
                            <div className="text-gray-600 text-lg">Solutions Submitted</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-bold mb-6">Ready to Start?</h2>
                    <p className="text-xl mb-8 text-blue-100">
                        Join thousands of security enthusiasts and start solving challenges today
                    </p>
                    <Link
                        href="/register"
                        className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition inline-block"
                    >
                        Create Free Account
                    </Link>
                </div>
            </section>
        </main>
    );
}

const categories = [
    {
        id: "web",
        name: "Web Exploitation",
        description: "XSS, SQL Injection, CSRF, and more web vulnerabilities",
        icon: "🌐",
        color: "from-red-500 to-orange-500",
    },
    {
        id: "crypto",
        name: "Cryptography",
        description: "Break ciphers and encryption algorithms",
        icon: "🔐",
        color: "from-green-500 to-emerald-500",
    },
    {
        id: "reversing",
        name: "Reverse Engineering",
        description: "Analyze and decompile binaries",
        icon: "🔍",
        color: "from-blue-500 to-cyan-500",
    },
    {
        id: "forensics",
        name: "Forensics",
        description: "Investigate digital evidence and recover hidden data",
        icon: "🔬",
        color: "from-purple-500 to-violet-500",
    },
    {
        id: "pwn",
        name: "Binary Exploitation",
        description: "Buffer overflows and memory corruption",
        icon: "💥",
        color: "from-yellow-500 to-amber-500",
    },
    {
        id: "misc",
        name: "Miscellaneous",
        description: "Programming, steganography, and other challenges",
        icon: "🎯",
        color: "from-pink-500 to-rose-500",
    },
];
