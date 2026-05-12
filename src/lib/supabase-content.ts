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

export async function getActiveProgramBySlug(slug: string) {
  const { data, error } = await createServerSupabaseClient()
    .from("programs")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error(`Failed to fetch program ${slug}:`, error.message);
    return null;
  }

  return data as ProgramRow | null;
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
    // Supabase may return a schema cache error when the table doesn't exist in the
    // connected database. Log a friendly warning with guidance instead of an
    // alarming console.error to reduce developer confusion during dev.
    const msg = String(error.message || error);
    if (msg.includes("Could not find the table") || msg.includes("schema cache")) {
      console.warn(
        "Materials table not found in Supabase. Run the project's schema or create `public.materials` in your Supabase project. Returning empty list.",
      );
    } else {
      console.error("Failed to fetch materials:", msg);
    }

    return [];
  }

  return (data ?? []) as MaterialRow[];
}
