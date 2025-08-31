import AddWorkoutProgramForm from "./AddWorkoutProgramForm";
import { authGuard } from "../supabaseClient";

export default async function AddWorkoutProgramPage() {

  return authGuard(<AddWorkoutProgramForm />);
}
