import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { programs } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getSupabaseClient } from "@/lib/supabaseClient";

// Paksa route menjadi dinamis agar Next.js tidak mencoba men-generate
// halaman ini secara statis saat build (env vars belum tersedia di build time).
export const dynamic = "force-dynamic";

// Helper: Upload file ke Supabase Storage dan return public URL
async function uploadImage(file: File): Promise<string> {
  const supabase = getSupabaseClient();
  const uniqueFileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
  const filePath = `programs/${uniqueFileName}`;

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
    kategori: formData.get("kategori") as string,
    title: formData.get("title") as string,
    description: (formData.get("description") as string) || null,
    isActive: formData.get("isActive") === "true",
  };
}

export async function GET() {
  try {
    const data = await db.select().from(programs).orderBy(desc(programs.id));
    return NextResponse.json({ data });
  } catch (error) {
    console.error("GET /api/admin/programs error:", error);
    return NextResponse.json(
      { error: "Gagal memuat data program." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const fields = extractFormFields(formData);

    // Handle image upload
    let imageUrl: string | null = null;
    const imageFile = formData.get("image") as File | null;

    if (imageFile && imageFile.size > 0) {
      imageUrl = await uploadImage(imageFile);
    }

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Gambar program wajib diupload." },
        { status: 400 },
      );
    }

    const [inserted] = await db
      .insert(programs)
      .values({
        kategori: fields.kategori as "training-of-trainer" | "seminar" | "workshop",
        title: fields.title,
        imageUrl,
        description: fields.description,
        isActive: fields.isActive,
      })
      .returning();

    return NextResponse.json({ data: inserted }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/programs error:", error);
    const message =
      error instanceof Error ? error.message : "Gagal menambah program.";
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

    // Handle image upload
    let imageUrl: string | null = null;
    const imageFile = formData.get("image") as File | null;
    const existingImageUrl = formData.get("existingImageUrl") as string | null;

    if (imageFile && imageFile.size > 0) {
      // Upload file baru
      imageUrl = await uploadImage(imageFile);
    } else if (existingImageUrl) {
      // Pakai URL yang sudah ada (tidak ganti gambar)
      imageUrl = existingImageUrl;
    }

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Gambar program wajib diupload." },
        { status: 400 },
      );
    }

    const [updated] = await db
      .update(programs)
      .set({
        kategori: fields.kategori as "training-of-trainer" | "seminar" | "workshop",
        title: fields.title,
        imageUrl,
        description: fields.description,
        isActive: fields.isActive,
        updatedAt: new Date(),
      })
      .where(eq(programs.id, id))
      .returning();

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("PUT /api/admin/programs error:", error);
    const message =
      error instanceof Error ? error.message : "Gagal mengubah program.";
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

    await db.delete(programs).where(eq(programs.id, Number(id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/programs error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus program." },
      { status: 500 },
    );
  }
}
