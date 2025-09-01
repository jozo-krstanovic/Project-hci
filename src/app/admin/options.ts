import { StylesConfig } from "react-select";

export enum Difficulty {
    Beginner = "Beginner",
    Intermediate = "Intermediate",
    Advanced = "Advanced",
}

export enum Level {
    Level1 = "Level 1",
    Level2 = "Level 2",
    Level3 = "Level 3",
    Level4 = "Level 4",
    Level5 = "Level 5",
}

export type Option = {
    value: string;
    label: string;
}

// For react-select, convert enum to array
export const difficultyOptions: Option[] = Object.values(Difficulty).map((d) => ({ value: d, label: d }));
export const levelOptions: Option[] = Object.values(Level).map((l) => ({ value: l, label: l }));

export const customStyles: StylesConfig<Option, false> = {
    control: (provided, state) => ({
        ...provided,
        backgroundColor: "white",
        borderColor: state.isFocused ? "#4f46e5" : "#d1d5db", // Tailwind focus:ring-indigo-500 / border-gray-300
        boxShadow: state.isFocused ? "0 0 0 2px rgba(79,70,229,0.2)" : "none",
        borderRadius: "0.5rem", // rounded-lg
        padding: "0.125rem", // Adjust padding
        "&:hover": {
            borderColor: "#4f46e5",
        },
    }),
    menu: (provided) => ({
        ...provided,
        borderRadius: "0.5rem",
        zIndex: 50,
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected
            ? "#4f46e5"
            : state.isFocused
                ? "#e0e7ff"
                : "white",
        color: state.isSelected ? "white" : "black",
        padding: "0.5rem 1rem",
        cursor: "pointer",
    }),
    placeholder: (provided) => ({
        ...provided,
        color: "#6b7280", // text-gray-400
    }),
    singleValue: (provided) => ({
        ...provided,
        color: "#111827", // text-gray-900
    }),
};