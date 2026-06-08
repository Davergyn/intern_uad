import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { materials } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { supabase } from "@/lib/supabaseClient";

// Helper: Upload file ke Supabase Storage dan return public URL
async function uploadCover(file: File): Promise<string> {
  const uniqueFileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
  const filePath = `materi/${uniqueFileName}`;

  const { data, error } = await supabase.storage
    .from("academy-events")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw new Error(`Gagal upload cover: ${error.message}`);
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
    linkUrl: (formData.get("linkUrl") as string) || null,
    isActive: formData.get("isActive") === "true",
  };
}

export async function GET() {
  try {
    const data = await db.select().from(materials).orderBy(desc(materials.id));
    return NextResponse.json({ data });
  } catch (error) {
    console.error("GET /api/admin/materi error:", error);
    return NextResponse.json(
      { error: "Gagal memuat data materi." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const fields = extractFormFields(formData);

    // Handle cover upload
    let coverUrl: string | null = null;
    const coverFile = formData.get("cover") as File | null;

    if (coverFile && coverFile.size > 0) {
      coverUrl = await uploadCover(coverFile);
    }

    const [inserted] = await db
      .insert(materials)
      .values({
        title: fields.title,
        description: fields.description,
        linkUrl: fields.linkUrl,
        coverUrl,
        isActive: fields.isActive,
      })
      .returning();

    return NextResponse.json({ data: inserted }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/materi error:", error);
    const message =
      error instanceof Error ? error.message : "Gagal menambah materi.";
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

    // Handle cover upload
    let coverUrl: string | null = null;
    const coverFile = formData.get("cover") as File | null;
    const existingCoverUrl = formData.get("existingCoverUrl") as string | null;

    if (coverFile && coverFile.size > 0) {
      // Upload file baru
      coverUrl = await uploadCover(coverFile);
    } else if (existingCoverUrl) {
      // Pakai URL yang sudah ada (tidak ganti cover)
      coverUrl = existingCoverUrl;
    }

    const [updated] = await db
      .update(materials)
      .set({
        title: fields.title,
        description: fields.description,
        linkUrl: fields.linkUrl,
        coverUrl,
        isActive: fields.isActive,
        updatedAt: new Date(),
      })
      .where(eq(materials.id, id))
      .returning();

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("PUT /api/admin/materi error:", error);
    const message =
      error instanceof Error ? error.message : "Gagal mengubah materi.";
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

    await db.delete(materials).where(eq(materials.id, Number(id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/materi error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus materi." },
      { status: 500 },
    );
  }
}
