import { getWorkoutPrograms } from "@/app/api/get-workout-programs/endpoints";
import WorkoutProgramsClientView from "./WorkoutProgramsClientView";
import { TypeWorkoutProgram } from "../../../content-manual-types";

export default async function WorkoutProgramsPage() {
  const programs: Array<TypeWorkoutProgram<"WITHOUT_UNRESOLVABLE_LINKS">> = await getWorkoutPrograms();
  console.log(programs);
  return <WorkoutProgramsClientView programs={programs} />;
}