// File: src/lib/supabaseClient.ts
// Menggunakan @supabase/ssr agar PKCE code verifier disimpan di cookies,
// bukan di localStorage. Ini memastikan server-side callback route
// dapat membaca verifier saat menukar authorization code menjadi session.
import { createBrowserClient } from "@supabase/ssr";

// Mengekspor factory function sehingga client hanya dibuat saat dipanggil
// (bukan saat modul di-import), agar env vars tersedia di runtime.
export function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";
  return createBrowserClient(supabaseUrl, supabaseKey);
}


