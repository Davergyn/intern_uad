// File: src/lib/supabaseClient.ts
// Menggunakan @supabase/ssr agar PKCE code verifier disimpan di cookies,
// bukan di localStorage. Ini memastikan server-side callback route
// dapat membaca verifier saat menukar authorization code menjadi session.
import { createBrowserClient } from "@supabase/ssr";

// Mengambil URL dan Key dari .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

// Mengekspor instance supabase browser client
// createBrowserClient secara otomatis menyimpan auth state di cookies
export const supabase = createBrowserClient(supabaseUrl, supabaseKey);
