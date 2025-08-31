import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import DeleteProgramButton from "./DeleteProgramButton";
import { getSupabaseClient } from "../supabaseClient";
import { getWorkoutPrograms } from "@/app/api/get-workout-programs/route";
import { TypeWorkoutProgram } from "../../../../content-manual-types";

export default async function AdminWorkoutProgramsPage() {
  const supabase = await getSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single();

  if (profileError || profile?.role !== "admin") {
    redirect("/");
  }

  const programs: Array<TypeWorkoutProgram<"WITHOUT_UNRESOLVABLE_LINKS">> = await getWorkoutPrograms();

  return (
    <main className="bg-background px-4 sm:px-10 md:px-[178px] py-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-card-foreground">
          Admin Workout Programs
        </h1>
        <Link href="/admin/add-workout-program">
          <Button className="bg-brand-primary text-black font-bold py-3 px-6 rounded-lg shadow hover:scale-105 hover:shadow-xl transition-transform duration-300">
            Add New Program
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {programs.map((program) => (
          <div key={program.sys.id} className="bg-card border border-border rounded-2xl shadow-md p-6 flex flex-col hover:scale-[1.02] hover:shadow-lg transition-transform duration-300">
            <div className="relative w-full h-64 mb-4 rounded-lg overflow-hidden">
              {program.fields.programImage && (
                <Image
                  src={`https:${program.fields.programImage.fields.file?.url}`}
                  alt={program.fields.programName}
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-lg"
                />
              )}
            </div>
            <h2 className="text-2xl font-bold text-card-foreground mb-4 line-clamp-2">
              {program.fields.programName}
            </h2>
            <div className="flex mt-auto pt-4 gap-4">
              <Link href={`/admin/workout-programs/${program.sys.id}/edit`}>
                <Button className="bg-white text-black border border-black font-bold rounded-lg px-6 py-3 shadow hover:scale-105 hover:shadow-xl transition-transform duration-300">
                  Edit
                </Button>
              </Link>
              <DeleteProgramButton programId={program.sys.id} />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
