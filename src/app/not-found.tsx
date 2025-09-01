"use client";

import Link from "next/link";

export default function NotFoundPage() {
    return (
        <main className="font-montserrat flex flex-col items-center justify-center min-h-screen bg-[#ededed] px-6">
            <div className="bg-white border border-black rounded-2xl shadow-lg p-12 text-center max-w-lg">
                {/* 404 Code */}
                <h1 className="text-7xl font-extrabold text-black mb-6">404</h1>

                {/* Message */}
                <p className="text-lg text-gray-700 mb-8">
                    Oops! The page you’re looking for doesn’t exist or has been moved.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="px-6 py-3 border-[3px] border-black text-black font-bold rounded-lg hover:bg-black hover:text-white transition"
                    >
                        Go Home
                    </Link>
                    <Link
                        href="/login"
                        className="px-6 py-3 border-[3px] border-gray-500 text-gray-700 rounded-lg hover:bg-gray-700 hover:text-white transition"
                    >
                        Login
                    </Link>
                </div>
            </div>
        </main>
    );
}
