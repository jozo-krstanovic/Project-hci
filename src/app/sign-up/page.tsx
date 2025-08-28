"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from "@/lib/supabase/client"; // Import Supabase client

export default function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null); // Reset error state

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName, // Store full name in user metadata
          },
        },
      });

      if (authError) {
        setError(authError.message);
        console.error("Supabase sign-up error:", authError);
        return;
      }

      if (data.user) {
        console.log("Sign-up successful, user:", data.user);
        // Supabase often requires email confirmation, so a redirect to a confirmation page
        // or a message to check email might be appropriate here.
        router.push("/login?message=Check your email for a confirmation link!");
      } else if (data.session === null) {
        // This case happens if email confirmation is required
        router.push("/login?message=Please check your email to confirm your account.");
      }

    } catch (err) {
      console.error("Unexpected error during sign-up:", err);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <main className="flex flex-col bg-[#ededed] px-4 py-8">
      {/* Card */}
      <div className="bg-background w-full max-w-lg lg:max-w-xl border rounded-xl shadow-md p-10 mx-auto my-auto">

        {/* Title */}
        <h1 className="text-center text-3xl font-bold mb-8 text-black">
          Sign Up
        </h1>

        {/* Form */}
        <form className="flex flex-col space-y-6" onSubmit={handleSignUp}>
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-4 border border-black rounded-md text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
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
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full p-4 border border-black rounded-md text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full border-[3px] border-black text-black font-montserrat font-bold py-4 rounded-[5px] transition duration-200 hover:bg-black hover:text-white"
          >
            Sign Up
          </button>
        </form>

        {/* Links */}
        <div className="flex flex-col items-center mt-8 space-y-2 text-sm font-montserrat">
          <Link href="/login" className="text-gray-600 hover:text-black transition">
            Already have an account? <span className="font-bold">Login</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
