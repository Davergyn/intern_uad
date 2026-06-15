import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { materials, materialLinks } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { supabase } from "@/lib/supabaseClient";

// Paksa route menjadi dinamis — mencegah Next.js men-cache respons GET
// sehingga setiap request selalu menarik data segar dari PostgreSQL.
export const dynamic = "force-dynamic";

// ============================================================================
// TYPES
// ============================================================================

/** Representasi satu lampiran (baik tipe 'url' maupun 'pdf'). */
interface Attachment {
  type: "link" | "pdf";
  name: string;
  url: string;
}

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Upload satu file ke Supabase Storage dan kembalikan public URL-nya.
 * Bucket : academy-events
 * Path   : materi/covers/[timestamp]-[name]    ← untuk cover image
 *          materi/documents/[timestamp]-[name]  ← untuk file PDF
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
 * Upload sekumpulan file PDF dari FormData ke Supabase Storage.
 * Kembalikan array Attachment bertipe 'pdf' yang sudah terisi public URL.
 */
async function uploadPdfAttachments(
  pdfFiles: FormDataEntryValue[],
): Promise<Attachment[]> {
  const results: Attachment[] = [];

  for (const entry of pdfFiles) {
    if (!(entry instanceof File) || entry.size === 0) continue;

    const publicUrl = await uploadFile(entry, "document");
    results.push({
      type: "pdf" as const,
      name: entry.name,
      url: publicUrl,
    });
  }

  return results;
}

/**
 * Parse JSON string dari field `attachments` di FormData secara aman.
 * Jika parsing gagal atau bukan array, kembalikan array kosong.
 */
function parseAttachmentsField(raw: FormDataEntryValue | null): Attachment[] {
  if (raw === null || raw === undefined) return [];

  // Guard: FormData bisa mengembalikan File jika nama field salah
  if (raw instanceof File) {
    console.warn(
      "[parseAttachmentsField] Diterima File bukan string untuk field 'attachments'. Kembalikan [].",
    );
    return [];
  }

  const rawStr = raw as string;
  if (rawStr.trim() === "") return [];

  try {
    const parsed = JSON.parse(rawStr);
    if (!Array.isArray(parsed)) {
      console.warn(
        "[parseAttachmentsField] Hasil parse bukan array:",
        typeof parsed,
      );
      return [];
    }

    // Validasi setiap item — pastikan memiliki field wajib type, name, url
    const valid = parsed.filter(
      (item: unknown) =>
        item !== null &&
        typeof item === "object" &&
        "type" in (item as object) &&
        "name" in (item as object) &&
        "url" in (item as object),
    ) as Attachment[];

    console.log(
      `[parseAttachmentsField] Berhasil parse ${valid.length} lampiran dari JSON string.`,
    );
    return valid;
  } catch (err) {
    console.error(
      "[parseAttachmentsField] Gagal parse JSON string:",
      rawStr.substring(0, 120),
      err,
    );
    return [];
  }
}

/**
 * Ekstrak relative path dari full Supabase Storage URL untuk keperluan
 * penghapusan file. Supabase Storage `.remove()` membutuhkan relative path
 * (path setelah nama bucket), bukan full public URL.
 *
 * Strategi (berlapis / anti-gagal):
 *  1. Split berdasarkan "academy-events/" → ambil bagian kedua → decode URI.
 *  2. Fallback: parse URL dengan `new URL()` → ambil pathname → potong setelah "/public/".
 *
 * Contoh:
 *   Input : "https://xxx.supabase.co/storage/v1/object/public/academy-events/materi/covers/foto%20cover.jpg"
 *   Output: "materi/covers/foto cover.jpg"
 */
function extractStoragePath(fullUrl: string | null | undefined): string | null {
  if (!fullUrl || typeof fullUrl !== "string") return null;

  // ── Strategi 1: Split pada kata kunci bucket "academy-events/" ────────────
  const splitMarker = "academy-events/";
  const splitIndex = fullUrl.indexOf(splitMarker);

  if (splitIndex !== -1) {
    const rawPath = fullUrl.slice(splitIndex + splitMarker.length);
    if (rawPath) {
      try {
        // Decode %20 dan karakter URL-encoded lainnya kembali ke string asli
        const decodedPath = decodeURIComponent(rawPath);
        console.log(
          `[extractStoragePath] Strategi 1 berhasil: "${decodedPath}"`,
        );
        return decodedPath;
      } catch {
        // Jika decode gagal (string tidak valid), gunakan raw path tanpa decode
        console.warn(
          `[extractStoragePath] decodeURIComponent gagal, pakai raw path: "${rawPath}"`,
        );
        return rawPath;
      }
    }
  }

  // ── Strategi 2 (Fallback): Parse pathname dengan new URL() ────────────────
  // Ambil pathname dari URL, lalu potong segmen setelah "/public/"
  try {
    const urlObj = new URL(fullUrl);
    const pathname = urlObj.pathname; // contoh: /storage/v1/object/public/academy-events/materi/covers/file.jpg

    const publicMarker = "/public/";
    const publicIndex = pathname.indexOf(publicMarker);

    if (publicIndex !== -1) {
      // Potong segmen bucket + path: "academy-events/materi/covers/file.jpg"
      const afterPublic = pathname.slice(publicIndex + publicMarker.length);

      // Hapus awalan "academy-events/" jika ada (bagian nama bucket)
      const bucketPrefix = "academy-events/";
      const finalPath = afterPublic.startsWith(bucketPrefix)
        ? afterPublic.slice(bucketPrefix.length)
        : afterPublic;

      if (finalPath) {
        const decodedFinalPath = decodeURIComponent(finalPath);
        console.log(
          `[extractStoragePath] Strategi 2 (fallback) berhasil: "${decodedFinalPath}"`,
        );
        return decodedFinalPath;
      }
    }
  } catch (err) {
    console.error(
      `[extractStoragePath] Kedua strategi gagal untuk URL: "${fullUrl}"`,
      err,
    );
  }

  console.warn(
    `[extractStoragePath] Tidak dapat mengekstrak path dari URL: "${fullUrl}"`,
  );
  return null;
}

// ============================================================================
// GET — Ambil semua materi beserta lampiran dari tabel materialLinks
// ============================================================================

export async function GET() {
  try {
    const materialsData = await db
      .select()
      .from(materials)
      .orderBy(desc(materials.id));

    // Join lampiran dari tabel materialLinks untuk setiap materi
    const result = await Promise.all(
      materialsData.map(async (material) => {
        const links = await db
          .select()
          .from(materialLinks)
          .where(eq(materialLinks.materialId, material.id));

        return { ...material, links };
      }),
    );

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("GET /api/admin/materi error:", error);
    return NextResponse.json(
      { error: "Gagal memuat data materi." },
      { status: 500 },
    );
  }
}

// ============================================================================
// POST — Tambah materi baru
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // ── 1. Ekstrak field teks umum ─────────────────────────────────────────
    const title = (formData.get("title") as string)?.trim();
    const description = (formData.get("description") as string) || null;
    const isActive = formData.get("isActive") === "true";

    if (!title) {
      return NextResponse.json(
        { error: "Judul materi wajib diisi." },
        { status: 400 },
      );
    }

    // ── 2. Upload cover image ke Supabase Storage (opsional) ───────────────
    let coverUrl: string | null = null;
    const coverFile = formData.get("cover");

    if (coverFile instanceof File && coverFile.size > 0) {
      coverUrl = await uploadFile(coverFile, "cover");
    }

    // ── 3. INSERT pertama ke tabel materials, ambil id baru via .returning()
    const [inserted] = await db
      .insert(materials)
      .values({
        title,
        description,
        coverUrl,
        isActive,
        // Kolom legacy dipertahankan selama masa transisi
        materialType: "multipack",
        linkUrl: null,
        attachments: null,
      })
      .returning();

    const newMaterialId = inserted.id;

    // ── 4. Parse lampiran bertipe URL luar dari frontend ───────────────────
    // Array ini berisi objek { type: 'url', name, url } yang diinput manual.
    const rawAttachments = formData.get("attachments");
    const existingLinks: Attachment[] = rawAttachments
      ? parseAttachmentsField(rawAttachments)
      : [];

    console.log(
      `[POST] existingLinks (URL luar) diterima: ${existingLinks.length} item`,
    );

    // ── 5. Upload semua file PDF baru ke Supabase Storage ──────────────────
    const pdfFiles = formData.getAll("pdf_attachments");
    const newPdfAttachments: Attachment[] = await uploadPdfAttachments(pdfFiles);

    console.log(
      `[POST] newPdfAttachments (PDF terupload): ${newPdfAttachments.length} item`,
    );

    // ── 6. Gabungkan semua lampiran: URL luar + PDF terupload ──────────────
    const allAttachmentsToSave: Attachment[] = [
      ...existingLinks,
      ...newPdfAttachments,
    ];

    console.log(
      `[POST] allAttachmentsToSave (gabungan): ${allAttachmentsToSave.length} item`,
      allAttachmentsToSave.map((a) => `[${a.type}] ${a.name}`),
    );

    // ── 7. Bulk INSERT ke tabel materialLinks ──────────────────────────────
    if (allAttachmentsToSave.length > 0) {
      await db.insert(materialLinks).values(
        allAttachmentsToSave.map((att) => ({
          materialId: newMaterialId,
          type: att.type,
          name: att.name,
          url: att.url,
        })),
      );
    }

    // Ambil ulang data lengkap dengan lampiran untuk response
    const links = await db
      .select()
      .from(materialLinks)
      .where(eq(materialLinks.materialId, newMaterialId));

    return NextResponse.json(
      { data: { ...inserted, links } },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/admin/materi error:", error);
    const message =
      error instanceof Error ? error.message : "Gagal menambah materi.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ============================================================================
// PUT — Update materi + sinkronisasi Storage untuk PDF yang dihapus
// ============================================================================

export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData();

    // ── 1. Ambil dan validasi ID materi dari FormData ──────────────────────
    const rawId = formData.get("id");
    const id = Number(rawId);

    if (!rawId || isNaN(id) || id <= 0) {
      return NextResponse.json(
        { error: "ID materi tidak valid atau tidak disertakan." },
        { status: 400 },
      );
    }

    // ── 2. Ekstrak field teks yang akan diperbarui ─────────────────────────
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

    // ── 3. Proses cover image ──────────────────────────────────────────────
    //      • Ada file baru  → upload, gunakan URL baru
    //      • Tidak ada file → pertahankan existingCoverUrl (bisa null)
    let coverUrl: string | null = existingCoverUrl;
    const coverFile = formData.get("cover");

    if (coverFile instanceof File && coverFile.size > 0) {
      coverUrl = await uploadFile(coverFile, "cover");
    }

    // ── 4. UPDATE tabel materials ──────────────────────────────────────────
    const [updated] = await db
      .update(materials)
      .set({
        title,
        description,
        coverUrl,
        isActive,
        updatedAt: new Date(),
      })
      .where(eq(materials.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { error: `Materi dengan ID ${id} tidak ditemukan.` },
        { status: 404 },
      );
    }

    // ── 5. Ambil semua lampiran PDF LAMA yang ada di database ──────────────
    // Snapshot kondisi DB sebelum operasi PUT ini dijalankan.
    const oldLinks = await db
      .select()
      .from(materialLinks)
      .where(eq(materialLinks.materialId, id));

    const oldPdfLinks = oldLinks.filter((link) => link.type === "pdf");

    console.log(
      `[PUT] Snapshot DB lama — total lampiran: ${oldLinks.length}, PDF: ${oldPdfLinks.length}`,
    );

    // ── 6. Parse array lampiran terbaru yang dikirim Frontend ──────────────
    // Berisi: URL eksternal + PDF Supabase lama yang DIPERTAHANKAN user.
    // PDF yang diklik hapus (X) oleh user TIDAK akan ada di sini.
    const rawAttachments = formData.get("attachments");
    const existingLinks: Attachment[] = rawAttachments
      ? parseAttachmentsField(rawAttachments)
      : [];

    console.log(
      `[PUT] existingLinks (lampiran dipertahankan): ${existingLinks.length} item`,
    );

    // ── 7. Identifikasi file PDF yang DIHAPUS oleh user ───────────────────
    // Logika: PDF lama (DB) yang URL-nya tidak ada lagi di existingLinks
    // berarti user telah mengklik tombol hapus (X) pada item tersebut.
    const keptPdfUrls = new Set(
      existingLinks.filter((a: Attachment) => a.type === "pdf").map((a: Attachment) => a.url),
    );

    const deletedPdfLinks = oldPdfLinks.filter(
      (oldLink) => !keptPdfUrls.has(oldLink.url),
    );

    console.log(
      `[PUT] deletedPdfLinks (akan dihapus dari Storage): ${deletedPdfLinks.length} item`,
      deletedPdfLinks.map((l) => l.url),
    );

    // ── 8. Hapus fisik file PDF yang dibuang dari Supabase Storage ─────────
    // Gunakan extractStoragePath (berlapis) untuk mendapatkan relative path.
    if (deletedPdfLinks.length > 0) {
      const pathsToDelete: string[] = deletedPdfLinks
        .map((link) => extractStoragePath(link.url))
        .filter((path): path is string => path !== null);

      if (pathsToDelete.length > 0) {
        console.log(
          "[STORAGE_DEBUG] Daftar file yang akan dikirim ke .remove():",
          pathsToDelete,
        );

        const { data: storageData, error: storageError } =
          await supabase.storage.from("academy-events").remove(pathsToDelete);

        if (storageError) {
          console.error(
            "[STORAGE_ERROR] Gagal hapus dari bucket:",
            storageError.message,
          );
        } else {
          console.log(
            "[STORAGE_SUCCESS] Respon sukses dari Supabase Storage:",
            storageData,
          );
        }
      } else {
        console.warn(
          "[PUT] deletedPdfLinks ada, tapi tidak ada path valid yang bisa diekstrak.",
        );
      }
    }

    // ── 9. Upload file PDF BARU yang diantrekan oleh user ─────────────────
    const pdfFiles = formData.getAll("pdf_attachments");
    const newPdfAttachments: Attachment[] = await uploadPdfAttachments(pdfFiles);

    console.log(
      `[PUT] newPdfAttachments (PDF baru terupload): ${newPdfAttachments.length} item`,
    );

    // ── 10. Gabungkan: lampiran dipertahankan + PDF baru terupload ─────────
    const allAttachmentsToSave: Attachment[] = [
      ...existingLinks,
      ...newPdfAttachments,
    ];

    console.log(
      `[PUT] allAttachmentsToSave (gabungan final): ${allAttachmentsToSave.length} item`,
      allAttachmentsToSave.map((a) => `[${a.type}] ${a.name}`),
    );

    // ── 11. Strategi update relasi: DELETE lama → INSERT ulang semua ───────
    // Hapus semua baris lama di materialLinks untuk materi ini,
    // lalu INSERT ulang dengan data yang sudah bersih dan terbaru.
    await db.delete(materialLinks).where(eq(materialLinks.materialId, id));

    if (allAttachmentsToSave.length > 0) {
      await db.insert(materialLinks).values(
        allAttachmentsToSave.map((att) => ({
          materialId: id,
          type: att.type,
          name: att.name,
          url: att.url,
        })),
      );
    }

    // Ambil lampiran terbaru dari DB untuk response
    const links = await db
      .select()
      .from(materialLinks)
      .where(eq(materialLinks.materialId, id));

    return NextResponse.json({ data: { ...updated, links } });
  } catch (error) {
    console.error("PUT /api/admin/materi error:", error);
    const message =
      error instanceof Error ? error.message : "Gagal mengubah materi.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ============================================================================
// DELETE — Hapus materi beserta berkas di Supabase Storage
// ============================================================================

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rawId = searchParams.get("id");

    // ── Validasi ID ────────────────────────────────────────────────────────
    if (!rawId || rawId.trim() === "") {
      return NextResponse.json(
        { error: "Parameter 'id' wajib disertakan pada query string." },
        { status: 400 },
      );
    }

    const id = Number(rawId);

    if (isNaN(id) || id <= 0) {
      return NextResponse.json(
        {
          error: `Nilai 'id' tidak valid: "${rawId}". Harus berupa angka bulat positif.`,
        },
        { status: 400 },
      );
    }

    // ── 1. Ambil data materi (untuk coverUrl) ─────────────────────────────
    const [materialData] = await db
      .select()
      .from(materials)
      .where(eq(materials.id, id));

    if (!materialData) {
      return NextResponse.json(
        { error: `Materi dengan ID ${id} tidak ditemukan.` },
        { status: 404 },
      );
    }

    // ── 2. Ambil semua lampiran dari tabel materialLinks ───────────────────
    const linksData = await db
      .select()
      .from(materialLinks)
      .where(eq(materialLinks.materialId, id));

    console.log(
      `[DELETE] Materi ID ${id} ditemukan. coverUrl: ${materialData.coverUrl ?? "none"}, lampiran: ${linksData.length} item`,
    );

    // ── 3. Kumpulkan semua relative path berkas yang perlu dihapus ─────────
    // extractStoragePath menggunakan strategi berlapis agar tahan terhadap
    // URL yang mengandung karakter URL-encoded seperti %20.
    const filesToDelete: string[] = [];

    // Tambahkan path cover image (jika ada dan bukan null)
    const coverPath = extractStoragePath(materialData.coverUrl);
    if (coverPath) {
      filesToDelete.push(coverPath);
    } else if (materialData.coverUrl) {
      console.warn(
        `[DELETE] Gagal ekstrak path dari coverUrl: "${materialData.coverUrl}"`,
      );
    }

    // Tambahkan path semua file PDF dari materialLinks
    for (const link of linksData) {
      if (link.type === "pdf") {
        const pdfPath = extractStoragePath(link.url);
        if (pdfPath) {
          filesToDelete.push(pdfPath);
        } else {
          console.warn(
            `[DELETE] Gagal ekstrak path dari PDF link URL: "${link.url}"`,
          );
        }
      }
    }

    // ── 4. Hapus berkas secara massal dari Supabase Storage ────────────────
    if (filesToDelete.length > 0) {
      console.log(
        "[STORAGE_DEBUG] Daftar file yang akan dikirim ke .remove():",
        filesToDelete,
      );

      const { data: storageData, error: storageError } =
        await supabase.storage.from("academy-events").remove(filesToDelete);

      if (storageError) {
        console.error(
          "[STORAGE_ERROR] Gagal hapus dari bucket:",
          storageError.message,
        );
        // Tetap lanjutkan penghapusan data DB meskipun Storage gagal
        // agar record di PostgreSQL tidak tertinggal (orphan data)
      } else {
        console.log(
          "[STORAGE_SUCCESS] Respon sukses dari Supabase Storage:",
          storageData,
        );
      }
    } else {
      console.log(
        `[DELETE] Tidak ada berkas fisik untuk dihapus dari Storage (materi ID: ${id}).`,
      );
    }

    // ── 5. Hapus baris materials dari database ─────────────────────────────
    // Karena materialLinks memiliki onDelete: "cascade", baris lampiran
    // di tabel anak akan otomatis ikut terhapus oleh PostgreSQL.
    await db.delete(materials).where(eq(materials.id, id));

    console.log(
      `[DELETE] Materi ID ${id} berhasil dihapus dari database (cascade ke materialLinks).`,
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/materi error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus materi. Silakan coba lagi." },
      { status: 500 },
    );
  }
}
