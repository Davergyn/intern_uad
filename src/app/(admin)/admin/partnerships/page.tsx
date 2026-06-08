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
} from "lucide-react";

type PartnershipRow = {
  id: number;
  name: string;
  logoUrl: string;
  createdBy: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

type PartnershipFormData = {
  name: string;
  logoUrl: string;
};

const EMPTY_FORM: PartnershipFormData = {
  name: "",
  logoUrl: "",
};

const ACCEPTED_IMAGE_TYPES = "image/png, image/jpeg, image/webp, image/jpg";
const MAX_FILE_SIZE_MB = 5;

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) return error.message;
  return fallback;
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
  const sizes = {
    sm: "w-10 h-10",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };
  const imgSizes = {
    sm: 40,
    md: 64,
    lg: 96,
  };

  if (url) {
    return (
      <div
        className={`${sizes[size]} rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center p-2 shrink-0`}
      >
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
    <div
      className={`${sizes[size]} rounded-xl bg-linear-to-br from-[#CB2229] to-rose-400 flex items-center justify-center text-white shrink-0 shadow-sm`}
    >
      <ImageIcon size={size === "lg" ? 28 : size === "md" ? 20 : 14} />
    </div>
  );
}

export default function ManagePartnershipsPage() {
  const [partnerships, setPartnerships] = useState<PartnershipRow[]>([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<PartnershipRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PartnershipRow | null>(null);
  const [form, setForm] = useState<PartnershipFormData>(EMPTY_FORM);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // State untuk file upload & preview
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter partnerships berdasarkan search
  const filteredPartnerships = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return partnerships.filter(
      (p) => !keyword || p.name.toLowerCase().includes(keyword),
    );
  }, [partnerships, search]);

  // Fetch partnerships dari API route
  const fetchPartnerships = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/partnerships", {
        cache: "no-store",
      });
      const result = (await response.json()) as {
        data?: PartnershipRow[];
        error?: string;
      };

      if (!response.ok) {
        throw new Error(result.error || "Gagal memuat data partnership.");
      }

      setPartnerships(result.data ?? []);
    } catch (err) {
      setPartnerships([]);
      setError(getErrorMessage(err, "Gagal memuat data partnership."));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchPartnerships();
  }, []);

  // Cleanup object URL saat komponen unmount atau preview berubah
  useEffect(() => {
    return () => {
      if (logoPreview && logoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview]);

  const resetLogoState = () => {
    if (logoPreview && logoPreview.startsWith("blob:")) {
      URL.revokeObjectURL(logoPreview);
    }
    setLogoFile(null);
    setLogoPreview(null);
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
    if (logoPreview && logoPreview.startsWith("blob:")) {
      URL.revokeObjectURL(logoPreview);
    }

    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
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
    resetLogoState();
    setModalOpen(true);
  };

  const openEdit = (partnership: PartnershipRow) => {
    setError("");
    setSuccess("");
    setEditTarget(partnership);
    setForm({
      name: partnership.name,
      logoUrl: partnership.logoUrl,
    });
    // Reset file state, tapi set preview ke existing logo
    setLogoFile(null);
    setLogoPreview(partnership.logoUrl ?? null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setModalOpen(true);
  };

  const insertPartnership = async (values: PartnershipFormData, file: File | null) => {
    const formData = new FormData();
    formData.append("name", values.name);

    if (file) {
      formData.append("logo", file);
    }

    const response = await fetch("/api/admin/partnerships", {
      method: "POST",
      body: formData,
    });
    const result = (await response.json()) as { error?: string };
    if (!response.ok) throw new Error(result.error || "Gagal menambah partnership.");
    await fetchPartnerships();
  };

  const updatePartnership = async (id: number, values: PartnershipFormData, file: File | null) => {
    const formData = new FormData();
    formData.append("id", String(id));
    formData.append("name", values.name);

    // Kirim existing URL jika tidak mengganti logo
    if (file) {
      formData.append("logo", file);
    } else if (values.logoUrl) {
      formData.append("existingLogoUrl", values.logoUrl);
    }

    const response = await fetch("/api/admin/partnerships", {
      method: "PUT",
      body: formData,
    });
    const result = (await response.json()) as { error?: string };
    if (!response.ok) throw new Error(result.error || "Gagal mengubah partnership.");
    await fetchPartnerships();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setError("Nama Partner wajib diisi.");
      return;
    }

    // Validasi: saat create harus ada file, saat edit boleh pakai existing
    if (!editTarget && !logoFile) {
      setError("Logo partner wajib diupload.");
      return;
    }

    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      if (editTarget) {
        await updatePartnership(editTarget.id, form, logoFile);
        showSuccess("Partnership berhasil diperbarui.");
      } else {
        await insertPartnership(form, logoFile);
        showSuccess("Partnership berhasil ditambahkan.");
      }

      setModalOpen(false);
      setEditTarget(null);
      setForm(EMPTY_FORM);
      resetLogoState();
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
      const response = await fetch(
        `/api/admin/partnerships?id=${deleteTarget.id}`,
        {
          method: "DELETE",
        },
      );
      const result = (await response.json()) as { error?: string };
      if (!response.ok)
        throw new Error(result.error || "Gagal menghapus partnership.");

      setDeleteTarget(null);
      showSuccess("Partnership berhasil dihapus.");
      await fetchPartnerships();
    } catch (err) {
      setError(getErrorMessage(err, "Gagal menghapus data."));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header Info */}
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#CB2229]/10">
            <Handshake size={20} className="text-[#CB2229]" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800">
              Kelola Partnership
            </h2>
            <p className="text-xs text-slate-500">
              Tambah, edit, atau hapus logo partner yang ditampilkan di landing
              page.
            </p>
          </div>
        </div>
      </div>

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
            placeholder="Cari nama partner..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#CB2229]/30 focus:border-[#CB2229]"
          />
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#CB2229] hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
        >
          <Plus size={16} /> Tambah Partner
        </button>
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

      {/* Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {isLoading ? (
          <div className="col-span-full py-16 flex items-center justify-center text-slate-400">
            <Loader2 size={20} className="animate-spin mr-2" />
            Memuat data partnership...
          </div>
        ) : filteredPartnerships.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-400 text-sm bg-white rounded-2xl border border-slate-100">
            {search
              ? "Tidak ada partner yang cocok dengan pencarian."
              : 'Belum ada data partner. Klik "+ Tambah Partner" untuk menambahkan.'}
          </div>
        ) : (
          filteredPartnerships.map((partnership) => (
            <div
              key={`partnership-${partnership.id}`}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col items-center text-center gap-3 hover:shadow-md transition-shadow"
            >
              <LogoDisplay
                name={partnership.name}
                url={partnership.logoUrl}
                size="lg"
              />
              <div className="flex-1">
                <h3 className="font-bold text-slate-800 text-sm leading-snug">
                  {partnership.name}
                </h3>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100 w-full justify-center">
                <button
                  onClick={() => openEdit(partnership)}
                  aria-label={`Edit ${partnership.name}`}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Pencil size={12} /> Edit
                </button>
                <button
                  onClick={() => setDeleteTarget(partnership)}
                  aria-label={`Hapus ${partnership.name}`}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={12} /> Hapus
                </button>
              </div>
            </div>
          ))
        )}
      </div>

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
            className="relative max-h-[92vh] w-full max-w-lg space-y-5 overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  {editTarget ? "Edit Partner" : "Tambah Partner Baru"}
                </h3>
                <p className="text-xs text-slate-400">
                  {editTarget
                    ? "Perbarui informasi partner di bawah."
                    : "Isi informasi partner yang akan ditambahkan."}
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

            {/* Preview Logo - gunakan logoPreview (bisa blob atau existing URL) */}
            <div className="flex justify-center">
              <LogoDisplay name={form.name} url={logoPreview} size="lg" />
            </div>

            <div className="space-y-4">
              {/* Nama Partner */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Nama Partner *
                </label>
                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Contoh: Telkom Indonesia"
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CB2229]/30 focus:border-[#CB2229]"
                  required
                />
              </div>

              {/* ====== LOGO UPLOAD SECTION ====== */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Logo Partner {!editTarget && "*"}
                </label>

                {/* Image Preview */}
                {logoPreview && (
                  <div className="relative mb-3 group">
                    <div className="relative h-36 w-full overflow-hidden rounded-xl border border-slate-200 bg-white flex items-center justify-center p-4">
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
                      onClick={() => {
                        resetLogoState();
                        setForm((f) => ({ ...f, logoUrl: "" }));
                      }}
                      className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white shadow-md transition-all hover:bg-red-600 hover:scale-110"
                      title="Hapus logo"
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
                        {logoPreview
                          ? "Klik untuk ganti logo"
                          : "Klik untuk upload logo"}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-400">
                        PNG, JPEG, WebP • Maks {MAX_FILE_SIZE_MB}MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* ====== END LOGO UPLOAD SECTION ====== */}
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
                    : "Tambah Partner"}
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
              <h3 className="font-bold text-slate-800">Hapus Partner?</h3>
              <p className="mt-1 text-sm text-slate-500">
                {deleteTarget.name}
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
