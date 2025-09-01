import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

export interface TypeCategoryFields {
    label: EntryFieldTypes.Symbol<"workoutProgram">;
    variant?: EntryFieldTypes.Symbol;
}

export interface TypeWorkoutProgramFields {
    programName: EntryFieldTypes.Symbol;
    programInformation: EntryFieldTypes.RichText;
    programImage: EntryFieldTypes.AssetLink;
    programAssets: EntryFieldTypes.Array<EntryFieldTypes.AssetLink>;
    difficulty: EntryFieldTypes.Symbol;
    level: EntryFieldTypes.Symbol;
    duration: EntryFieldTypes.Integer;
}

export type TypeWorkoutProgramSkeleton = EntrySkeletonType<TypeWorkoutProgramFields, "workoutProgram">;
export type TypeWorkoutProgram<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeWorkoutProgramSkeleton, Modifiers, Locales>;

export interface TypeNavigationFields {
    title: EntryFieldTypes.Symbol;
    navItems: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeNavItemSkeleton>>;
}

export type TypeNavigationSkeleton = EntrySkeletonType<TypeNavigationFields, "navigation">;
export type TypeNavigation<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeNavigationSkeleton, Modifiers, Locales>;

export interface TypeNavItemFields {
    title: EntryFieldTypes.Symbol;
    path: EntryFieldTypes.Symbol;
    includeInProd?: EntryFieldTypes.Boolean;
}

export type TypeNavItemSkeleton = EntrySkeletonType<TypeNavItemFields, "navItem">;
export type TypeNavItem<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeNavItemSkeleton, Modifiers, Locales>;