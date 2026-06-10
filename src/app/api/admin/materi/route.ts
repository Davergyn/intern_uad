import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { materials } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { supabase } from "@/lib/supabaseClient";

// ============================================================================
// TYPES
// ============================================================================

/** Satu lampiran dalam array `attachments` yang disimpan di JSONB. */
interface Attachment {
  type: "url" | "pdf";
  name: string;
  url: string;
}

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Upload satu file ke Supabase Storage dan kembalikan public URL-nya.
 * Bucket : academy-events
 * Path   : materi/covers/[timestamp]-[name]  ← untuk cover image
 *          materi/documents/[timestamp]-[name] ← untuk PDF
 */
async function uploadFile(
  file: File,
  fileType: "cover" | "document",
): Promise<string> {
  const safeName = file.name.replace(/\s+/g, "-");
  const uniqueFileName = `${Date.now()}-${safeName}`;
  const folderPath =
    fileType === "cover" ? "materi/covers" : "materi/documents";
  const filePath = `${folderPath}/${uniqueFileName}`;

  const { data, error } = await supabase.storage
    .from("academy-events")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw new Error(
      `Gagal upload ${fileType === "cover" ? "cover" : "dokumen PDF"}: ${error.message}`,
    );
  }

  const { data: publicUrlData } = supabase.storage
    .from("academy-events")
    .getPublicUrl(data.path);

  return publicUrlData.publicUrl;
}

/**
 * Upload sekumpulan file PDF (dari formData.getAll) ke Storage
 * dan kembalikan array Attachment yang sudah terisi public URL.
 */
async function uploadPdfAttachments(
  pdfFiles: FormDataEntryValue[],
): Promise<Attachment[]> {
  const results: Attachment[] = [];

  for (const entry of pdfFiles) {
    // Pastikan entry adalah File yang valid dan tidak kosong
    if (!(entry instanceof File) || entry.size === 0) continue;

    const publicUrl = await uploadFile(entry, "document");
    results.push({
      type: "pdf",
      name: entry.name,
      url: publicUrl,
    });
  }

  return results;
}

/**
 * Parse JSON string dari field `attachments` FormData.
 * Jika gagal / kosong, kembalikan array kosong.
 */
function parseAttachmentsField(raw: FormDataEntryValue | null): Attachment[] {
  if (!raw || typeof raw !== "string" || raw.trim() === "") return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as Attachment[];
    return [];
  } catch {
    return [];
  }
}

// ============================================================================
// GET — Ambil semua data materi
// ============================================================================

export async function GET() {
  try {
    const data = await db
      .select()
      .from(materials)
      .orderBy(desc(materials.id));

    return NextResponse.json({ data });
  } catch (error) {
    console.error("GET /api/admin/materi error:", error);
    return NextResponse.json(
      { error: "Gagal memuat data materi." },
      { status: 500 },
    );
  }
}

// ============================================================================
// POST — Tambah materi baru (Multipack)
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // ── 1. Ekstrak field teks ──────────────────────────────────────────────
    const title = (formData.get("title") as string)?.trim();
    const description = (formData.get("description") as string) || null;
    const isActive = formData.get("isActive") === "true";

    if (!title) {
      return NextResponse.json(
        { error: "Judul materi wajib diisi." },
        { status: 400 },
      );
    }

    // ── 2. Parse daftar lampiran awal (URL / PDF lama dari frontend) ───────
    const attachments: Attachment[] = parseAttachmentsField(
      formData.get("attachments"),
    );

    // ── 3. Upload cover image (opsional) ──────────────────────────────────
    let coverUrl: string | null = null;
    const coverFile = formData.get("cover");

    if (coverFile instanceof File && coverFile.size > 0) {
      coverUrl = await uploadFile(coverFile, "cover");
    }

    // ── 4–6. Upload semua PDF baru, bentuk objek, gabungkan ke attachments ─
    const pdfFiles = formData.getAll("pdf_attachments");
    const newPdfAttachments = await uploadPdfAttachments(pdfFiles);
    attachments.push(...newPdfAttachments);

    // ── 7. Simpan ke database ─────────────────────────────────────────────
    const [inserted] = await db
      .insert(materials)
      .values({
        title,
        description,
        coverUrl,
        isActive,
        // Kolom lama (agar tidak null) — bisa dihapus jika schema sudah diperbarui
        materialType: "multipack",
        linkUrl: null,
        attachments, // JSONB: array of { type, name, url }
      })
      .returning();

    return NextResponse.json({ data: inserted }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/materi error:", error);
    const message =
      error instanceof Error ? error.message : "Gagal menambah materi.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ============================================================================
// PUT — Update materi (Multipack)
// ============================================================================

export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData();

    // ── 1. Ambil ID materi ────────────────────────────────────────────────
    const id = Number(formData.get("id"));

    if (!id || isNaN(id)) {
      return NextResponse.json(
        { error: "ID materi wajib disertakan." },
        { status: 400 },
      );
    }

    // ── 2. Ekstrak field teks ──────────────────────────────────────────────
    const title = (formData.get("title") as string)?.trim();
    const description = (formData.get("description") as string) || null;
    const isActive = formData.get("isActive") === "true";
    const existingCoverUrl =
      (formData.get("existingCoverUrl") as string) || null;

    if (!title) {
      return NextResponse.json(
        { error: "Judul materi wajib diisi." },
        { status: 400 },
      );
    }

    // ── 3. Proses cover ───────────────────────────────────────────────────
    //      • Ada file baru  → upload ke Storage, pakai URL baru
    //      • Tidak ada file → pakai existingCoverUrl (bisa null)
    let coverUrl: string | null = existingCoverUrl;
    const coverFile = formData.get("cover");

    if (coverFile instanceof File && coverFile.size > 0) {
      coverUrl = await uploadFile(coverFile, "cover");
    }

    // ── 4. Parse sisa lampiran lama yang dipertahankan frontend ───────────
    //      (URL eksternal yg masih ada + PDF Supabase yang tidak dihapus)
    const attachments: Attachment[] = parseAttachmentsField(
      formData.get("attachments"),
    );

    // ── 5–6. Upload PDF baru yang baru diantrekan, gabungkan ──────────────
    const pdfFiles = formData.getAll("pdf_attachments");
    const newPdfAttachments = await uploadPdfAttachments(pdfFiles);
    attachments.push(...newPdfAttachments);

    // ── 7. Update database ────────────────────────────────────────────────
    const [updated] = await db
      .update(materials)
      .set({
        title,
        description,
        coverUrl,
        isActive,
        materialType: "multipack",
        linkUrl: null,
        attachments, // Timpa penuh dengan array paling baru
        updatedAt: new Date(),
      })
      .where(eq(materials.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { error: "Materi tidak ditemukan." },
        { status: 404 },
      );
    }

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("PUT /api/admin/materi error:", error);
    const message =
      error instanceof Error ? error.message : "Gagal mengubah materi.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ============================================================================
// DELETE — Hapus materi berdasarkan ID
// ============================================================================

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
