"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TypeWorkoutProgram } from "../../../content-manual-types";

export default function WorkoutProgramsClientView({ programs }: { programs: Array<TypeWorkoutProgram<"WITHOUT_UNRESOLVABLE_LINKS">> }) {
  const [viewMode, setViewMode] = useState("card");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPrograms = programs.filter((program) =>
    program.fields.programName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="bg-background px-4 sm:px-10 md:px-[178px] py-10 font-montserrat">
      {/* Search & View Toggle */}
      <div className="w-full max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <input
          type="text"
          placeholder="Search for a workout program..."
          className="w-full sm:w-1/2 p-4 border rounded-xl bg-input border-border focus:ring-ring focus:border-ring shadow-sm placeholder:text-muted-foreground transition"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'card' ? 'default' : 'outline'}
            onClick={() => setViewMode("card")}
            className="px-6 py-3 font-bold rounded-lg transition-colors duration-200"
          >Card View</Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            onClick={() => setViewMode("list")}
            className="px-6 py-3 font-bold rounded-lg transition-colors duration-200"
          >List View</Button>
        </div>
      </div>

      {/* Programs Grid / List */}
      <div className="w-full max-w-6xl mx-auto mt-10">
        {viewMode === "card" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPrograms.map((program) => (
              <Link href={`/workout-programs/${program.sys.id}`} key={program.sys.id} className="group">
                <div className="bg-white dark:bg-gray-800 border border-border rounded-2xl shadow-lg overflow-hidden flex flex-col h-full transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
                  {program.fields.programImage && (
                    <div className="relative w-full h-64">
                      <Image
                        src={`https:${program.fields.programImage.fields.file?.url}`}
                        alt={program.fields.programName}
                        fill
                        style={{ objectFit: 'cover' }}
                        className="transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    <h2 className="text-2xl font-bold text-card-foreground mb-2 transition-colors duration-200 group-hover:text-brand-primary">
                      {program.fields.programName}
                    </h2>
                    <div className="mt-auto pt-4">
                      <Button className="bg-brand-primary text-black font-bold rounded-lg h-14 px-6 py-3 shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-300">Apply Now</Button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredPrograms.map((program) => (
              <Link href={`/workout-programs/${program.sys.id}`} key={program.sys.id} className="group">
                <div className="bg-white dark:bg-gray-800 border border-border rounded-2xl shadow-md p-4 flex flex-col sm:flex-row items-center justify-between transition-transform duration-300 hover:scale-102 hover:shadow-lg">
                  <div className="flex items-center gap-4">
                    {program.fields.programImage && (
                      <Image
                        src={`https:${program.fields.programImage.fields.file?.url}`}
                        alt={program.fields.programName}
                        width={200}
                        height={120}
                        className="rounded-lg transition-transform duration-300 group-hover:scale-105"
                      />
                    )}
                    <div>
                      <h2 className="text-2xl font-bold text-card-foreground transition-colors duration-200 group-hover:text-brand-primary">
                        {program.fields.programName}
                      </h2>
                      <p className="mt-2 text-muted-foreground line-clamp-2">
                        {program.fields.programInformation.content[0].content[0].data.text}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-0">
                    <Button className="bg-brand-primary text-black font-bold rounded-lg h-14 px-6 py-3 shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-300">Apply Now</Button>
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
