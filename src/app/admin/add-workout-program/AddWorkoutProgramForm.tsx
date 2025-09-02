"use client";

import { useState, DragEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { X, FileText, FileArchive, FileCode, ArrowBigLeft } from "lucide-react";
import Select, { SingleValue } from "react-select";
import { difficultyOptions, levelOptions, customStyles, Option } from "../options";

export default function AddWorkoutProgramForm() {
  const [programName, setProgramName] = useState("");
  const [programInformation, setProgramInformation] = useState("");
  const [programImage, setProgramImage] = useState<File | null>(null);
  const [programImagePreview, setProgramImagePreview] = useState<string | null>(null);
  const [programAssets, setProgramAssets] = useState<File[]>([]);
  const [assetPreviews, setAssetPreviews] = useState<{ [key: string]: string }>({});
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [difficulty, setDifficulty] = useState(""); // NEW
  const [level, setLevel] = useState("");           // NEW
  const [duration, setDuration] = useState("");     // NEW
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  // Generate preview when program image changes
  useEffect(() => {
    setIsMounted(true);
    if (programImage) {
      const objectUrl = URL.createObjectURL(programImage);
      setProgramImagePreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setProgramImagePreview(null);
    }

    return;
  }, [programImage]);

  // Generate previews for assets
  useEffect(() => {
    const newPreviews: { [key: string]: string } = {};
    programAssets.forEach((file) => {
      if (file.type.startsWith("image/")) {
        newPreviews[file.name] = URL.createObjectURL(file);
      }
    });
    setAssetPreviews(newPreviews);

    return () => {
      Object.values(assetPreviews).forEach((url) => URL.revokeObjectURL(url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [programAssets]);

  const handleDrop = (e: DragEvent<HTMLLabelElement>, isImage = false) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      if (isImage) {
        const file = e.dataTransfer.files[0];
        if (file.type.startsWith("image/")) setProgramImage(file);
      } else {
        setProgramAssets((prev) => [...prev, ...Array.from(e.dataTransfer.files)]);
      }
    }
  };

  const handleChange = (selected: SingleValue<Option>, isDifficulty: boolean) => {
    if (selected) {
      if (isDifficulty)
        setDifficulty(selected.value);
      else
        setLevel(selected.value);
    }
    else
      if (isDifficulty)
        setDifficulty("");
      else
        setLevel("");
  }

  const removeAsset = (index: number) => {
    setProgramAssets((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!programName || !programInformation || !programImage) {
      setMessage("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("programName", programName);
    formData.append("programInformation", programInformation);

    if (difficulty) formData.append("difficulty", difficulty); // NEW
    if (level) formData.append("level", level);           // NEW
    if (duration) formData.append("duration", duration);     // NEW

    if (programImage) formData.append("programImage", programImage);
    if (programAssets.length > 0) {
      for (let i = 0; i < programAssets.length; i++) {
        formData.append("programAssets", programAssets[i]);
      }
    }

    try {
      const response = await fetch("/api/add-workout-program", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Workout program added successfully!");
        setProgramName("");
        setDifficulty(""); // reset
        setLevel("");      // reset
        setDuration("");   // reset
        setProgramInformation("");
        setProgramImage(null);
        setProgramAssets([]);
        setAssetPreviews({});
        router.push("/workout-programs");
      } else {
        setMessage(`Error: ${data.error || "Something went wrong."}`);
      }
    } catch (error: unknown) {
      let errorMessage = "Network error.";
      if (error instanceof Error) errorMessage = error.message;
      setMessage(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.includes("pdf")) return <FileText className="w-4 h-4 text-red-500" />;
    if (file.type.includes("zip") || file.type.includes("rar")) return <FileArchive className="w-4 h-4 text-yellow-500" />;
    if (file.type.includes("json") || file.type.includes("javascript") || file.type.includes("text")) return <FileCode className="w-4 h-4 text-green-500" />;
    return <FileText className="w-4 h-4 text-gray-500" />;
  };

  return (
    <main className="bg-background min-h-screen grid place-items-center px-4 sm:px-10 font-montserrat">
      <div className="flex w-full max-w-3xl justify-between items-center mb-6">
        <Button
          variant="outline"
          onClick={() => router.push("/admin/workout-programs")}
          className="group bg-brand-primary text-black font-bold rounded-lg h-14 px-4 py-3 shadow-lg hover:text-white hover:bg-black hover:border-black"
        >
          <ArrowBigLeft className="text-black mr-[9px] group-hover:text-white" />Cancel
        </Button>
        <h1 className="text-4xl flex-grow font-bold text-center flex-1">Add Workout Program</h1>
      </div>
      <div>
        <form
          onSubmit={handleSubmit}
          className="bg-card border border-border rounded-2xl shadow-lg p-8 w-full max-w-3xl"
        >
          <span className=" text-black text-sm text-muted">Fields marked with <b>*</b> are required</span>
          {/* Program Name */}
          <div className="my-6">
            <label htmlFor="programName" className="block font-bold mb-2">
              Program Name*
            </label>
            <input
              type="text"
              id="programName"
              className="w-full border border-border rounded-lg px-4 py-3 text-card-foreground focus:ring-2 focus:ring-brand-primary focus:outline-none"
              value={programName}
              onChange={(e) => setProgramName(e.target.value)}
              required
            />
          </div>

          {/* Difficulty / Level / Duration */}
          {isMounted && <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="mb-6">
              <label className="block font-bold mb-2">Difficulty</label>
              <Select
                options={difficultyOptions}
                value={difficulty ? { value: difficulty, label: difficulty } : null}
                onChange={(option) => handleChange(option as SingleValue<Option>, true)}
                isClearable
                styles={customStyles}
                placeholder="Select Difficulty..."
              />
            </div>
            <div className="mb-6">
              <label className="block font-bold mb-2">Level</label>
              <Select
                options={levelOptions}
                value={level ? { value: level, label: level } : null}
                onChange={(option) => handleChange(option as SingleValue<Option>, false)}
                isClearable
                styles={customStyles}
                placeholder="Select Level..."
              />
            </div>
            <div>
              <label className="block font-bold mb-2">Duration</label>
              <input
                type="number"
                className="w-full h-[42px] border border-border rounded-lg px-4 py-3 text-card-foreground focus:ring-2 focus:ring-brand-primary focus:outline-none"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Up to 180 minutes"
                min={1}
                max={180}
              />
            </div>
          </div>
          }
          {/* Program Info */}
          <div className="mt-6 mb-6">
            <label htmlFor="programInformation" className="block font-bold mb-2">
              Program Information* (Rich Text JSON)
            </label>
            <textarea
              id="programInformation"
              className="w-full border border-border rounded-lg px-4 py-3 text-card-foreground focus:ring-2 focus:ring-brand-primary focus:outline-none h-40"
              value={programInformation}
              onChange={(e) => setProgramInformation(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Enter Contentful Rich Text JSON here. For plain text, just type and it
              will be converted to a basic paragraph structure.
            </p>
          </div>

          {/* Program Image */}
          <label
            htmlFor="programImage"
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => handleDrop(e, true)}
            className={`mb-6 block border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${dragActive ? "border-brand-primary bg-gray-50" : "border-border"
              }`}
          >
            <span className="block font-bold mb-2">Program Image*</span>
            <input
              type="file"
              id="programImage"
              className="hidden"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={(e) =>
                e.target.files && e.target.files.length > 0
                  ? setProgramImage(e.target.files[0])
                  : null
              }
            />
            {programImagePreview ? (
              <div className="relative inline-block">
                <img
                  src={programImagePreview}
                  alt="Preview"
                  className="max-h-40 rounded-lg border"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setProgramImage(null);
                  }}
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
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => handleDrop(e, false)}
            className={`mb-6 block border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${dragActive ? "border-brand-primary bg-gray-50" : "border-border"
              }`}
          >
            <span className="block font-bold mb-2">Program Assets</span>
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
            {programAssets.length > 0 ? (
              <ul className="mt-2 space-y-2 text-left">
                {programAssets.map((file, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center bg-gray-50 border rounded px-3 py-2"
                  >
                    <div className="flex items-center space-x-2">
                      {file.type.startsWith("image/") && assetPreviews[file.name] ? (
                        <img
                          src={assetPreviews[file.name]}
                          alt={file.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                      ) : (
                        getFileIcon(file)
                      )}
                      <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeAsset(index);
                      }}
                      className="p-1 hover:bg-red-100 rounded"
                    >
                      <X className="w-4 h-4 text-red-500" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">
                Drag & drop or click to upload multiple files
              </p>
            )}
          </label>

          {/* Submit */}
          <Button
            type="submit"
            variant={"outline"}
            className="w-full bg-brand-primary text-lg text-black font-bold rounded-lg h-14 px-6 py-3 shadow-lg hover:text-white hover:bg-black hover:border-black"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Program"}
          </Button>
        </form>
        {message && (
          <div
            className={`mt-6 relative px-4 py-3 rounded-xl shadow-md border text-center text-sm font-medium transition-all duration-300 ease-in-out
      ${message.startsWith("Error")
                ? "bg-red-500/10 border-red-400 text-red-600"
                : "bg-green-500/10 border-green-400 text-green-600"
              }`}
          >
            {message}
            <button
              type="button"
              onClick={() => setMessage("")}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label="Dismiss message"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
