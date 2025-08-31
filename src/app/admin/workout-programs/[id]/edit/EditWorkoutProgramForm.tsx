"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { X, ArrowBigLeft } from "lucide-react"; // Make sure lucide-react is installed
import type { TypeWorkoutProgram } from "../../../../../../content-manual-types";

interface EditWorkoutProgramFormProps {
  program: TypeWorkoutProgram<"WITHOUT_UNRESOLVABLE_LINKS">["fields"];
  programId: string;
}

type Asset = {
  name: string;
  url?: string; // optional, exists for old assets
  file?: File;  // optional, exists for newly added files
};

export default function EditWorkoutProgramForm({ program, programId }: EditWorkoutProgramFormProps) {
  const [programName, setProgramName] = useState(program.programName);
  const [programInformation, setProgramInformation] = useState<string>("");
  const [programImage, setProgramImage] = useState<File | null>(null);
  const [programImagePreview, setProgramImagePreview] = useState<string | null>(null);
  const [programAssets, setProgramAssets] = useState<File[]>([]);
  const [programAssetsPreview, setProgramAssetsPreview] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (program.programInformation) {
      console.log(program.programInformation);
      const plainText = program.programInformation.content
        .map((node) =>
          node.nodeType === "paragraph" && node.content
            ? node.content.map((textNode) => {
              if (textNode.nodeType === "text")
                return textNode.value;
              return "";
            }).join("")
            : ""
        )
        .join("\n");
      setProgramInformation(plainText);
    }

    if (program.programImage) {
      setProgramImagePreview(`https:${program.programImage.fields.file?.url}`);
    }

    if (program.programAssets?.length) {
      const previews = program.programAssets.map((asset) => ({
        name: asset?.fields.title || asset?.fields.file?.fileName || "untitled",
        url: `https:${asset?.fields.file?.url}`,
        file: undefined
      }));
      setProgramAssetsPreview(previews);
    }
  }, [program]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("programId", programId);
    formData.append("programName", programName);
    formData.append("programInformation", programInformation);

    if (programImage) formData.append("programImage", programImage);

    programAssets.forEach((file) => {
      formData.append("programAssets", file)
    });

    const oldFiles: File[] = [];
    if (programAssetsPreview.length > 0) {
      const filePromises = programAssetsPreview.map(async (asset) => {
        if (!asset.url) return null;
        const response = await fetch(asset.url);
        const blob = await response.blob();
        return new File([blob], asset.name, { type: blob.type });
      });

      const files = await Promise.all(filePromises);
      oldFiles.push(...files.filter(Boolean) as File[]);
    }

    // Append old files to FormData
    oldFiles.forEach((file) => {
      formData.append("programAssets", file);
    });

    try {
      const response = await fetch("/api/update-workout-program", {
        method: "PUT",
        body: formData,
      });
      const data = await response.json();

      if (response.ok) {
        setMessage("Workout program updated successfully!");
        router.push("/admin/workout-programs");
      } else {
        setMessage(`Error: ${data.error || "Something went wrong."}`);
      }
    } catch (error: unknown) {
      setMessage(error instanceof Error ? `Error: ${error.message}` : "Network error.");
    } finally {
      setLoading(false);
    }
  };

  const removeAsset = (index: number) => {
    setProgramAssets((prev) => prev.filter((_, i) => i !== index));
    setProgramAssetsPreview((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <main className="bg-background min-h-screen grid place-items-center px-4 sm:px-10 font-montserrat py-10">
      <div className="flex flex-col w-full max-w-3xl">
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="outline"
            onClick={() => router.push("/admin/workout-programs")}
            className="bg-brand-primary text-black font-bold rounded-lg h-14 px-4 py-3 shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-300"
          >
            <ArrowBigLeft className="text-black mr-[9px]" />Back
          </Button>
          <h1 className="text-4xl font-bold text-center flex-1">Edit Workout Program</h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-card border border-border rounded-2xl shadow-lg p-8 w-full flex flex-col gap-6"
        >
          {/* Program Name */}
          <div>
            <label className="block font-bold mb-2">Program Name:</label>
            <input
              type="text"
              value={programName}
              onChange={(e) => setProgramName(e.target.value)}
              className="w-full border border-border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              required
            />
          </div>

          {/* Program Information */}
          <div>
            <label className="block font-bold mb-2">Program Information (Rich Text JSON):</label>
            <textarea
              value={programInformation}
              onChange={(e) => setProgramInformation(e.target.value)}
              className="w-full border border-border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-primary h-32"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Enter Contentful Rich Text JSON. Plain text will be converted to basic paragraph structure.
            </p>
          </div>

          {/* Program Image */}
          <label
            htmlFor="programImage"
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              const file = e.dataTransfer.files[0];
              if (file) {
                setProgramImage(file);
                setProgramImagePreview(URL.createObjectURL(file));
              }
            }}
            className={`block border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${dragActive ? "border-brand-primary bg-gray-50" : "border-border"} mb-6`}
          >
            <span className="block text-sm font-bold mb-2">Program Image</span>
            <input
              type="file"
              id="programImage"
              className="hidden"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setProgramImage(file);
                setProgramImagePreview(file ? URL.createObjectURL(file) : null);
              }}
            />
            {programImagePreview ? (
              <div className="relative inline-block">
                <img src={programImagePreview} alt="Preview" className="max-h-40 rounded-lg border" />
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setProgramImage(null); setProgramImagePreview(null); }}
                  className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-red-100"
                >
                  <X className="w-4 h-4 text-red-500" />
                </button>
              </div>
            ) : (
              <p className="text-muted-foreground">Drag & drop or click to upload</p>
            )}
          </label>

          {/* Program Assets */}
          <label
            htmlFor="programAssets"
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              if (e.dataTransfer.files.length) {
                setProgramAssets((prev) => [...prev, ...Array.from(e.dataTransfer.files)]);
              }
            }}
            className={`block border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${dragActive ? "border-brand-primary bg-gray-50" : "border-border"} mb-6`}
          >
            <span className="block text-sm font-bold mb-2">Program Assets</span>
            <input
              type="file"
              id="programAssets"
              className="hidden"
              multiple
              onChange={(e) => {
                if (e.target.files) {
                  setProgramAssets((prev) => [...prev, ...Array.from(e.target.files || [])]);
                }
              }}
            />
            {(programAssetsPreview.length > 0 || programAssets.length > 0) ? (
              <ul className="mt-2 space-y-2 text-left">
                {programAssetsPreview.map((asset, idx) => (
                  <li key={`preview-${idx}`} className="flex justify-between items-center bg-gray-50 border rounded px-3 py-2">
                    <span className="text-sm truncate">{asset.name}</span>
                    <button type="button" onClick={() => removeAsset(idx)} className="p-1 hover:bg-red-100 rounded">
                      <X className="w-4 h-4 text-red-500" />
                    </button>
                  </li>
                ))}
                {programAssets.map((file, idx) => (
                  <li key={`file-${idx}`} className="flex justify-between items-center bg-gray-50 border rounded px-3 py-2">
                    <span className="text-sm truncate">{file.name}</span>
                    <button type="button" onClick={() => removeAsset(idx)} className="p-1 hover:bg-red-100 rounded">
                      <X className="w-4 h-4 text-red-500" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">Drag & drop or click to upload multiple files</p>
            )}
          </label>

          {/* Submit Button */}
          <Button
            type="submit"
            className="bg-brand-primary text-black font-bold rounded-lg h-14 px-6 py-3 shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-300"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Program"}
          </Button>
        </form>

        {/* Message */}
        {message && (
          <div className={`mt-6 relative px-4 py-3 rounded-xl shadow-md border text-center text-sm font-medium transition-all duration-300 ease-in-out
              ${message.startsWith("Error") ? "bg-red-500/10 border-red-400 text-red-600" : "bg-green-500/10 border-green-400 text-green-600"}`}>
            {message}
            <button type="button" onClick={() => setMessage("")} className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700" aria-label="Dismiss message">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </main >
  );
}
