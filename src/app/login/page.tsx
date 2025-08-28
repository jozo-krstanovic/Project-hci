"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from "@/lib/supabase/client"; // Import Supabase client

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null); // Reset error state

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        console.error("Supabase login error:", authError);
        return;
      }

      if (data.user) {
        console.log("Login successful, user:", data.user);
        router.push("/"); // Redirect to homepage on successful login
      }
    } catch (err) {
      console.error("Unexpected error during login:", err);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <>
      <main className="flex flex-col bg-[#ededed] px-4 py-8">
        {/* Card */}
        <div className="bg-card bg-background w-full max-w-lg lg:max-w-xl border rounded-xl shadow-md p-10 mx-auto my-auto">

          {/* Title */}
          <h1 className="text-center text-3xl font-bold mb-8 text-black">
            Login
          </h1>

          {/* Form */}
          <form className="flex flex-col space-y-6" onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              className="w-full p-4 border border-black rounded-md text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-4 border border-black rounded-md text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full border-[3px] border-black text-black font-montserrat font-bold py-4 rounded-[5px] transition duration-200 hover:bg-black hover:text-white"
            >
              Login
            </button>
          </form>

          {/* Links */}
          <div className="flex flex-col items-center mt-8 space-y-2 text-sm font-montserrat">
            <a href="#" className="text-gray-600 hover:text-black transition">
              Forgot Password?
            </a>
            <Link href="/sign-up" className="text-gray-600 hover:text-black transition">
              Don’t have an account? <span className="font-bold">Sign Up</span>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
