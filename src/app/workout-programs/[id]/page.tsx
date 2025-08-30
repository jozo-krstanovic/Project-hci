"use client";

import { useState, useEffect, use } from "react";
import { contentfulClient } from "@/lib/contentful/client";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import Image from "next/image";

import { FileIcon } from "@/components/fileIcon";
import { Button } from "@/components/ui/button";

interface WorkoutProgram {
  sys: {
    id: string;
  };
  fields: {
    programName: string;
    programInformation: any;
    programImage: {
      fields: {
        file: {
          url: string;
        };
      };
    };
    programAssets: {
      sys: {
        id: string;
      };
      fields: {
        title: string;
        file: {
          url: string;
          contentType: string;
          fileName: string;
        };
      };
    }[];
  };
}

export default function WorkoutProgramPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [program, setProgram] = useState<WorkoutProgram | null>(null);

  useEffect(() => {
    const fetchProgram = async () => {
      const response = await contentfulClient.getEntry(id);
      setProgram(response as any as WorkoutProgram);
    };

    fetchProgram();
  }, [id]);

  if (!program) {
    return <div>Loading...</div>;
  }

  return (
    <main className="bg-background px-4 sm:px-10 md:px-[178px] py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl mx-auto">
        <div className="bg-card border border-border rounded-xl shadow-md p-8">
          <h1 className="text-6xl font-extrabold tracking-tight text-card-foreground">{program.fields.programName}</h1>
          <div className="mt-10 text-muted-foreground">
            {documentToReactComponents(program.fields.programInformation)}
          </div>
          <div className="mt-auto pt-4">
            <Button className="bg-white text-black border-[3px] border-black font-bold hover:bg-black hover:text-white hover:border-white transition-colors duration-200 h-[56px] px-[30px] py-[15px]">Apply Now</Button>
          </div>
        </div>
        <div className="space-y-8">
          <div className="bg-card border border-border rounded-xl shadow-md p-8">
            {program.fields.programImage && (
              <Image
                src={`https:${program.fields.programImage.fields.file.url}`}
                alt={program.fields.programName}
                width={800}
                height={400}
                className="rounded-lg"
              />
            )}
          </div>
          <div className="bg-card border border-border rounded-xl shadow-md p-8">
            <h2 className="text-3xl font-bold text-card-foreground">Program Assets</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
              {program.fields.programAssets && program.fields.programAssets.map((asset: any) => (
                <a href={`https:${asset.fields.file.url}`} target="_blank" rel="noopener noreferrer" key={asset.sys.id} className="border rounded-lg p-4 flex flex-col items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
                  {asset.fields.file.contentType.startsWith("image") ? (
                    <Image
                      src={`https:${asset.fields.file.url}`}
                      alt={asset.fields.title || asset.fields.file.fileName}
                      width={100}
                      height={100}
                      className="rounded-lg"
                    />
                  ) : (
                    <FileIcon />
                  )}
                  <span className="mt-2 text-center text-muted-foreground">{asset.fields.title || asset.fields.file.fileName}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
