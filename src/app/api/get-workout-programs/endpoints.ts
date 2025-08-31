import { contentfulClient } from "@/lib/contentful/client";
import { unstable_cache } from "next/cache"; // Replaced by 'use cache' directive in new version of Next.js
import { TypeWorkoutProgramSkeleton } from "../../../../content-manual-types";

const MINUTE = 60;
const HOUR = 60 * MINUTE;


export const getWorkoutPrograms = unstable_cache(async () => {
    // Check https://github.com/contentful/contentful.js/blob/master/ADVANCED.md#link-resolution
    // for more information on "withoutUnresolvableLinks".
    const data = await contentfulClient.withoutUnresolvableLinks.getEntries<TypeWorkoutProgramSkeleton>({
        content_type: 'workoutProgram',
        select: ['fields.programName', 'fields.programInformation', 'fields.programImage', 'fields.programAssets', 'sys.id'],
        order: ['fields.programName']
    });

    return data.items;

}, ['workoutProgram'], { revalidate: HOUR, tags: ['workoutProgram'] });


export const getWorkoutProgram = (id: string) => {
    return async () => {
        const entry =
            await contentfulClient.withoutUnresolvableLinks.getEntry<TypeWorkoutProgramSkeleton>(id);
        return entry.fields;
    };
}