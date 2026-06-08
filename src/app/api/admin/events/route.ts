import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { events } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { supabase } from "@/lib/supabaseClient";

// Helper: Upload file ke Supabase Storage dan return public URL
async function uploadThumbnail(file: File): Promise<string> {
  const uniqueFileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
  const filePath = `events/${uniqueFileName}`;

  const { data, error } = await supabase.storage
    .from("academy-events")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw new Error(`Gagal upload gambar: ${error.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from("academy-events")
    .getPublicUrl(data.path);

  return publicUrlData.publicUrl;
}

// Helper: Extract form fields dari FormData
function extractFormFields(formData: FormData) {
  return {
    title: formData.get("title") as string,
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

export async function GET() {
  try {
    const data = await db.select().from(events).orderBy(desc(events.id));
    return NextResponse.json({ data });
  } catch (error) {
    console.error("GET /api/admin/events error:", error);
    return NextResponse.json(
      { error: "Gagal memuat data event." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const fields = extractFormFields(formData);

    // Handle thumbnail upload
    let thumbnailUrl: string | null = null;
    const thumbnailFile = formData.get("thumbnail") as File | null;

    if (thumbnailFile && thumbnailFile.size > 0) {
      thumbnailUrl = await uploadThumbnail(thumbnailFile);
    }

    const [inserted] = await db
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

    return NextResponse.json({ data: inserted }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/events error:", error);
    const message =
      error instanceof Error ? error.message : "Gagal menambah event.";
    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData();
    const id = Number(formData.get("id"));

    if (!id) {
      return NextResponse.json({ error: "ID wajib diisi." }, { status: 400 });
    }

    const fields = extractFormFields(formData);

    // Handle thumbnail upload
    let thumbnailUrl: string | null = null;
    const thumbnailFile = formData.get("thumbnail") as File | null;
    const existingThumbnailUrl = formData.get("existingThumbnailUrl") as string | null;

    if (thumbnailFile && thumbnailFile.size > 0) {
      // Upload file baru
      thumbnailUrl = await uploadThumbnail(thumbnailFile);
    } else if (existingThumbnailUrl) {
      // Pakai URL yang sudah ada (tidak ganti gambar)
      thumbnailUrl = existingThumbnailUrl;
    }

    const [updated] = await db
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

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("PUT /api/admin/events error:", error);
    return NextResponse.json(
      { error: "Gagal mengubah event." },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID wajib diisi." }, { status: 400 });
    }

    await db.delete(events).where(eq(events.id, Number(id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/events error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus event." },
      { status: 500 },
    );
  }
}
