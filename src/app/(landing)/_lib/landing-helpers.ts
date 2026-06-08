// FILE INI DIGUNAKAN UNTUK LOGIC BACKEND/SERVER PAGE.TSX
// CATATAN: File ini HANYA boleh di-import oleh Server Components.
// Untuk formatting helpers (client-safe), gunakan ./formatters.ts
import { db } from "@/db";
import {
  events,
  programs,
  partnerships,
  trainers,
  eventRegistrations,
  users,
} from "@/db/schema";
import { gte, lt, eq, and, count, countDistinct, desc } from "drizzle-orm";
import type { EventRow, ProgramRow } from "@/types/database";

// ============================================================================
// DATA FETCHING
// ============================================================================

/**
 * Tipe return dari fetchLandingPageData.
 * Mendeskripsikan seluruh data yang dibutuhkan oleh halaman landing.
 */
export type LandingPageData = {
  upcomingEvents: EventRow[];
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

  return {
    upcomingEvents,
    pastEvents,
    partners,
    totalEvents: totalEventsResult[0]?.count || 0,
    totalTrainers: totalTrainersResult[0]?.count || 0,
    totalActiveUsers: totalUsersResult[0]?.count || 0,
    totalRegisteredUsers: totalRegisteredUsersResult[0]?.count || 0,
  };
}
