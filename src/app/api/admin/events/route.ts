import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { events, eventTrainers, trainers } from "@/db/schema";
import { eq, desc, inArray } from "drizzle-orm";
import { supabase } from "@/lib/supabaseClient";

// Paksa route menjadi dinamis — mencegah Next.js men-cache respons GET
export const dynamic = "force-dynamic";

// ============================================================================
// TYPES
// ============================================================================

type TrainerMini = {
  id: number;
  name: string;
  roleTitle: string | null;
  photoUrl: string | null;
};

// ============================================================================
// HELPERS
// ============================================================================

/** Upload thumbnail ke Supabase Storage, kembalikan public URL. */
async function uploadThumbnail(file: File): Promise<string> {
  const uniqueFileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
  const filePath = `events/${uniqueFileName}`;

  const { data, error } = await supabase.storage
    .from("academy-events")
    .upload(filePath, file, { cacheControl: "3600", upsert: false });

  if (error) {
    throw new Error(`Gagal upload gambar: ${error.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from("academy-events")
    .getPublicUrl(data.path);

  return publicUrlData.publicUrl;
}

/** Ekstrak field teks standar dari FormData. */
function extractFormFields(formData: FormData) {
  return {
    title: (formData.get("title") as string)?.trim() ?? "",
    description: (formData.get("description") as string) || null,
    eventType: formData.get("eventType") as string,
    deliveryMode: formData.get("deliveryMode") as string,
    eventDate: formData.get("eventDate") as string,
    startTime: (formData.get("startTime") as string) || null,
    endTime: (formData.get("endTime") as string) || null,
    quota: Number(formData.get("quota") ?? 0),
    price: (formData.get("price") as string) ?? "0",
    isPublished: formData.get("isPublished") === "true",
  };
}

/**
 * Parse trainerIds dari FormData secara aman.
 * Frontend mengirim array integer yang di-encode sebagai JSON.stringify([1,2,3]).
 */
function parseTrainerIds(formData: FormData): number[] {
  try {
    const raw = formData.get("trainerIds");
    if (!raw || typeof raw !== "string") return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((v) => Number(v))
      .filter((id) => !isNaN(id) && id > 0);
  } catch {
    return [];
  }
}

// ============================================================================
// GET — Ambil semua event beserta data trainer yang tergabung (JOIN)
// ============================================================================

export async function GET() {
  try {
    // 1. Ambil semua event
    const eventsData = await db
      .select()
      .from(events)
      .orderBy(desc(events.id));

    if (eventsData.length === 0) {
      return NextResponse.json({ data: [] });
    }

    // 2. Ambil semua eventId yang ada
    const eventIds = eventsData.map((e) => e.id);

    // 3. Fetch semua baris eventTrainers untuk event-event di atas sekaligus
    const eventTrainerRows = await db
      .select()
      .from(eventTrainers)
      .where(inArray(eventTrainers.eventId, eventIds));

    // 4. Jika ada relasi trainer, fetch data trainer-nya
    const trainerIds = [
      ...new Set(eventTrainerRows.map((et) => et.trainerId)),
    ];

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

    // 5. Gabungkan: map setiap event dengan array trainers yang sesuai
    const result = eventsData.map((event) => {
      const relatedTrainers = eventTrainerRows
        .filter((et) => et.eventId === event.id)
        .map((et) => trainerMap.get(et.trainerId))
        .filter((t): t is TrainerMini => t !== undefined);

      return { ...event, trainers: relatedTrainers };
    });

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("GET /api/admin/events error:", error);
    return NextResponse.json(
      { error: "Gagal memuat data event." },
      { status: 500 },
    );
  }
}

// ============================================================================
// POST — Tambah event baru (atomik via db.transaction)
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const fields = extractFormFields(formData);

    if (!fields.title) {
      return NextResponse.json(
        { error: "Judul event wajib diisi." },
        { status: 400 },
      );
    }

    if (!fields.eventDate) {
      return NextResponse.json(
        { error: "Tanggal event wajib diisi." },
        { status: 400 },
      );
    }

    // Upload thumbnail di luar transaksi (I/O eksternal tidak bisa di-rollback oleh DB)
    let thumbnailUrl: string | null = null;
    const thumbnailFile = formData.get("thumbnail");
    if (thumbnailFile instanceof File && thumbnailFile.size > 0) {
      thumbnailUrl = await uploadThumbnail(thumbnailFile);
    }

    const trainerIds = parseTrainerIds(formData);

    // Jalankan INSERT event + INSERT eventTrainers secara atomik
    const inserted = await db.transaction(async (tx) => {
      // 1. Insert event utama
      const [newEvent] = await tx
        .insert(events)
        .values({
          title: fields.title,
          description: fields.description,
          eventType: fields.eventType as "webinar" | "workshop" | "seminar" | "training",
          deliveryMode: fields.deliveryMode as "online" | "face_to_face" | "hybrid",
          eventDate: fields.eventDate,
          startTime: fields.startTime,
          endTime: fields.endTime,
          quota: fields.quota,
          price: fields.price,
          thumbnailUrl,
          isPublished: fields.isPublished,
        })
        .returning();

      // 2. Insert relasi trainer (bulk) jika ada
      if (trainerIds.length > 0) {
        await tx.insert(eventTrainers).values(
          trainerIds.map((trainerId) => ({
            eventId: newEvent.id,
            trainerId,
          })),
        );
      }

      return newEvent;
    });

    console.log(
      `[POST] Event ID ${inserted.id} berhasil dibuat dengan ${trainerIds.length} trainer.`,
    );

    return NextResponse.json({ data: inserted }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/events error:", error);
    const message =
      error instanceof Error ? error.message : "Gagal menambah event.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ============================================================================
// PUT — Update event (atomik via db.transaction + pola Delete-then-Insert)
// ============================================================================

export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData();
    const rawId = formData.get("id");
    const id = Number(rawId);

    if (!rawId || isNaN(id) || id <= 0) {
      return NextResponse.json(
        { error: "ID event tidak valid atau tidak disertakan." },
        { status: 400 },
      );
    }

    const fields = extractFormFields(formData);

    if (!fields.title) {
      return NextResponse.json(
        { error: "Judul event wajib diisi." },
        { status: 400 },
      );
    }

    // Proses thumbnail: ada file baru → upload, tidak ada → pertahankan URL lama
    let thumbnailUrl: string | null = null;
    const thumbnailFile = formData.get("thumbnail");
    const existingThumbnailUrl = formData.get("existingThumbnailUrl") as string | null;

    if (thumbnailFile instanceof File && thumbnailFile.size > 0) {
      thumbnailUrl = await uploadThumbnail(thumbnailFile);
    } else if (existingThumbnailUrl) {
      thumbnailUrl = existingThumbnailUrl;
    }

    const trainerIds = parseTrainerIds(formData);

    // Jalankan UPDATE event + sinkronisasi eventTrainers secara atomik
    const updated = await db.transaction(async (tx) => {
      // 1. Update event utama
      const [updatedEvent] = await tx
        .update(events)
        .set({
          title: fields.title,
          description: fields.description,
          eventType: fields.eventType as "webinar" | "workshop" | "seminar" | "training",
          deliveryMode: fields.deliveryMode as "online" | "face_to_face" | "hybrid",
          eventDate: fields.eventDate,
          startTime: fields.startTime,
          endTime: fields.endTime,
          quota: fields.quota,
          price: fields.price,
          thumbnailUrl,
          isPublished: fields.isPublished,
          updatedAt: new Date(),
        })
        .where(eq(events.id, id))
        .returning();

      if (!updatedEvent) {
        throw new Error(`Event dengan ID ${id} tidak ditemukan.`);
      }

      // 2. Pola Delete-then-Insert untuk relasi trainer
      //    Hapus SEMUA baris eventTrainers lama untuk event ini terlebih dahulu
      await tx.delete(eventTrainers).where(eq(eventTrainers.eventId, id));

      // 3. Insert ulang dengan daftar trainerIds terbaru
      if (trainerIds.length > 0) {
        await tx.insert(eventTrainers).values(
          trainerIds.map((trainerId) => ({
            eventId: id,
            trainerId,
          })),
        );
      }

      console.log(
        `[PUT] Event ID ${id} diperbarui. Trainer disinkronkan: [${trainerIds.join(", ")}]`,
      );

      return updatedEvent;
    });

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("PUT /api/admin/events error:", error);
    const message =
      error instanceof Error ? error.message : "Gagal mengubah event.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ============================================================================
// DELETE — Hapus event (eventTrainers ikut terhapus via onDelete: cascade)
// ============================================================================

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rawId = searchParams.get("id");

    if (!rawId || rawId.trim() === "") {
      return NextResponse.json(
        { error: "Parameter 'id' wajib disertakan pada query string." },
        { status: 400 },
      );
    }

    const id = Number(rawId);

    if (isNaN(id) || id <= 0) {
      return NextResponse.json(
        { error: `Nilai 'id' tidak valid: "${rawId}". Harus berupa angka bulat positif.` },
        { status: 400 },
      );
    }

    // eventTrainers akan ikut terhapus otomatis via onDelete: 'cascade' di schema
    await db.delete(events).where(eq(events.id, id));

    console.log(`[DELETE] Event ID ${id} berhasil dihapus (cascade ke eventTrainers).`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/events error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus event. Silakan coba lagi." },
      { status: 500 },
    );
  }
}
