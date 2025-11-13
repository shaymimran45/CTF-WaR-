"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function Navigation() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user, signOut } = useAuth();

    const navItems = [
        { name: "Home", path: "/" },
        { name: "Challenges", path: "/challenges" },
        { name: "Leaderboard", path: "/leaderboard" },
        { name: "Profile", path: "/profile" },
    ];

    // Add admin link if user is logged in
    const allNavItems = user
        ? [...navItems, { name: "Admin", path: "/admin" }]
        : navItems;

    return (
        <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-2xl">🚩</span>
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            CyberCTF
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {allNavItems.map((item) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`hover:text-blue-400 transition ${pathname === item.path
                                    ? "text-blue-400 font-semibold"
                                    : "text-gray-300"
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center space-x-4">
                        {user ? (
                            <>
                                <span className="text-gray-300">Welcome, {user.email?.split('@')[0]}</span>
                                <button
                                    onClick={signOut}
                                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="text-gray-300 hover:text-white transition"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {mobileMenuOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-gray-800 border-t border-gray-700">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        {allNavItems.map((item) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`block px-3 py-2 rounded-md ${pathname === item.path
                                    ? "bg-gray-900 text-blue-400"
                                    : "text-gray-300 hover:bg-gray-700"
                                    }`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}
                        <Link
                            href="/login"
                            className="block px-3 py-2 rounded-md text-gray-300 hover:bg-gray-700"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Login
                        </Link>
                        <Link
                            href="/register"
                            className="block px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Sign Up
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
