"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TypeWorkoutProgram } from "../../../content-manual-types";
import { motion } from "framer-motion";
import Select, { SingleValue, StylesConfig } from "react-select";

type Option = {
  value: string;
  label: string;
}

const customSelectStyles: StylesConfig<Option, false> = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "#ffffff",        // Match your page background (light mode)
    borderColor: state.isFocused ? "#6366f1" : "#d1d5db", // Tailwind indigo-500 focus, gray-300 default
    boxShadow: state.isFocused ? "0 0 0 1px #6366f1" : "none",
    borderRadius: "0.5rem",             // Rounded like your inputs
    paddingLeft: "0px",
    paddingRight: "0",             // Leave space for the arrow
    minHeight: "48px",
    fontSize: "1rem",
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "0.5rem",
    backgroundColor: "#ffffff",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    zIndex: 50,
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? "#e0e7ff" : "#ffffff", // light indigo hover
    color: "#111827", // Tailwind gray-900
    cursor: "pointer",
    fontSize: "0.95rem",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#111827",
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    color: state.isFocused ? "#6366f1" : "#6b7280", // Indigo-500 when focused, gray-500 default
    padding: "0 9px 0 0",
  }),
  indicatorSeparator: () => ({
    display: "none", // Hide the vertical line
  }),
};


export default function WorkoutProgramsClientView({
  programs,
}: {
  programs: Array<TypeWorkoutProgram<"WITHOUT_UNRESOLVABLE_LINKS">>;
}) {
  const [viewMode, setViewMode] = useState("card");
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [maxDurationFilter, setMaxDurationFilter] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  // Extract unique options for dropdowns
  const difficultyOptions = useMemo(() => {
    const set = new Set<string>();
    programs.forEach(p => p.fields.difficulty && set.add(p.fields.difficulty));
    return Array.from(set);
  }, [programs]);

  const levelOptions = useMemo(() => {
    const set = new Set<string>();
    programs.forEach(p => p.fields.level && set.add(p.fields.level));
    return Array.from(set);
  }, [programs]);

  // Map your options for react-select
  const difficultyOptionsReact: Option[] = difficultyOptions.map((d) => ({ value: d, label: d }));
  const levelOptionsReact: Option[] = levelOptions.map((l) => ({ value: l, label: l }));

  // Filter programs
  const filteredPrograms = programs.filter((program) => {
    const matchesSearch = program.fields.programName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesDifficulty = difficultyFilter
      ? program.fields.difficulty === difficultyFilter
      : true;

    const matchesLevel = levelFilter ? program.fields.level === levelFilter : true;

    const matchesDuration = maxDurationFilter
      ? program.fields.duration && program.fields.duration <= maxDurationFilter
      : true;

    return matchesSearch && matchesDifficulty && matchesLevel && matchesDuration;
  });

  const handleChange = (selected: SingleValue<Option>, isDifficulty: boolean) => {
    if (selected) {
      if (isDifficulty)
        setDifficultyFilter(selected.value);
      else
        setLevelFilter(selected.value);
    }
  }

  return (
    <main className="bg-background px-4 sm:px-10 md:px-[178px] py-10 font-montserrat">
      {/* Search & Filters */}
      <div className="w-full max-w-6xl mx-auto flex flex-col gap-4 mb-4">
        {/* Filters Row */}
        {isMounted && (
          <div className="flex flex-wrap gap-2 mb-4">
            <Select
              options={[{ value: "", label: "All Difficulties" }, ...difficultyOptionsReact]}
              value={difficultyFilter ? { value: difficultyFilter, label: difficultyFilter } : { value: "", label: "All Difficulties" }}
              onChange={(option) => handleChange(option as SingleValue<Option>, true)}
              styles={customSelectStyles}
              className="w-[200px]"
              classNamePrefix="react-select"
              defaultValue={{ value: "", label: "All Difficulties" }}
            />

            <Select
              options={[{ value: "", label: "All Levels" }, ...levelOptionsReact]}
              value={levelFilter ? { value: levelFilter, label: levelFilter } : { value: "", label: "All Levels" }}
              onChange={(option) => handleChange(option as SingleValue<Option>, false)}
              styles={customSelectStyles}
              className="w-[162px]"
              classNamePrefix="react-select"
            />

            <input
              type="number"
              placeholder="Max Duration (min)"
              value={maxDurationFilter ?? ""}
              onChange={(e) => setMaxDurationFilter(e.target.value ? Number(e.target.value) : null)}
              className="p-3 border rounded-lg w-[197px] bg-white"
              min={0}
              max={180}
            />
          </div>
        )}

        {/* Search + View Toggle Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <input
            type="text"
            placeholder="Search for a workout program..."
            className="w-full sm:w-1/2 p-4 border rounded-xl bg-input border-border focus:ring-ring focus:border-ring shadow-sm placeholder:text-muted-foreground transition"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="flex gap-2 mt-2 sm:mt-0">
            <Button
              variant={viewMode === "card" ? "selected" : "outline"}
              onClick={() => setViewMode("card")}
              className="px-6 py-3 font-bold rounded-lg transition-colors duration-200"
            >
              Card View
            </Button>
            <Button
              variant={viewMode === "list" ? "selected" : "outline"}
              onClick={() => setViewMode("list")}
              className="px-6 py-3 font-bold rounded-lg transition-colors duration-200"
            >
              List View
            </Button>
          </div>
        </div>
      </div>


      {/* Programs Grid / List */}
      <div className="w-full max-w-6xl mx-auto mt-6">
        {viewMode === "card" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPrograms.map((program, index) => (
              <Link
                href={`/workout-programs/${program.sys.id}`}
                key={program.sys.id}
                className="group"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex flex-col h-full bg-white border border-border rounded-2xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  {program.fields.programImage && (
                    <div className="relative w-full aspect-[5/3]">
                      <Image
                        src={`https:${program.fields.programImage.fields.file?.url}`}
                        alt={program.fields.programName}
                        fill
                        style={{ objectFit: "cover" }}
                        className="transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    <h2 className="text-2xl font-bold text-card-foreground mb-2 transition-colors duration-200">
                      {program.fields.programName}
                    </h2>
                    <div className="mt-auto flex flex-wrap gap-2 pt-4">
                      {program.fields.difficulty && (
                        <span className="px-3 py-1 bg-brand-primary text-black rounded-full text-sm font-semibold">
                          {program.fields.difficulty}
                        </span>
                      )}
                      {program.fields.duration && (
                        <span className="px-3 py-1 bg-gray-200 text-sm rounded-full">
                          {program.fields.duration} min
                        </span>
                      )}
                      {program.fields.level && (
                        <span className="px-3 py-1 bg-green-200 text-sm rounded-full">
                          {program.fields.level}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {filteredPrograms.map((program, index) => (
              <Link
                href={`/workout-programs/${program.sys.id}`}
                key={program.sys.id}
                className="group"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white border border-border rounded-2xl shadow-md p-4 gap-4 transition-transform duration-300 hover:scale-102 hover:shadow-lg"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
                    {program.fields.programImage && (
                      <div className="w-full sm:w-[200px] h-[120px] flex-shrink-0 overflow-hidden rounded-lg">
                        <Image
                          src={`https:${program.fields.programImage.fields.file?.url}`}
                          alt={program.fields.programName}
                          width={200}
                          height={120}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-card-foreground transition-colors duration-200">
                        {program.fields.programName}
                      </h2>
                      {program.fields.programInformation?.content?.[0]?.content?.[0]?.data?.text && (
                        <p className="mt-2 text-muted-foreground line-clamp-2">
                          {program.fields.programInformation.content[0].content[0].data.text}
                        </p>
                      )}
                      <div className="mt-2 flex flex-wrap gap-2">
                        {program.fields.difficulty && (
                          <span className="px-3 py-1 bg-brand-primary text-black rounded-full text-sm font-semibold">
                            {program.fields.difficulty}
                          </span>
                        )}
                        {program.fields.duration && (
                          <span className="px-3 py-1 bg-gray-200 text-sm rounded-full">
                            {program.fields.duration} min
                          </span>
                        )}
                        {program.fields.level && (
                          <span className="px-3 py-1 bg-green-200 text-sm rounded-full">
                            {program.fields.level}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
