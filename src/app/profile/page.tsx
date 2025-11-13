"use client";

export default function ProfilePage() {
    const mockUser = {
        username: "h4ck3r_pro",
        email: "hacker@example.com",
        rank: 15,
        points: 2340,
        solves: 12,
        joinDate: "January 2025",
    };

    const recentSolves = [
        { id: 1, title: "Simple Caesar Cipher", category: "Crypto", points: 100 },
        { id: 2, title: "SQL Injection Basics", category: "Web", points: 150 },
        { id: 3, title: "Hidden Message", category: "Forensics", points: 250 },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Profile Header */}
                <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                            {mockUser.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                {mockUser.username}
                            </h1>
                            <p className="text-gray-600 mb-4">{mockUser.email}</p>
                            <div className="flex gap-4 text-sm">
                                <span className="text-gray-600">
                                    Joined {mockUser.joinDate}
                                </span>
                                <span className="text-gray-400">•</span>
                                <span className="text-blue-600 font-semibold">
                                    Rank #{mockUser.rank}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="text-gray-600 mb-2">Total Points</div>
                        <div className="text-4xl font-bold text-blue-600">
                            {mockUser.points}
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="text-gray-600 mb-2">Challenges Solved</div>
                        <div className="text-4xl font-bold text-green-600">
                            {mockUser.solves}
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="text-gray-600 mb-2">Global Rank</div>
                        <div className="text-4xl font-bold text-purple-600">
                            #{mockUser.rank}
                        </div>
                    </div>
                </div>

                {/* Recent Solves */}
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Recent Solves
                    </h2>
                    <div className="space-y-4">
                        {recentSolves.map((solve) => (
                            <div
                                key={solve.id}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                            >
                                <div>
                                    <div className="font-semibold text-gray-900">
                                        {solve.title}
                                    </div>
                                    <div className="text-sm text-gray-600">{solve.category}</div>
                                </div>
                                <div className="text-lg font-bold text-blue-600">
                                    +{solve.points}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
