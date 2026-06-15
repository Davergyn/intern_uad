// FILE INI DIGUNAKAN UNTUK LOGIC BACKEND/SERVER PAGE.TSX
// CATATAN: File ini HANYA boleh di-import oleh Server Components.
// Untuk formatting helpers (client-safe), gunakan ./formatters.ts
import { db } from "@/db";
import {
  events,
  programs,
  partnerships,
  trainers,
  eventTrainers,
  eventRegistrations,
  users,
} from "@/db/schema";
import { gte, lt, eq, and, count, countDistinct, desc, inArray } from "drizzle-orm";
import type { EventRow, ProgramRow } from "@/types/database";

// ============================================================================
// TYPES
// ============================================================================

export type TrainerMini = {
  id: number;
  name: string;
  roleTitle: string | null;
  photoUrl: string | null;
};

export type EventWithTrainers = EventRow & { trainers: TrainerMini[] };

// ============================================================================
// DATA FETCHING
// ============================================================================

/**
 * Tipe return dari fetchLandingPageData.
 * Mendeskripsikan seluruh data yang dibutuhkan oleh halaman landing.
 */
export type LandingPageData = {
  upcomingEvents: EventWithTrainers[];
  pastEvents: EventRow[];
  partners: Awaited<ReturnType<typeof fetchPartners>>;
  totalEvents: number;
  totalTrainers: number;
  totalActiveUsers: number;
  totalRegisteredUsers: number;
};

async function fetchPartners() {
  return db
    .select()
    .from(partnerships)
    .orderBy(desc(partnerships.id))
    .limit(20);
}

/**
 * Fungsi: fetchLandingPageData
 * Kegunaan: Mengambil semua data yang dibutuhkan halaman landing dari database.
 * Semua query dijalankan secara paralel menggunakan Promise.all untuk performa optimal.
 */
export async function fetchLandingPageData(): Promise<LandingPageData> {
  const today = new Date().toISOString().split("T")[0];

  const [
    upcomingEvents,
    pastEvents,
    partners,
    totalEventsResult,
    totalTrainersResult,
    totalUsersResult,
    totalRegisteredUsersResult,
  ] = await Promise.all([
    // Query: Mengambil maksimal 10 event yang akan datang dan sudah dipublikasi
    db
      .select()
      .from(events)
      .where(
        and(gte(events.eventDate, today as any), eq(events.isPublished, true)),
      )
      .limit(10),

    // Query: Mengambil maksimal 10 event yang sudah lewat
    db
      .select()
      .from(events)
      .where(
        and(lt(events.eventDate, today as any), eq(events.isPublished, true)),
      )
      .limit(10),

    // Query: Mengambil daftar partnership untuk ditampilkan di logo marquee
    fetchPartners(),

    // Query: Hitung total events yang dipublikasikan
    db
      .select({ count: count() })
      .from(events)
      .where(eq(events.isPublished, true)),

    // Query: Hitung total trainers yang aktif
    db
      .select({ count: count() })
      .from(trainers)
      .where(eq(trainers.isActive, true)),

    // Query: Hitung total users unik yang sudah mendaftar event
    db
      .select({ count: countDistinct(eventRegistrations.userId) })
      .from(eventRegistrations),

    // Query: Hitung total users yang terdaftar di platform
    db.select({ count: count() }).from(users),
  ]);

  // Setelah mendapat upcomingEvents, lakukan batch JOIN ke trainer
  const eventIds = upcomingEvents.map((e) => e.id);
  let upcomingEventsWithTrainers: EventWithTrainers[];

  if (eventIds.length === 0) {
    upcomingEventsWithTrainers = [];
  } else {
    const eventTrainerRows = await db
      .select()
      .from(eventTrainers)
      .where(inArray(eventTrainers.eventId, eventIds));

    const trainerIds = [...new Set(eventTrainerRows.map((et) => et.trainerId))];
    let trainerMap = new Map<number, TrainerMini>();

    if (trainerIds.length > 0) {
      const trainerRows = await db
        .select({
          id: trainers.id,
          name: trainers.name,
          roleTitle: trainers.roleTitle,
          photoUrl: trainers.photoUrl,
        })
        .from(trainers)
        .where(inArray(trainers.id, trainerIds));

      trainerMap = new Map(trainerRows.map((t) => [t.id, t]));
    }

    upcomingEventsWithTrainers = upcomingEvents.map((event) => ({
      ...event,
      trainers: eventTrainerRows
        .filter((et) => et.eventId === event.id)
        .map((et) => trainerMap.get(et.trainerId))
        .filter((t): t is TrainerMini => t !== undefined),
    }));
  }

  return {
    upcomingEvents: upcomingEventsWithTrainers,
    pastEvents,
    partners,
    totalEvents: totalEventsResult[0]?.count || 0,
    totalTrainers: totalTrainersResult[0]?.count || 0,
    totalActiveUsers: totalUsersResult[0]?.count || 0,
    totalRegisteredUsers: totalRegisteredUsersResult[0]?.count || 0,
  };
}
