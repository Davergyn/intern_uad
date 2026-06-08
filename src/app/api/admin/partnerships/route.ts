import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { partnerships } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { supabase } from "@/lib/supabaseClient";

// Helper: Upload file ke Supabase Storage dan return public URL
async function uploadLogo(file: File): Promise<string> {
  const uniqueFileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
  const filePath = `partnerships/${uniqueFileName}`;

  const { data, error } = await supabase.storage
    .from("academy-events")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw new Error(`Gagal upload logo: ${error.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from("academy-events")
    .getPublicUrl(data.path);

  return publicUrlData.publicUrl;
}

export async function GET() {
  try {
    const data = await db.select().from(partnerships).orderBy(desc(partnerships.id));
    return NextResponse.json({ data });
  } catch (error) {
    console.error("GET /api/admin/partnerships error:", error);
    return NextResponse.json(
      { error: "Gagal memuat data partnership." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const name = (formData.get("name") as string)?.trim();

    if (!name) {
      return NextResponse.json(
        { error: "Nama partner wajib diisi." },
        { status: 400 },
      );
    }

    // Handle logo upload
    let logoUrl: string | null = null;
    const logoFile = formData.get("logo") as File | null;

    if (logoFile && logoFile.size > 0) {
      logoUrl = await uploadLogo(logoFile);
    }

    if (!logoUrl) {
      return NextResponse.json(
        { error: "Logo partner wajib diupload." },
        { status: 400 },
      );
    }

    const [inserted] = await db
      .insert(partnerships)
      .values({
        name,
        logoUrl,
      })
      .returning();

    return NextResponse.json({ data: inserted }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/partnerships error:", error);
    const message =
      error instanceof Error ? error.message : "Gagal menambah partnership.";
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

    const name = (formData.get("name") as string)?.trim();

    if (!name) {
      return NextResponse.json(
        { error: "Nama partner wajib diisi." },
        { status: 400 },
      );
    }

    // Handle logo upload
    let logoUrl: string | null = null;
    const logoFile = formData.get("logo") as File | null;
    const existingLogoUrl = formData.get("existingLogoUrl") as string | null;

    if (logoFile && logoFile.size > 0) {
      // Upload file baru
      logoUrl = await uploadLogo(logoFile);
    } else if (existingLogoUrl) {
      // Pakai URL yang sudah ada (tidak ganti logo)
      logoUrl = existingLogoUrl;
    }

    if (!logoUrl) {
      return NextResponse.json(
        { error: "Logo partner wajib diupload." },
        { status: 400 },
      );
    }

    const [updated] = await db
      .update(partnerships)
      .set({
        name,
        logoUrl,
        updatedAt: new Date(),
      })
      .where(eq(partnerships.id, id))
      .returning();

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("PUT /api/admin/partnerships error:", error);
    const message =
      error instanceof Error ? error.message : "Gagal mengubah partnership.";
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

    await db.delete(partnerships).where(eq(partnerships.id, Number(id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/partnerships error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus partnership." },
      { status: 500 },
    );
  }
}
