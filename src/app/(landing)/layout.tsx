import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Layout untuk semua halaman publik (Landing Group).
 * Menyediakan Navbar dan Footer secara otomatis — halaman di dalam grup ini
 * TIDAK perlu mengimport Navbar/Footer sendiri.
 *
 * Route group (landing) tidak mempengaruhi URL:
 *   - (landing)/page.tsx        → /
 *   - (landing)/about/page.tsx  → /about
 *   - (landing)/events/...      → /events/...
 *   - dst.
 */
export default async function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Ambil user yang sedang login dari Supabase session (cookies)
  let userFullName: string | null = null;
  let userEmail: string | null = null;

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user: supabaseUser },
    } = await supabase.auth.getUser();

    if (supabaseUser?.email) {
      userEmail = supabaseUser.email;

      // Query ke database Drizzle untuk mendapatkan full_name
      const dbUser = await db
        .select({ fullName: users.fullName })
        .from(users)
        .where(eq(users.email, supabaseUser.email))
        .limit(1);

      if (dbUser.length > 0 && dbUser[0].fullName) {
        userFullName = dbUser[0].fullName;
      }
    }
  } catch (error) {
    // Abaikan error auth — user dianggap belum login
    console.error("Layout: gagal mengambil data user →", error);
  }

  return (
    <>
      <Navbar userFullName={userFullName} userEmail={userEmail} />
      {children}
      <Footer />
    </>
  );
}
