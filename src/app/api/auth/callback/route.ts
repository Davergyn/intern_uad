import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    console.error("OAuth callback: tidak ada code di URL");
    return NextResponse.redirect(`${origin}/login?error=no_code`);
  }

  // Mengambil akses Cookie dari Next.js
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

  // Menggunakan createServerClient agar Supabase bisa membaca/menulis Cookie
  // Standar Next.js 15 + @supabase/ssr terbaru
  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set({ name, value, ...options });
          });
        } catch (error) {
        }
      },
    },
  });

  try {
    // 1. Tukar authorization code menjadi session (Sekarang pasti berhasil karena bisa baca cookie)
    const { data: sessionData, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);

    if (sessionError || !sessionData?.user) {
      console.error("OAuth callback: gagal menukar code →", sessionError?.message);
      return NextResponse.redirect(`${origin}/login?error=exchange_failed`);
    }

    const supabaseUser = sessionData.user;

    // 2. Ambil data dari profil Google (metadata Supabase)
    const email = supabaseUser.email;
    const fullName =
      supabaseUser.user_metadata?.full_name ||
      supabaseUser.user_metadata?.name ||
      null;
    const avatarUrl =
      supabaseUser.user_metadata?.avatar_url ||
      supabaseUser.user_metadata?.picture ||
      null;

    if (!email) {
      console.error("OAuth callback: email tidak ditemukan di profil Google");
      return NextResponse.redirect(`${origin}/login?error=no_email`);
    }

    // 3. Cek apakah user sudah ada di tabel Drizzle `users`
    const existingUsers = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    // 4. Jika belum ada, insert user baru
    if (existingUsers.length === 0) {
      await db.insert(users).values({
        fullName: fullName,
        email: email,
        passwordHash: "OAUTH_GOOGLE_NO_PASSWORD",
        isActive: true,
        avatarUrl: avatarUrl,
      });

      console.log(`User baru terdaftar via Google OAuth: ${email}`);
    } else {
      console.log(`User sudah ada, masuk: ${email}`);
    }

    // 5. Redirect ke halaman utama
    return NextResponse.redirect(`${origin}/`);
  } catch (error) {
    console.error("OAuth callback: error tidak terduga →", error);
    return NextResponse.redirect(`${origin}/login?error=unexpected`);
  }
}