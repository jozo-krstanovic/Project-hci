"use client";

import { useState, useEffect } from "react";
import { contentfulClient } from "@/lib/contentful/client";
import Image from "next/image";
import Link from "next/link";
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
  };
}

export default function WorkoutProgramsPage() {
  const [programs, setPrograms] = useState<WorkoutProgram[]>([]);
  const [viewMode, setViewMode] = useState("card");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchPrograms = async () => {
      const response = await contentfulClient.getEntries({
        content_type: "workoutProgram",
      });
      setPrograms(response.items as any as WorkoutProgram[]);
    };

    fetchPrograms();
  }, []);

  const filteredPrograms = programs.filter((program) =>
    program.fields.programName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="bg-background px-4 sm:px-10 md:px-[178px] py-10">
      <div className="w-full max-w-6xl mx-auto">
        <input
          type="text"
          placeholder="Search for a workout program..."
          className="w-full p-4 border rounded-lg bg-input border-border focus:ring-ring focus:border-ring"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="flex justify-end w-full max-w-6xl mt-4 mx-auto">
        <Button variant="outline" onClick={() => setViewMode("card")} className={viewMode === 'card' ? 'bg-gray-200' : ''}>Card View</Button>
        <Button variant="outline" onClick={() => setViewMode("list")} className={viewMode === 'list' ? 'bg-gray-200' : ''}>List View</Button>
      </div>
      <div className="w-full max-w-6xl mx-auto mt-10">
        {viewMode === "card" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPrograms.map((program) => (
              <Link href={`/workout-programs/${program.sys.id}`} key={program.sys.id}>
                <div className="bg-card border border-border rounded-xl shadow-md p-6 h-full flex flex-col">
                  <div className="relative w-full h-64">
                    {program.fields.programImage && (
                      <Image
                        src={`https:${program.fields.programImage.fields.file.url}`}
                        alt={program.fields.programName}
                        fill
                        style={{objectFit: "cover"}}
                        className="rounded-lg"
                      />
                    )}
                  </div>
                  <h2 className="text-2xl font-bold mt-4 text-card-foreground">{program.fields.programName}</h2>
                  <div className="mt-auto pt-4">
                    <Button className="bg-white text-black border-[3px] border-black font-bold hover:bg-black hover:text-white hover:border-white transition-colors duration-200 h-[56px] px-[30px] py-[15px]">Apply Now</Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="w-full">
            {filteredPrograms.map((program) => (
              <Link href={`/workout-programs/${program.sys.id}`} key={program.sys.id}>
                <div className="bg-card border border-border rounded-xl shadow-md p-4 mb-4 flex justify-between items-center">
                  <div className="flex items-center">
                    {program.fields.programImage && (
                      <Image
                        src={`https:${program.fields.programImage.fields.file.url}`}
                        alt={program.fields.programName}
                        width={200}
                        height={100}
                        className="rounded-lg"
                      />
                    )}
                    <div className="ml-4">
                      <h2 className="text-2xl font-bold text-card-foreground">{program.fields.programName}</h2>
                      <p className="mt-2 text-muted-foreground line-clamp-2">
                        {/* This will not render rich text, but plain text. For rich text, we need to use a different approach */}
                        {program.fields.programInformation.content[0].content[0].value}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button className="bg-white text-black border-[3px] border-black font-bold hover:bg-black hover:text-white hover:border-white transition-colors duration-200 h-[56px] px-[30px] py-[15px]">Apply Now</Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}