// File: src/lib/supabaseServer.ts
// Server-side Supabase client menggunakan @supabase/ssr + cookies Next.js 15 (async).
// Digunakan di Server Components, Route Handlers, dan Server Actions.
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Membuat instance Supabase client untuk sisi server.
 * Harus dipanggil di dalam request scope (Server Component, Route Handler, dll).
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set({ name, value, ...options });
            });
          } catch {
            // Abaikan error jika dipanggil dari Server Component (read-only cookies)
          }
        },
      },
    }
  );
}
