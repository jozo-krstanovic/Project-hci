import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function authGuard(returnElement: JSX.Element) {
    const cookieStore = await cookies(); // ✅ async in older Next.js

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                // Supabase expects this shape:
                getAll() {
                    // Adapt older API: flatten all cookies manually
                    return Object.values(cookieStore.getAll().reduce((acc, cookie) => {
                        acc[cookie.name] = cookie; // last one wins
                        return acc;
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    }, {} as Record<string, any>));
                },
                setAll() {
                    // Not supported in older Next.js server components
                    // Supabase middleware must handle refresh
                },
            },
        }
    );

    // Prefer getUser() for validation
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (error) {
        console.error(error);
        redirect("/error");
    }

    if (profile?.role !== "admin") {
        redirect("/");
    }

    return returnElement;
}

export async function getSupabaseClient() {
    const cookieStore = await cookies(); // ✅ async in older Next.js

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                // Supabase expects this shape:
                getAll() {
                    // Adapt older API: flatten all cookies manually
                    return Object.values(cookieStore.getAll().reduce((acc, cookie) => {
                        acc[cookie.name] = cookie; // last one wins
                        return acc;
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    }, {} as Record<string, any>));
                },
                setAll() {
                    // Not supported in older Next.js server components
                    // Supabase middleware must handle refresh
                },
            },
        }
    );

    return supabase;
}