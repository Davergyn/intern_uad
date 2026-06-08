"use client";

import React, { FormEvent, useEffect, useMemo, useState, useRef } from "react";
import Image from "next/image";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  ExternalLink,
  BookOpen,
  Loader2,
  Eye,
  EyeOff,
  ImagePlus,
} from "lucide-react";
import type { MaterialRow } from "@/types/database";

type MaterialFormData = {
  title: string;
  description: string;
  linkUrl: string;
  coverUrl: string;
  isActive: boolean;
};

const COVER_GRADIENTS = [
  "from-blue-400 to-blue-600",
  "from-purple-400 to-purple-600",
  "from-emerald-400 to-emerald-600",
  "from-amber-400 to-orange-500",
  "from-rose-400 to-red-600",
  "from-indigo-400 to-indigo-600",
];

const EMPTY_FORM: MaterialFormData = {
  title: "",
  description: "",
  linkUrl: "",
  coverUrl: "",
  isActive: true,
};

const ACCEPTED_IMAGE_TYPES = "image/png, image/jpeg, image/webp, image/jpg";
const MAX_FILE_SIZE_MB = 5;

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) return error.message;
  return fallback;
}

function isValidUrl(url: string): boolean {
  if (!url || !url.trim()) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export default function ManageMaterialPage() {
  const [materials, setMaterials] = useState<MaterialRow[]>([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<MaterialRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MaterialRow | null>(null);
  const [form, setForm] = useState<MaterialFormData>(EMPTY_FORM);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // State untuk file upload & preview
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter materials berdasarkan search
  const filteredMaterials = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return materials.filter(
      (material) => !keyword || material.title.toLowerCase().includes(keyword),
    );
  }, [materials, search]);

  // Fetch materials dari API route (Drizzle)
  const fetchMaterials = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/materi", { cache: "no-store" });
      const result = (await response.json()) as {
        data?: MaterialRow[];
        error?: string;
      };

      if (!response.ok) {
        throw new Error(result.error || "Gagal memuat data materi.");
      }

      setMaterials(result.data ?? []);
    } catch (err) {
      setMaterials([]);
      setError(getErrorMessage(err, "Gagal memuat data materi."));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchMaterials();
  }, []);

  // Cleanup object URL saat komponen unmount atau preview berubah
  useEffect(() => {
    return () => {
      if (coverPreview && coverPreview.startsWith("blob:")) {
        URL.revokeObjectURL(coverPreview);
      }
    };
  }, [coverPreview]);

  const resetCoverState = () => {
    if (coverPreview && coverPreview.startsWith("blob:")) {
      URL.revokeObjectURL(coverPreview);
    }
    setCoverFile(null);
    setCoverPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi ukuran file
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`Ukuran file melebihi ${MAX_FILE_SIZE_MB}MB. Silakan pilih file yang lebih kecil.`);
      e.target.value = "";
      return;
    }

    // Validasi tipe file
    const allowedTypes = ["image/png", "image/jpeg", "image/webp", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      setError("Format file tidak didukung. Gunakan PNG, JPEG, atau WebP.");
      e.target.value = "";
      return;
    }

    setError("");

    // Revoke URL lama sebelum buat yang baru
    if (coverPreview && coverPreview.startsWith("blob:")) {
      URL.revokeObjectURL(coverPreview);
    }

    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const showSuccess = (message: string) => {
    setSuccess(message);
    window.setTimeout(() => setSuccess(""), 2500);
  };

  const openCreate = () => {
    setError("");
    setSuccess("");
    setEditTarget(null);
    setForm(EMPTY_FORM);
    resetCoverState();
    setModalOpen(true);
  };

  const openEdit = (material: MaterialRow) => {
    setError("");
    setSuccess("");
    setEditTarget(material);
    setForm({
      title: material.title,
      description: material.description ?? "",
      linkUrl: material.linkUrl ?? "",
      coverUrl: material.coverUrl ?? "",
      isActive: material.isActive ?? true,
    });
    // Reset file state, tapi set preview ke existing cover
    setCoverFile(null);
    setCoverPreview(material.coverUrl ?? null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setModalOpen(true);
  };

  const insertMaterial = async (values: MaterialFormData, file: File | null) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description ?? "");
    formData.append("linkUrl", values.linkUrl ?? "");
    formData.append("isActive", String(values.isActive));

    if (file) {
      formData.append("cover", file);
    }

    const response = await fetch("/api/admin/materi", {
      method: "POST",
      body: formData,
    });
    const result = (await response.json()) as { error?: string };
    if (!response.ok) throw new Error(result.error || "Gagal menambah materi.");
    await fetchMaterials();
  };

  const updateMaterial = async (id: number, values: MaterialFormData, file: File | null) => {
    const formData = new FormData();
    formData.append("id", String(id));
    formData.append("title", values.title);
    formData.append("description", values.description ?? "");
    formData.append("linkUrl", values.linkUrl ?? "");
    formData.append("isActive", String(values.isActive));

    // Kirim existing URL jika tidak mengganti cover
    if (file) {
      formData.append("cover", file);
    } else if (values.coverUrl) {
      formData.append("existingCoverUrl", values.coverUrl);
    }

    const response = await fetch("/api/admin/materi", {
      method: "PUT",
      body: formData,
    });
    const result = (await response.json()) as { error?: string };
    if (!response.ok) throw new Error(result.error || "Gagal mengubah materi.");
    await fetchMaterials();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.title.trim()) {
      setError("Judul Materi wajib diisi.");
      return;
    }

    if (form.linkUrl && !isValidUrl(form.linkUrl)) {
      setError("Link Aksi harus berupa URL yang valid.");
      return;
    }

    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      if (editTarget) {
        await updateMaterial(editTarget.id, form, coverFile);
        showSuccess("Materi berhasil diperbarui.");
      } else {
        await insertMaterial(form, coverFile);
        showSuccess("Materi berhasil ditambahkan.");
      }

      setModalOpen(false);
      setEditTarget(null);
      setForm(EMPTY_FORM);
      resetCoverState();
    } catch (err) {
      setError(getErrorMessage(err, "Gagal menyimpan data."));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/admin/materi?id=${deleteTarget.id}`, {
        method: "DELETE",
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || "Gagal menghapus materi.");

      setDeleteTarget(null);
      showSuccess("Materi berhasil dihapus.");
      await fetchMaterials();
    } catch (err) {
      setError(getErrorMessage(err, "Gagal menghapus data."));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari judul materi..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#CB2229]/30 focus:border-[#CB2229]"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden">
            {(["grid", "table"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setViewMode(m)}
                className={`px-3 py-2 text-xs font-medium transition-colors ${viewMode === m ? "bg-slate-800 text-white" : "text-slate-500 hover:bg-slate-50"}`}
              >
                {m === "grid" ? "Grid" : "Tabel"}
              </button>
            ))}
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#CB2229] hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
          >
            <Plus size={16} /> Tambah Materi
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Success Alert */}
      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </div>
      )}

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {isLoading ? (
            <div className="col-span-full py-16 flex items-center justify-center text-slate-400">
              <Loader2 size={20} className="animate-spin mr-2" />
              Memuat data materi...
            </div>
          ) : filteredMaterials.length === 0 ? (
            <div className="col-span-full py-16 text-center text-slate-400 text-sm bg-white rounded-2xl border border-slate-100">
              {search
                ? "Tidak ada materi yang cocok dengan pencarian."
                : 'Belum ada data materi. Klik "+ Tambah Materi" untuk menambahkan.'}
            </div>
          ) : (
            filteredMaterials.map((mat) => (
              <div
                key={`material-${mat.id}`}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow"
              >
                {/* Cover Area */}
                <div
                  className={`h-36 bg-linear-to-br ${COVER_GRADIENTS[mat.id % COVER_GRADIENTS.length]} flex items-center justify-center relative overflow-hidden`}
                >
                  {mat.coverUrl ? (
                    <Image
                      src={mat.coverUrl}
                      alt={mat.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <BookOpen size={40} className="text-white/50" />
                  )}
                  <div className="absolute inset-0 bg-black/10" />
                </div>

                {/* Content Area */}
                <div className="p-4 flex-1 flex flex-col space-y-3">
                  {/* Title */}
                  <h3 className="font-bold text-slate-800 text-base line-clamp-2">
                    {mat.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {mat.description && mat.description.trim() ? (
                      mat.description
                    ) : (
                      <span className="italic">Tidak ada deskripsi</span>
                    )}
                  </p>

                  {/* Info & Status Row (2 Columns) */}
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                    {/* Left Column - Link URL */}
                    <div className="flex-1">
                      {mat.linkUrl ? (
                        <a
                          href={mat.linkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-[#CB2229] hover:underline font-medium truncate max-w-[150px]"
                          title={mat.linkUrl}
                        >
                          <ExternalLink size={12} className="shrink-0" />
                          <span className="truncate">{mat.linkUrl}</span>
                        </a>
                      ) : (
                        <span className="text-xs text-slate-300">—</span>
                      )}
                    </div>

                    {/* Right Column - Status Badge */}
                    <div className="flex justify-end">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full ${
                          mat.isActive
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {mat.isActive ? (
                          <Eye size={11} />
                        ) : (
                          <EyeOff size={11} />
                        )}
                        {mat.isActive ? "Aktif" : "Nonaktif"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => openEdit(mat)}
                    aria-label={`Edit ${mat.title}`}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Pencil size={12} /> Edit
                  </button>
                  <button
                    onClick={() => setDeleteTarget(mat)}
                    aria-label={`Hapus ${mat.title}`}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={12} /> Hapus
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Table View */}
      {viewMode === "table" && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-slate-800">Daftar Materi</h2>
            <span className="text-xs text-slate-400">
              {isLoading ? "Memuat..." : `${filteredMaterials.length} data`}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                  <th className="px-6 py-3">No</th>
                  <th className="px-6 py-3">Cover</th>
                  <th className="px-6 py-3">Judul Materi</th>
                  <th className="px-6 py-3">Link</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-8 text-center text-slate-400 text-sm"
                    >
                      <Loader2
                        size={16}
                        className="inline-block animate-spin mr-2"
                      />
                      Memuat data materi...
                    </td>
                  </tr>
                ) : filteredMaterials.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-12 text-center text-slate-400 text-sm"
                    >
                      {search
                        ? "Tidak ada materi yang cocok dengan pencarian."
                        : "Belum ada data materi."}
                    </td>
                  </tr>
                ) : (
                  filteredMaterials.map((mat, idx) => (
                    <tr
                      key={`material-row-${mat.id}`}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {idx + 1}
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-10 w-16 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center">
                          {mat.coverUrl ? (
                            <Image
                              src={mat.coverUrl}
                              alt={mat.title}
                              width={64}
                              height={40}
                              className="h-full w-full object-cover"
                              unoptimized
                            />
                          ) : (
                            <BookOpen size={16} className="text-slate-400" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-800 max-w-xs">
                        <p className="truncate">{mat.title}</p>
                      </td>
                      <td className="px-6 py-4">
                        {mat.linkUrl ? (
                          <a
                            href={mat.linkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-[#CB2229] hover:underline font-medium max-w-50 truncate"
                          >
                            <ExternalLink size={11} className="shrink-0" />
                            <span className="truncate">{mat.linkUrl}</span>
                          </a>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${
                            mat.isActive
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {mat.isActive ? (
                            <Eye size={10} />
                          ) : (
                            <EyeOff size={10} />
                          )}
                          {mat.isActive ? "Aktif" : "Nonaktif"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEdit(mat)}
                            aria-label={`Edit ${mat.title}`}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(mat)}
                            aria-label={`Hapus ${mat.title}`}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            aria-label="Tutup modal"
            onClick={() => setModalOpen(false)}
          />
          <form
            onSubmit={handleSubmit}
            className="relative max-h-[92vh] w-full max-w-2xl space-y-5 overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  {editTarget ? "Edit Materi" : "Tambah Materi Baru"}
                </h3>
                <p className="text-xs text-slate-400">
                  {editTarget
                    ? "Perbarui informasi materi di bawah."
                    : "Isi informasi materi yang akan ditambahkan."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Judul Materi */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Judul Materi *
                </label>
                <input
                  value={form.title}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Contoh: Transformasi Digital di Era Society 5.0"
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CB2229]/30 focus:border-[#CB2229]"
                  required
                />
              </div>

              {/* Deskripsi Materi */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Deskripsi Materi (opsional)
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Tuliskan penjelasan singkat tentang materi ini..."
                  rows={3}
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CB2229]/30 focus:border-[#CB2229] resize-none"
                />
              </div>

              {/* Link Aksi */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Link Aksi (KLIK UNTUK LIHAT)
                </label>
                <input
                  type="url"
                  value={form.linkUrl}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, linkUrl: e.target.value }))
                  }
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CB2229]/30 focus:border-[#CB2229]"
                />
              </div>

              {/* ====== COVER UPLOAD SECTION ====== */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Cover Materi (opsional)
                </label>

                {/* Image Preview */}
                {coverPreview && (
                  <div className="relative mb-3 group">
                    <div className="relative h-44 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                      <Image
                        src={coverPreview}
                        alt="Preview cover"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        resetCoverState();
                        setForm((f) => ({ ...f, coverUrl: "" }));
                      }}
                      className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white shadow-md transition-all hover:bg-red-600 hover:scale-110"
                      title="Hapus cover"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}

                {/* File Input Area */}
                <div
                  className="relative cursor-pointer rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 px-4 py-6 text-center transition-all hover:border-[#CB2229]/40 hover:bg-red-50/30"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={ACCEPTED_IMAGE_TYPES}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#CB2229]/10">
                      <ImagePlus size={20} className="text-[#CB2229]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600">
                        {coverPreview
                          ? "Klik untuk ganti cover"
                          : "Klik untuk upload cover"}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-400">
                        PNG, JPEG, WebP • Maks {MAX_FILE_SIZE_MB}MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* ====== END COVER UPLOAD SECTION ====== */}

              {/* Status Aktif */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Status Tayang
                </label>
                <label className="flex min-h-10 items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5">
                  <span className="text-sm font-semibold text-slate-700">
                    {form.isActive ? "Aktif" : "Nonaktif"}
                  </span>
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        isActive: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 accent-[#CB2229]"
                  />
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 px-5 py-2 text-sm font-semibold bg-[#CB2229] hover:bg-red-700 text-white rounded-xl transition-colors disabled:opacity-70"
              >
                {isSaving && <Loader2 size={15} className="animate-spin" />}
                {isSaving
                  ? "Menyimpan..."
                  : editTarget
                    ? "Simpan Perubahan"
                    : "Tambah Materi"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            aria-label="Tutup modal hapus"
            onClick={() => setDeleteTarget(null)}
          />
          <div className="relative w-full max-w-sm space-y-4 rounded-2xl bg-white p-6 text-center shadow-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
              <Trash2 size={24} className="text-[#CB2229]" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Hapus Materi?</h3>
              <p className="mt-1 text-sm text-slate-500">
                {deleteTarget.title}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 rounded-xl border border-slate-200 py-2 text-sm font-medium transition-colors hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={isSaving}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#CB2229] py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-70"
              >
                {isSaving && <Loader2 size={15} className="animate-spin" />}
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
