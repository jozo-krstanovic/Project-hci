"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface DeleteProgramButtonProps {
  programId: string;
}

export default function DeleteProgramButton({ programId }: DeleteProgramButtonProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this program?")) {
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/delete-workout-program", {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ programId }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Program deleted successfully!");
        router.refresh(); // Re-fetch data on the current page
      } else {
        setMessage(`Error: ${data.error || "Something went wrong."}`);
      }
    } catch (error: unknown) {
      let errorMessage = 'Network error.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setMessage(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        className="bg-white text-red-600 border border-red-600 font-bold rounded-lg px-6 py-3 shadow hover:bg-red-600 hover:text-white hover:shadow-xl transition-colors duration-300"
        onClick={handleDelete}
        disabled={loading}
      >
        {loading ? "Deleting..." : "Delete"}
      </Button>
      {message && <p className="text-sm mt-2" style={{ color: message.startsWith("Error") ? "red" : "green" }}>{message}</p>}
    </>
  );
}
