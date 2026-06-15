import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { trainers } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getSupabaseClient } from "@/lib/supabaseClient";

// Paksa route menjadi dinamis agar Next.js tidak mencoba men-generate
// halaman ini secara statis saat build (env vars belum tersedia di build time).
export const dynamic = "force-dynamic";

// Helper: Upload file ke Supabase Storage dan return public URL
async function uploadPhoto(file: File): Promise<string> {
  const supabase = getSupabaseClient();
  const uniqueFileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
  const filePath = `trainers/${uniqueFileName}`;

  const { data, error } = await supabase.storage
    .from("academy-events")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw new Error(`Gagal upload foto: ${error.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from("academy-events")
    .getPublicUrl(data.path);

  return publicUrlData.publicUrl;
}

// Helper: Extract form fields dari FormData
function extractFormFields(formData: FormData) {
  return {
    name: formData.get("name") as string,
    roleTitle: (formData.get("roleTitle") as string) || null,
    deskripsi: (formData.get("deskripsi") as string) || null,
    isActive: formData.get("isActive") === "true",
  };
}

export async function GET() {
  try {
    const data = await db.select().from(trainers).orderBy(desc(trainers.id));
    return NextResponse.json({ data });
  } catch (error) {
    console.error("GET /api/admin/trainers error:", error);
    return NextResponse.json(
      { error: "Gagal memuat data trainer." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const fields = extractFormFields(formData);

    // Handle photo upload
    let photoUrl: string | null = null;
    const photoFile = formData.get("photo") as File | null;

    if (photoFile && photoFile.size > 0) {
      photoUrl = await uploadPhoto(photoFile);
    }

    const [inserted] = await db
      .insert(trainers)
      .values({
        name: fields.name,
        roleTitle: fields.roleTitle,
        deskripsi: fields.deskripsi,
        photoUrl,
        isActive: fields.isActive,
      })
      .returning();

    return NextResponse.json({ data: inserted }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/trainers error:", error);
    const message =
      error instanceof Error ? error.message : "Gagal menambah trainer.";
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

    // Handle photo upload
    let photoUrl: string | null = null;
    const photoFile = formData.get("photo") as File | null;
    const existingPhotoUrl = formData.get("existingPhotoUrl") as string | null;

    if (photoFile && photoFile.size > 0) {
      // Upload file baru
      photoUrl = await uploadPhoto(photoFile);
    } else if (existingPhotoUrl) {
      // Pakai URL yang sudah ada (tidak ganti foto)
      photoUrl = existingPhotoUrl;
    }

    const [updated] = await db
      .update(trainers)
      .set({
        name: fields.name,
        roleTitle: fields.roleTitle,
        deskripsi: fields.deskripsi,
        photoUrl,
        isActive: fields.isActive,
        updatedAt: new Date(),
      })
      .where(eq(trainers.id, id))
      .returning();

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("PUT /api/admin/trainers error:", error);
    const message =
      error instanceof Error ? error.message : "Gagal mengubah trainer.";
    return NextResponse.json(
      { error: message },
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

    await db.delete(trainers).where(eq(trainers.id, Number(id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/trainers error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus trainer." },
      { status: 500 },
    );
  }
}
