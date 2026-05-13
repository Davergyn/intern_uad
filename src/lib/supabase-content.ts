import { createServerSupabaseClient } from "@/utils/supabase/server";
import type { EventRow, MaterialRow, ProgramRow, TrainerRow } from "@/types/database";

export function getTodayDate() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  return `${year}-${month}-${day}`;
}

export async function getPublishedEvents(limit?: number) {
  const today = getTodayDate();
  let query = createServerSupabaseClient()
    .from("events")
    .select("*")
    .eq("is_published", true)
    .gte("event_date", today)
    .order("event_date", { ascending: true });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  if (error) {
    console.error("Failed to fetch published events:", error.message);
    return [];
  }

  return (data ?? []) as EventRow[];
}

export async function getUpcomingEvents() {
  const currentDate = getTodayDate();
  const { data, error } = await createServerSupabaseClient()
    .from("events")
    .select("*")
    .eq("is_published", true)
    .gte("event_date", currentDate)
    .order("event_date", { ascending: true });

  if (error) {
    console.error("Failed to fetch upcoming events:", error.message);
    return [];
  }

  return (data ?? []) as EventRow[];
}

export async function getPastEvents() {
  const currentDate = getTodayDate();
  const { data, error } = await createServerSupabaseClient()
    .from("events")
    .select("*")
    .eq("is_published", true)
    .lt("event_date", currentDate)
    .order("event_date", { ascending: false });

  if (error) {
    console.error("Failed to fetch past events:", error.message);
    return [];
  }

  return (data ?? []) as EventRow[];
}

// Fungsi ini disesuaikan: parameter 'slug' dipetakan untuk mencari di kolom 'kategori'
export async function getActiveProgramBySlug(category: string) {
  const { data, error } = await createServerSupabaseClient()
    .from("programs")
    .select("*")
    .eq("kategori", category) // Menggunakan kolom ENUM 'kategori'
    .eq("is_active", true)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error(`Failed to fetch program ${category}:`, error.message);
    return null;
  }

  return data as ProgramRow | null;
}

// Fungsi ini diperbaiki total untuk mengambil daftar slide foto per kategori
export async function getActiveProgramImagesBySlug(category: string) {
  const { data, error } = await createServerSupabaseClient()
    .from("programs")
    // Mengambil kolom yang TEPAT sesuai skema baru
    .select("id, title, kategori, image_url, is_active") 
    .eq("kategori", category) // Filter berdasarkan ENUM kategori
    .eq("is_active", true)
    .not("image_url", "is", null) // Validasi kolom gambar baru
    .order("id", { ascending: true });

  if (error) {
    console.error(`Failed to fetch program images for ${category}:`, error.message);
    return [];
  }

  return (data ?? []) as ProgramRow[];
}

export async function getActiveTrainers() {
  const { data, error } = await createServerSupabaseClient()
    .from("trainers")
    .select("*")
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error) {
    console.error("Failed to fetch trainers:", error.message);
    return [];
  }

  return (data ?? []) as TrainerRow[];
}

export async function getActiveMaterials() {
  const { data, error } = await createServerSupabaseClient()
    .from("materials")
    .select("*")
    .eq("is_active", true)
    .order("title", { ascending: true });

  if (error) {
    console.error("Failed to fetch materials:", error.message);
    return [];
  }

  return (data ?? []) as MaterialRow[];
}
