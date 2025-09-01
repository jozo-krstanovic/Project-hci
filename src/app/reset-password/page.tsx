"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
    const [newPassword, setNewPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Supabase automatically attaches session if the link is valid
        supabase.auth.onAuthStateChange((event) => {
            if (event === "PASSWORD_RECOVERY") {
                console.log("Password recovery mode");
            }
        });
    }, []);

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const { error } = await supabase.auth.updateUser({ password: newPassword });

        if (error) {
            setError(error.message);
        } else {
            setSuccess(true);
            setTimeout(() => router.push("/"), 2000);
        }
    };

    return (
        <main className="flex flex-col bg-[#ededed] px-4 py-36">
            <div className="bg-white bg-card w-full max-w-lg border rounded-xl shadow-md p-10 mx-auto">
                <h1 className="text-center text-3xl font-bold mb-8 text-black">
                    Reset Password
                </h1>
                {success ? (
                    <p className="text-green-600 text-center">
                        Password updated! Redirecting to login...
                    </p>
                ) : (
                    <form onSubmit={handleUpdatePassword} className="space-y-6">
                        <input
                            type="password"
                            placeholder="New Password"
                            className="w-full p-4 border border-black rounded-md"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <button
                            type="submit"
                            className="w-full border-[3px] border-black text-black font-bold py-4 rounded-[5px] hover:bg-black hover:text-white"
                        >
                            Update Password
                        </button>
                    </form>
                )}
            </div>
        </main>
    );
}
