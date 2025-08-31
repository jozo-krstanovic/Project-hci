import { redirect } from "next/navigation";
import { getWorkoutProgram } from "@/app/api/get-workout-programs/endpoints";
import { TypeWorkoutProgram } from "../../../../../../content-manual-types";
import EditWorkoutProgramForm from "./EditWorkoutProgramForm";
import { authGuard } from "@/app/admin/supabaseClient";

export default async function EditWorkoutProgramPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let program: TypeWorkoutProgram<"WITHOUT_UNRESOLVABLE_LINKS">["fields"] | null = null;

  try {
    program = await getWorkoutProgram(id)();
  } catch (contentfulError: unknown) {
    console.error("Error fetching workout program from Contentful:", contentfulError);
    // Optionally redirect to an error page or show a message
    redirect("/admin/workout-programs"); // Redirect back to list if program not found or error
  }

  if (!program) {
    redirect("/admin/workout-programs"); // Should not happen if try-catch works, but as a fallback
  }

  return authGuard(<EditWorkoutProgramForm program={program} programId={id} />);
}
