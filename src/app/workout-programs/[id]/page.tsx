"use client";

import { useState, useEffect, use } from "react";
import { contentfulClient } from "@/lib/contentful/client";
import Image from "next/image";

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

  if (!program || !program.programName || !program.programAssets || !program.programInformation) {
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
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }


  return (
    <main className="bg-background px-4 sm:px-10 md:px-[178px] py-10">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-card-foreground text-center mb-8">{program.programName}</h1>
      <div className="bg-card border border-border rounded-xl shadow-md p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <div>
              {program.programImage && (
                <Image
                  src={`https:${program.programImage.fields.file?.url}`}
                  alt={program.programName}
                  width={800}
                  height={400}
                  className="rounded-lg"
                />
              )}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-card-foreground">Program Assets</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {program.programAssets && program.programAssets?.map((asset: any) => (
                  <div key={asset.sys.id} title={asset.fields.title || asset.fields.file.fileName} className="border rounded-lg relative">
                    <a href={`https://` + asset.fields.file.url} target="_blank" rel="noopener noreferrer" >
                      <div className="h-3/5 w-full flex items-center justify-center">
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
                      <div className="h-2/5 w-full border-t border-border p-2 flex items-center justify-center">
                        <span className="text-center text-muted-foreground line-clamp-2">{asset.fields.title || asset.fields.file.fileName}.{asset.fields.file.fileName.split('.').pop()}</span>
                      </div>
                    </a>
                    <a href={`/api/download?url=https:${asset.fields.file.url}`} download className="absolute top-0 right-0 bg-white rounded-bl-lg p-1 shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/2 flex flex-col">
            <h2 className="text-3xl font-bold text-card-foreground">Description</h2>
            <div className="border-t border-border my-4"></div>
            <div className="mt-10 text-muted-foreground flex-grow h-96 overflow-y-auto">
              <RichTextRenderer document={program.programInformation} />
            </div>
            <div className="mt-auto pt-4">
              <Button className="bg-white text-black border-[3px] border-black font-bold hover:bg-black hover:text-white hover:border-white transition-colors duration-200 h-[56px] px-[30px] py-[15px]">Apply Now</Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
