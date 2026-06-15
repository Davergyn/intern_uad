"use client";

import React, { FormEvent, useEffect, useMemo, useState, useRef } from "react";
import Image from "next/image";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Loader2,
  Image as ImageIcon,
  Handshake,
  ImagePlus,
  Eye,
  EyeOff,
} from "lucide-react";

// ============================================================================
// TYPES & CONSTANTS
// ============================================================================

type PartnershipKategori = "instansi" | "registrar" | "akademisi" | "komunitas";
type CategoryFilter = "all" | PartnershipKategori;

type PartnershipRow = {
  id: number;
  name: string;
  kategori: PartnershipKategori;
  imageUrl: string | null;
  description: string | null;
  isActive: boolean | null;
  createdBy: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

type PartnershipFormData = {
  name: string;
  kategori: PartnershipKategori;
  description: string;
  imageUrl: string;
  isActive: boolean;
};

const KATEGORI_OPTIONS: Array<{
  value: PartnershipKategori;
  label: string;
  color: string;
  borderColor: string;
}> = [
  { value: "instansi", label: "Instansi", color: "bg-blue-50 text-blue-700", borderColor: "border-blue-200" },
  { value: "registrar", label: "Registrar", color: "bg-emerald-50 text-emerald-700", borderColor: "border-emerald-200" },
  { value: "akademisi", label: "Akademisi", color: "bg-amber-50 text-amber-700", borderColor: "border-amber-200" },
  { value: "komunitas", label: "Komunitas", color: "bg-purple-50 text-purple-700", borderColor: "border-purple-200" },
];

const EMPTY_FORM: PartnershipFormData = {
  name: "",
  kategori: "instansi",
  description: "",
  imageUrl: "",
  isActive: true,
};

const ACCEPTED_IMAGE_TYPES = "image/png, image/jpeg, image/webp, image/jpg";
const MAX_FILE_SIZE_MB = 5;

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) return error.message;
  return fallback;
}

function getKategoriMeta(kategori: PartnershipKategori) {
  return KATEGORI_OPTIONS.find((c) => c.value === kategori) ?? KATEGORI_OPTIONS[0];
}

function LogoDisplay({
  name,
  url,
  size = "md",
}: {
  name: string;
  url: string | null | undefined;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = { sm: "w-10 h-10", md: "w-16 h-16", lg: "w-24 h-24" };
  const imgSizes = { sm: 40, md: 64, lg: 96 };

  if (url) {
    return (
      <div className={`${sizes[size]} rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center p-2 shrink-0`}>
        <Image
          src={url}
          alt={name}
          width={imgSizes[size]}
          height={imgSizes[size]}
          className="max-h-full max-w-full object-contain"
          unoptimized
        />
      </div>
    );
  }

  return (
    <div className={`${sizes[size]} rounded-xl bg-gradient-to-br from-[#CB2229] to-rose-400 flex items-center justify-center text-white shrink-0 shadow-sm`}>
      <ImageIcon size={size === "lg" ? 28 : size === "md" ? 20 : 14} />
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ManagePartnershipsPage() {
  const [partnerships, setPartnerships] = useState<PartnershipRow[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<PartnershipRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PartnershipRow | null>(null);
  const [form, setForm] = useState<PartnershipFormData>(EMPTY_FORM);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredPartnerships = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return partnerships.filter((p) => {
      const matchesSearch = !keyword || p.name.toLowerCase().includes(keyword);
      const matchesCategory = categoryFilter === "all" || p.kategori === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [partnerships, search, categoryFilter]);

  // --------------------------------------------------------------------------
  // API
  // --------------------------------------------------------------------------

  const fetchPartnerships = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/partnerships", { cache: "no-store" });
      const result = (await response.json()) as { data?: PartnershipRow[]; error?: string };
      if (!response.ok) throw new Error(result.error || "Gagal memuat data partnership.");
      setPartnerships(result.data ?? []);
    } catch (err) {
      setPartnerships([]);
      setError(getErrorMessage(err, "Gagal memuat data partnership."));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { void fetchPartnerships(); }, []);

  useEffect(() => {
    return () => { if (logoPreview?.startsWith("blob:")) URL.revokeObjectURL(logoPreview); };
  }, [logoPreview]);

  const resetLogoState = () => {
    if (logoPreview?.startsWith("blob:")) URL.revokeObjectURL(logoPreview);
    setLogoFile(null);
    setLogoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`Ukuran file melebihi ${MAX_FILE_SIZE_MB}MB.`);
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
    if (logoPreview?.startsWith("blob:")) URL.revokeObjectURL(logoPreview);
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const showSuccess = (message: string) => {
    setSuccess(message);
    window.setTimeout(() => setSuccess(""), 2500);
  };

  const openCreate = () => {
    setError(""); setSuccess("");
    setEditTarget(null);
    setForm(EMPTY_FORM);
    resetLogoState();
    setModalOpen(true);
  };

  const openEdit = (partnership: PartnershipRow) => {
    setError(""); setSuccess("");
    setEditTarget(partnership);
    setForm({
      name: partnership.name,
      kategori: partnership.kategori,
      description: partnership.description ?? "",
      imageUrl: partnership.imageUrl ?? "",
      isActive: partnership.isActive ?? true,
    });
    setLogoFile(null);
    setLogoPreview(partnership.imageUrl ?? null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setModalOpen(true);
  };

  const insertPartnership = async (values: PartnershipFormData, file: File | null) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("kategori", values.kategori);
    formData.append("description", values.description);
    formData.append("isActive", String(values.isActive));
    if (file) formData.append("logo", file);

    const response = await fetch("/api/admin/partnerships", { method: "POST", body: formData });
    const result = (await response.json()) as { error?: string };
    if (!response.ok) throw new Error(result.error || "Gagal menambah partnership.");
    await fetchPartnerships();
  };

  const updatePartnership = async (id: number, values: PartnershipFormData, file: File | null) => {
    const formData = new FormData();
    formData.append("id", String(id));
    formData.append("name", values.name);
    formData.append("kategori", values.kategori);
    formData.append("description", values.description);
    formData.append("isActive", String(values.isActive));
    if (file) { formData.append("logo", file); }
    else if (values.imageUrl) { formData.append("existingLogoUrl", values.imageUrl); }

    const response = await fetch("/api/admin/partnerships", { method: "PUT", body: formData });
    const result = (await response.json()) as { error?: string };
    if (!response.ok) throw new Error(result.error || "Gagal mengubah partnership.");
    await fetchPartnerships();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name.trim()) { setError("Nama Partner wajib diisi."); return; }
    if (!editTarget && !logoFile) { setError("Logo partner wajib diupload."); return; }

    setIsSaving(true); setError(""); setSuccess("");
    try {
      if (editTarget) {
        await updatePartnership(editTarget.id, form, logoFile);
        showSuccess("Partnership berhasil diperbarui.");
      } else {
        await insertPartnership(form, logoFile);
        showSuccess("Partnership berhasil ditambahkan.");
      }
      setModalOpen(false); setEditTarget(null); setForm(EMPTY_FORM); resetLogoState();
    } catch (err) {
      setError(getErrorMessage(err, "Gagal menyimpan data."));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsSaving(true); setError(""); setSuccess("");
    try {
      const response = await fetch(`/api/admin/partnerships?id=${deleteTarget.id}`, { method: "DELETE" });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || "Gagal menghapus partnership.");
      setDeleteTarget(null);
      showSuccess("Partnership berhasil dihapus.");
      await fetchPartnerships();
    } catch (err) {
      setError(getErrorMessage(err, "Gagal menghapus data."));
    } finally {
      setIsSaving(false);
    }
  };

  // --------------------------------------------------------------------------
  // RENDER
  // --------------------------------------------------------------------------

  return (
    <div className="space-y-5">
      {/* Header Info */}
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#CB2229]/10">
            <Handshake size={20} className="text-[#CB2229]" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800">Kelola Partnership</h2>
            <p className="text-xs text-slate-500">
              Tambah, edit, atau hapus mitra berdasarkan kategori yang ditampilkan di halaman partnership.
            </p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama partner..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm focus:border-[#CB2229] focus:outline-none focus:ring-2 focus:ring-[#CB2229]/30"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as CategoryFilter)}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:border-[#CB2229] focus:outline-none focus:ring-2 focus:ring-[#CB2229]/30 lg:w-48"
        >
          <option value="all">Semua Kategori</option>
          {KATEGORI_OPTIONS.map((cat) => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>

        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-xl bg-[#CB2229] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700"
        >
          <Plus size={16} /> Tambah Partner
        </button>
      </div>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      {success && <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div>}

      {/* Stats per kategori */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {KATEGORI_OPTIONS.map((cat) => {
          const count = partnerships.filter((p) => p.kategori === cat.value).length;
          return (
            <button
              key={cat.value}
              onClick={() => setCategoryFilter(categoryFilter === cat.value ? "all" : cat.value)}
              className={`rounded-xl border p-3 text-left transition-all hover:shadow-sm ${
                categoryFilter === cat.value ? `${cat.color} ${cat.borderColor} shadow-sm` : "border-slate-100 bg-white"
              }`}
            >
              <p className="text-lg font-black text-slate-800">{count}</p>
              <p className="text-xs font-semibold text-slate-500">{cat.label}</p>
            </button>
          );
        })}
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading ? (
          <div className="col-span-full flex items-center justify-center py-16 text-slate-400">
            <Loader2 size={20} className="mr-2 animate-spin" />
            Memuat data partnership...
          </div>
        ) : filteredPartnerships.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-slate-100 bg-white py-16 text-center text-sm text-slate-400">
            {search || categoryFilter !== "all"
              ? "Tidak ada partner yang cocok dengan pencarian dan filter."
              : 'Belum ada data partner. Klik "+ Tambah Partner" untuk menambahkan.'}
          </div>
        ) : (
          filteredPartnerships.map((partnership) => {
            const kategoriMeta = getKategoriMeta(partnership.kategori);
            return (
              <div
                key={`partnership-${partnership.id}`}
                className="flex flex-col items-center gap-3 rounded-2xl border border-slate-100 bg-white p-5 text-center shadow-sm transition-shadow hover:shadow-md"
              >
                <LogoDisplay name={partnership.name} url={partnership.imageUrl} size="lg" />

                {/* Nama & Badge */}
                <div className="flex-1 w-full">
                  <h3 className="font-bold text-slate-800 text-sm leading-snug">{partnership.name}</h3>
                  <div className="mt-1.5 flex flex-wrap items-center justify-center gap-1.5">
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${kategoriMeta.color} ${kategoriMeta.borderColor}`}>
                      {kategoriMeta.label}
                    </span>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      partnership.isActive ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
                    }`}>
                      {partnership.isActive ? <Eye size={9} /> : <EyeOff size={9} />}
                      {partnership.isActive ? "Aktif" : "Nonaktif"}
                    </span>
                  </div>
                  {partnership.description && (
                    <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {partnership.description}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex w-full items-center justify-center gap-2 border-t border-slate-100 pt-2">
                  <button
                    onClick={() => openEdit(partnership)}
                    aria-label={`Edit ${partnership.name}`}
                    className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-50"
                  >
                    <Pencil size={12} /> Edit
                  </button>
                  <button
                    onClick={() => setDeleteTarget(partnership)}
                    aria-label={`Hapus ${partnership.name}`}
                    className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
                  >
                    <Trash2 size={12} /> Hapus
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* CREATE/EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            aria-label="Tutup modal"
            onClick={() => setModalOpen(false)}
          />
          <form
            onSubmit={handleSubmit}
            className="relative max-h-[92vh] w-full max-w-lg space-y-5 overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  {editTarget ? "Edit Partner" : "Tambah Partner Baru"}
                </h3>
                <p className="text-xs text-slate-400">
                  {editTarget ? "Perbarui informasi partner di bawah." : "Isi informasi partner yang akan ditambahkan."}
                </p>
              </div>
              <button type="button" onClick={() => setModalOpen(false)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>

            {/* Preview Logo */}
            <div className="flex justify-center">
              <LogoDisplay name={form.name} url={logoPreview} size="lg" />
            </div>

            <div className="space-y-4">
              {/* Nama Partner */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">Nama Partner *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Contoh: Telkom Indonesia"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-[#CB2229] focus:outline-none focus:ring-2 focus:ring-[#CB2229]/30"
                  required
                />
              </div>

              {/* Kategori */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">Kategori *</label>
                <select
                  value={form.kategori}
                  onChange={(e) => setForm((prev) => ({ ...prev, kategori: e.target.value as PartnershipKategori }))}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-[#CB2229] focus:outline-none focus:ring-2 focus:ring-[#CB2229]/30"
                >
                  {KATEGORI_OPTIONS.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              {/* Deskripsi */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">Deskripsi</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Contoh: Instansi pemerintah yang berkolaborasi dalam program literasi digital..."
                  rows={2}
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-[#CB2229] focus:outline-none focus:ring-2 focus:ring-[#CB2229]/30"
                />
              </div>

              {/* Status Aktif */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">Status Tayang</label>
                <label className="flex min-h-10 items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5">
                  <span className="text-sm font-semibold text-slate-700">{form.isActive ? "Aktif" : "Nonaktif"}</span>
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                    className="h-4 w-4 accent-[#CB2229]"
                  />
                </label>
              </div>

              {/* Logo Upload */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Logo Partner {!editTarget && "*"}
                </label>

                {logoPreview && (
                  <div className="relative mb-3 group">
                    <div className="relative flex h-36 w-full items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white p-4">
                      <Image
                        src={logoPreview}
                        alt="Preview logo"
                        width={200}
                        height={120}
                        className="max-h-full max-w-full object-contain"
                        unoptimized
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => { resetLogoState(); setForm((f) => ({ ...f, imageUrl: "" })); }}
                      className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white shadow-md transition-all hover:scale-110 hover:bg-red-600"
                      title="Hapus logo"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}

                <div
                  className="relative cursor-pointer rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 px-4 py-6 text-center transition-all hover:border-[#CB2229]/40 hover:bg-red-50/30"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input ref={fileInputRef} type="file" accept={ACCEPTED_IMAGE_TYPES} onChange={handleFileChange} className="hidden" />
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#CB2229]/10">
                      <ImagePlus size={20} className="text-[#CB2229]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600">
                        {logoPreview ? "Klik untuk ganti logo" : "Klik untuk upload logo"}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-400">PNG, JPEG, WebP • Maks {MAX_FILE_SIZE_MB}MB</p>
                    </div>
                  </div>
                </div>
              </div>
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
                {isSaving ? "Menyimpan..." : editTarget ? "Simpan Perubahan" : "Tambah Partner"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* DELETE MODAL */}
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
              <h3 className="font-bold text-slate-800">Hapus Partner?</h3>
              <p className="mt-1 text-sm text-slate-500">{deleteTarget.name}</p>
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
