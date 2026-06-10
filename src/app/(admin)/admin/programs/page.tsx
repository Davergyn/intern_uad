"use client";

import { FormEvent, useEffect, useMemo, useState, useRef } from "react";
import Image from "next/image";
import {
  Eye,
  EyeOff,
  ImagePlus,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
  LayoutGrid
} from "lucide-react";
import type { ProgramKategori, ProgramRow } from "@/types/database";

type CategoryFilter = "all" | ProgramKategori;

type ProgramFormData = {
  kategori: ProgramKategori;
  title: string;
  imageUrl: string;
  isActive: boolean;
};

const KATEGORI_OPTIONS: Array<{
  value: ProgramKategori;
  label: string;
  color: string;
  borderColor: string;
}> = [
  {
    value: "training-of-trainer",
    label: "Training of Trainer",
    color: "bg-green-50 text-green-700",
    borderColor: "border-green-200",
  },
  { 
    value: "seminar", 
    label: "Seminar", 
    color: "bg-blue-50 text-blue-700",
    borderColor: "border-blue-200",
  },
  { 
    value: "workshop", 
    label: "Workshop", 
    color: "bg-amber-50 text-amber-700",
    borderColor: "border-amber-200",
  },
  {
    value: "partnership",
    label: "Partnership",
    color: "bg-purple-50 text-purple-700",
    borderColor: "border-purple-200",
  },
];

const EMPTY_FORM: ProgramFormData = {
  kategori: "training-of-trainer",
  title: "",
  imageUrl: "",
  isActive: true,
};

const ACCEPTED_IMAGE_TYPES = "image/png, image/jpeg, image/webp, image/jpg";
const MAX_FILE_SIZE_MB = 5;

function getKategoriMeta(kategori: ProgramKategori) {
  return (
    KATEGORI_OPTIONS.find((cat) => cat.value === kategori) ??
    KATEGORI_OPTIONS[0]
  );
}

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) return error.message;
  return fallback;
}

export default function ManageProgramsPage() {
  const [items, setItems] = useState<ProgramRow[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ProgramRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ProgramRow | null>(null);
  const [form, setForm] = useState<ProgramFormData>(EMPTY_FORM);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // State untuk toggle Grid/Table
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // State untuk file upload & preview
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredItems = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return items.filter((item) => {
      const matchesSearch =
        !keyword ||
        item.title.toLowerCase().includes(keyword);
      const matchesCategory =
        categoryFilter === "all" || item.kategori === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [categoryFilter, items, search]);

  const fetchItems = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/programs", { cache: "no-store" });
      const result = (await response.json()) as {
        data?: ProgramRow[];
        error?: string;
      };

      if (!response.ok) {
        throw new Error(result.error || "Gagal memuat data program.");
      }

      setItems(result.data ?? []);
    } catch (fetchError) {
      setItems([]);
      setError(getErrorMessage(fetchError, "Gagal memuat data program."));
    }

    setIsLoading(false);
  };

  useEffect(() => {
    void fetchItems();
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const resetImageState = () => {
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`Ukuran file melebihi ${MAX_FILE_SIZE_MB}MB. Silakan pilih file yang lebih kecil.`);
      e.target.value = "";
      return;
    }

    const allowedTypes = ["image/png", "image/jpeg", "image/webp", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      setError("Format file tidak didukung. Gunakan PNG, JPEG, atau WebP.");
      e.target.value = "";
      return;
    }

    setError("");

    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
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
    resetImageState();
    setModalOpen(true);
  };

  const openEdit = (row: ProgramRow) => {
    setError("");
    setSuccess("");
    setEditTarget(row);
    setForm({
      kategori: row.kategori,
      title: row.title,
      imageUrl: row.imageUrl ?? "",
      isActive: row.isActive ?? true,
    });
    setImageFile(null);
    setImagePreview(row.imageUrl ?? null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setModalOpen(true);
  };

  const insertProgram = async (values: ProgramFormData, file: File | null) => {
    const formData = new FormData();
    formData.append("kategori", values.kategori);
    formData.append("title", values.title);
    formData.append("isActive", String(values.isActive));

    if (file) {
      formData.append("image", file);
    }

    const response = await fetch("/api/admin/programs", {
      method: "POST",
      body: formData,
    });
    const result = (await response.json()) as { error?: string };
    if (!response.ok) throw new Error(result.error || "Gagal menambah program.");
    await fetchItems();
  };

  const updateProgram = async (id: number, values: ProgramFormData, file: File | null) => {
    const formData = new FormData();
    formData.append("id", String(id));
    formData.append("kategori", values.kategori);
    formData.append("title", values.title);
    formData.append("isActive", String(values.isActive));

    if (file) {
      formData.append("image", file);
    } else if (values.imageUrl) {
      formData.append("existingImageUrl", values.imageUrl);
    }

    const response = await fetch("/api/admin/programs", {
      method: "PUT",
      body: formData,
    });
    const result = (await response.json()) as { error?: string };
    if (!response.ok) throw new Error(result.error || "Gagal mengubah program.");
    await fetchItems();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.title.trim()) {
      setError("Label/Nama Foto wajib diisi.");
      return;
    }

    if (!editTarget && !imageFile) {
      setError("Gambar program wajib diupload.");
      return;
    }

    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      if (editTarget) {
        await updateProgram(editTarget.id, form, imageFile);
        showSuccess("Foto program berhasil diperbarui.");
      } else {
        await insertProgram(form, imageFile);
        showSuccess("Foto program berhasil ditambahkan.");
      }

      setModalOpen(false);
      setEditTarget(null);
      setForm(EMPTY_FORM);
      resetImageState();
    } catch (saveError) {
      setError(getErrorMessage(saveError, "Gagal menyimpan data."));
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
      const response = await fetch(`/api/admin/programs?id=${deleteTarget.id}`, {
        method: "DELETE",
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || "Gagal menghapus program.");

      setDeleteTarget(null);
      showSuccess("Foto program berhasil dihapus.");
      await fetchItems();
    } catch (deleteError) {
      setError(getErrorMessage(deleteError, "Gagal menghapus data."));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cari label/nama foto..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm focus:border-[#CB2229] focus:outline-none focus:ring-2 focus:ring-[#CB2229]/30"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(event) =>
            setCategoryFilter(event.target.value as CategoryFilter)
          }
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:border-[#CB2229] focus:outline-none focus:ring-2 focus:ring-[#CB2229]/30 lg:w-48"
        >
          <option value="all">Semua Kategori</option>
          {KATEGORI_OPTIONS.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          {/* Toggle Grid/Table */}
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
            className="flex items-center justify-center gap-2 rounded-xl bg-[#CB2229] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700"
          >
            <Plus size={16} /> Tambah Foto
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </div>
      )}

      {/* View Mode: GRID */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {isLoading ? (
            <div className="col-span-full py-16 flex items-center justify-center text-slate-400">
              <Loader2 size={20} className="animate-spin mr-2" />
              Memuat galeri program...
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="col-span-full py-16 text-center text-slate-400 text-sm bg-white rounded-2xl border border-slate-100">
              {search || categoryFilter !== "all"
                ? "Tidak ada foto yang cocok dengan pencarian dan filter."
                : 'Belum ada foto kegiatan. Klik "+ Tambah Foto" untuk mengunggah.'}
            </div>
          ) : (
            filteredItems.map((item) => {
              const category = getKategoriMeta(item.kategori);
              
              return (
                <div
                  key={`program-grid-${item.id}`}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all duration-200 group"
                >
                  {/* Image Area */}
                  <div className="h-48 relative bg-slate-100 flex items-center justify-center overflow-hidden">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        unoptimized
                      />
                    ) : (
                      <LayoutGrid size={40} className="text-slate-300" />
                    )}
                    
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent opacity-80" />
                    
                    {/* Floating Badges */}
                    <div className="absolute top-3 left-3">
                      <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border backdrop-blur-md shadow-sm ${category.color} ${category.borderColor}`}>
                        {category.label}
                      </span>
                    </div>
                    
                    <div className="absolute top-3 right-3">
                      <span className={`flex items-center gap-1 px-2 py-1 text-[10px] font-bold rounded-md backdrop-blur-md shadow-sm ${item.isActive ? "bg-emerald-500 text-white" : "bg-slate-800 text-white"}`}>
                        {item.isActive ? <Eye size={10} /> : <EyeOff size={10} />}
                        {item.isActive ? "Aktif" : "Draft"}
                      </span>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-bold text-slate-800 text-[15px] leading-snug line-clamp-2 mb-2 group-hover:text-[#CB2229] transition-colors">
                      {item.title}
                    </h3>
                  </div>

                  {/* Action Buttons */}
                  <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <span className="text-[10px] text-slate-400 font-medium">ID: #{item.id}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(item)}
                        aria-label={`Edit ${item.title}`}
                        className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors bg-blue-50"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(item)}
                        aria-label={`Hapus ${item.title}`}
                        className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors bg-red-50"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* View Mode: TABLE */}
      {viewMode === "table" && (
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div>
              <h2 className="font-bold text-slate-800">Manajemen Foto Program</h2>
              <p className="text-xs text-slate-400">
                Kelola foto kegiatan dengan kategori, upload gambar, dan status aktif.
              </p>
            </div>
            <span className="text-xs text-slate-400">
              {filteredItems.length} data
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-6 py-3">Foto</th>
                  <th className="px-6 py-3">Label</th>
                  <th className="px-6 py-3">Kategori</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-12 text-center text-sm text-slate-400"
                    >
                      <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" />
                      Memuat data program...
                    </td>
                  </tr>
                ) : filteredItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-12 text-center text-sm text-slate-400"
                    >
                      Tidak ada data program ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => {
                    const category = getKategoriMeta(item.kategori);

                    return (
                      <tr
                        key={`program-${item.id}`}
                        className="transition-colors hover:bg-slate-50"
                      >
                        <td className="max-w-sm px-6 py-4">
                          <div className="flex h-10 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 border border-slate-200">
                            {item.imageUrl ? (
                              <Image
                                src={item.imageUrl}
                                alt={item.title}
                                width={64}
                                height={40}
                                className="h-full w-full object-cover"
                                unoptimized
                              />
                            ) : (
                              <ImagePlus size={18} className="text-slate-400" />
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="truncate text-sm font-semibold text-slate-800">
                            {item.title}
                          </p>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold border ${category.color} ${category.borderColor}`}
                          >
                            {category.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold border ${item.isActive ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-slate-100 text-slate-500 border-slate-200"}`}
                          >
                            {item.isActive ? (
                              <Eye size={12} />
                            ) : (
                              <EyeOff size={12} />
                            )}
                            {item.isActive ? "Aktif" : "Nonaktif"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEdit(item)}
                              aria-label={`Edit ${item.title}`}
                              className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(item)}
                              aria-label={`Hapus ${item.title}`}
                              className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
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
                  {editTarget ? "Edit Foto Program" : "Tambah Foto Program"}
                </h3>
                <p className="text-xs text-slate-400">
                  Isi informasi foto kegiatan dengan kategori yang sesuai.
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

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Kategori *
                </label>
                <select
                  value={form.kategori}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      kategori: event.target.value as ProgramKategori,
                    }))
                  }
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-[#CB2229] focus:outline-none focus:ring-2 focus:ring-[#CB2229]/30"
                >
                  {KATEGORI_OPTIONS.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Status Aktif
                </label>
                <label className="flex min-h-10 items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5">
                  <span className="text-sm font-semibold text-slate-700">
                    {form.isActive ? "Aktif" : "Nonaktif"}
                  </span>
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        isActive: event.target.checked,
                      }))
                    }
                    className="h-4 w-4 accent-[#CB2229]"
                  />
                </label>
              </div>

              <div className="md:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Label/Nama Foto *
                </label>
                <input
                  value={form.title}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      title: event.target.value,
                    }))
                  }
                  required
                  placeholder="Contoh: Dokumentasi Seminar Literasi Digital"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-[#CB2229] focus:outline-none focus:ring-2 focus:ring-[#CB2229]/30"
                />
              </div>

              {/* ====== IMAGE UPLOAD SECTION ====== */}
              <div className="md:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Gambar Program {!editTarget && "*"}
                </label>

                {/* Image Preview */}
                {imagePreview && (
                  <div className="relative mb-3 group">
                    <div className="relative h-44 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                      <Image
                        src={imagePreview}
                        alt="Preview gambar"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        resetImageState();
                        // Juga hapus imageUrl dari form (untuk mode edit)
                        setForm((f) => ({ ...f, imageUrl: "" }));
                      }}
                      className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white shadow-md transition-all hover:bg-red-600 hover:scale-110"
                      title="Hapus gambar"
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
                        {imagePreview
                          ? "Klik untuk ganti gambar"
                          : "Klik untuk upload gambar"}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-400">
                        PNG, JPEG, WebP • Maks {MAX_FILE_SIZE_MB}MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* ====== END IMAGE UPLOAD SECTION ====== */}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 rounded-xl bg-[#CB2229] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-70"
              >
                {isSaving && <Loader2 size={15} className="animate-spin" />}
                {isSaving
                  ? "Menyimpan..."
                  : editTarget
                    ? "Simpan Perubahan"
                    : "Tambah"}
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
              <h3 className="font-bold text-slate-800">Hapus Data?</h3>
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