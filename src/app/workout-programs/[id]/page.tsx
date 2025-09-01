"use client";

import { useState, useEffect, use } from "react";
import { contentfulClient } from "@/lib/contentful/client";
import Image from "next/image";
import Link from "next/link";

import { FileIcon } from "@/components/fileIcon";
import { Button } from "@/components/ui/button";
import RichTextRenderer from "@/components/RichTextRenderer";
import type { IWorkoutProgram, IWorkoutProgramFields } from '@/contentful-types';

export default function WorkoutProgramPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [program, setProgram] = useState<IWorkoutProgramFields | null>(null);

  useEffect(() => {
    const fetchProgram = async () => {
      const response = await contentfulClient.getEntry(id);
      const workoutProgram = response as IWorkoutProgram;
      setProgram(workoutProgram.fields as IWorkoutProgramFields);
    };
    fetchProgram();
  }, [id]);

  if (!program) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner"></div>
        <style jsx>{`
          .spinner {
            border: 4px solid rgba(0, 0, 0, 0.1);
            border-left-color: #333;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <main className="bg-background px-4 sm:px-10 md:px-[178px] py-10 font-montserrat">
      <Link href="/workout-programs">
        <Button variant={"outline"} className="bg-brand-primary text-black font-bold rounded-lg h-14 px-6 py-3 shadow-lg hover:text-white hover:bg-black hover:border-black mb-8">
          &larr; Back to Programs
        </Button>
      </Link>

      <div className="bg-card border border-border rounded-2xl shadow-lg p-8 flex flex-col lg:flex-row gap-8">
        {/* Image Section */}
        {program.programImage && (
          <div className="w-full lg:w-1/2 flex-shrink-0 flex justify-center">
            <Image
              src={`https:${program.programImage.fields.file?.url}`}
              alt={program.programName}
              width={800}
              height={400}
              className="rounded-lg w-full max-w-md h-auto object-cover"
            />
          </div>
        )}

        {/* Description + Name Section */}
        <div className="w-full lg:w-1/2 flex flex-col max-h-[600px]">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-card-foreground mb-4">
            {program.programName}
          </h1>

          {/* New Program Info Section */}
          <div className="flex flex-wrap gap-4 mb-6">
            {program.difficulty && (
              <span className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-semibold">
                Difficulty: {program.difficulty}
              </span>
            )}
            {program.level && (
              <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                Level: {program.level}
              </span>
            )}
            {program.duration && (
              <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                Duration: {program.duration}
              </span>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-card-foreground mb-4">Description</h2>
          <div className="border-t border-border mb-4"></div>
          <div className="mt-4 flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-brand-primary scrollbar-track-gray-200 p-2 rounded-md">
            <RichTextRenderer document={program.programInformation} />
          </div>
        </div>
      </div>

      {/* Program Assets Section */}
      {program.programAssets && program.programAssets.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-card-foreground mb-4">Program Assets</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {program.programAssets.map((asset: any) => (
              <div key={asset.sys.id} title={asset.fields.title || asset.fields.file.fileName} className="border rounded-lg relative overflow-hidden group">
                <a href={`https:${asset.fields.file.url}`} target="_blank" rel="noopener noreferrer">
                  <div className="h-32 flex items-center justify-center bg-gray-50 group-hover:bg-gray-100 transition">
                    {asset.fields.file.contentType.startsWith("image") ? (
                      <Image
                        src={`https:${asset.fields.file.url}`}
                        alt={asset.fields.title || asset.fields.file.fileName}
                        width={100}
                        height={100}
                        className="rounded-t-lg"
                      />
                    ) : (
                      <FileIcon width="30px" height="30px" />
                    )}
                  </div>
                  <div className="border-t border-border p-2 text-center">
                    <span className="text-sm text-muted-foreground line-clamp-2">
                      {asset.fields.title || asset.fields.file.fileName}
                    </span>
                  </div>
                </a>
                <a href={`/api/download?url=https:${asset.fields.file.url}`} download className="absolute top-0 right-0 bg-white rounded-bl-lg p-1 shadow-md hover:bg-gray-100 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
