"use client";

import React, { FormEvent, useEffect, useMemo, useState, useRef } from "react";
import Image from "next/image";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  UserCircle,
  Loader2,
  Eye,
  EyeOff,
  ImagePlus,
} from "lucide-react";
import type { TrainerRow } from "@/types/database";

type TrainerFormData = {
  name: string;
  roleTitle: string;
  photoUrl: string;
  isActive: boolean;
};

const EMPTY_FORM: TrainerFormData = {
  name: "",
  roleTitle: "",
  photoUrl: "",
  isActive: true,
};

const ACCEPTED_IMAGE_TYPES = "image/png, image/jpeg, image/webp, image/jpg";
const MAX_FILE_SIZE_MB = 5;

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) return error.message;
  return fallback;
}

function AvatarDisplay({
  name,
  url,
  size = "md",
}: {
  name: string;
  url: string | null | undefined;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "w-9 h-9 text-sm",
    md: "w-14 h-14 text-lg",
    lg: "w-20 h-20 text-2xl",
  };
  const imgSizes = {
    sm: 36,
    md: 56,
    lg: 80,
  };
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  if (url) {
    return (
      <Image
        src={url}
        alt={name}
        width={imgSizes[size]}
        height={imgSizes[size]}
        className={`${sizes[size]} rounded-full object-cover shrink-0 border-2 border-white shadow`}
        unoptimized
      />
    );
  }

  return (
    <div
      className={`${sizes[size]} rounded-full bg-linear-to-br from-[#CB2229] to-rose-400 flex items-center justify-center text-white font-bold shrink-0 border-2 border-white shadow`}
    >
      {initials || <UserCircle size={20} />}
    </div>
  );
}

export default function ManageTrainersPage() {
  const [trainers, setTrainers] = useState<TrainerRow[]>([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<TrainerRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TrainerRow | null>(null);
  const [form, setForm] = useState<TrainerFormData>(EMPTY_FORM);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // State untuk file upload & preview
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter trainers berdasarkan search
  const filteredTrainers = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return trainers.filter(
      (trainer) =>
        !keyword ||
        trainer.name.toLowerCase().includes(keyword) ||
        (trainer.roleTitle ?? "").toLowerCase().includes(keyword),
    );
  }, [trainers, search]);

  // Fetch trainers dari API route (Drizzle)
  const fetchTrainers = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/trainers", { cache: "no-store" });
      const result = (await response.json()) as {
        data?: TrainerRow[];
        error?: string;
      };

      if (!response.ok) {
        throw new Error(result.error || "Gagal memuat data trainer.");
      }

      setTrainers(result.data ?? []);
    } catch (err) {
      setTrainers([]);
      setError(getErrorMessage(err, "Gagal memuat data trainer."));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchTrainers();
  }, []);

  // Cleanup object URL saat komponen unmount atau preview berubah
  useEffect(() => {
    return () => {
      if (photoPreview && photoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  const resetPhotoState = () => {
    if (photoPreview && photoPreview.startsWith("blob:")) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhotoFile(null);
    setPhotoPreview(null);
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
    if (photoPreview && photoPreview.startsWith("blob:")) {
      URL.revokeObjectURL(photoPreview);
    }

    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
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
    resetPhotoState();
    setModalOpen(true);
  };

  const openEdit = (trainer: TrainerRow) => {
    setError("");
    setSuccess("");
    setEditTarget(trainer);
    setForm({
      name: trainer.name,
      roleTitle: trainer.roleTitle ?? "",
      photoUrl: trainer.photoUrl ?? "",
      isActive: trainer.isActive ?? true,
    });
    // Reset file state, tapi set preview ke existing photo
    setPhotoFile(null);
    setPhotoPreview(trainer.photoUrl ?? null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setModalOpen(true);
  };

  const insertTrainer = async (values: TrainerFormData, file: File | null) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("roleTitle", values.roleTitle ?? "");
    formData.append("isActive", String(values.isActive));

    if (file) {
      formData.append("photo", file);
    }

    const response = await fetch("/api/admin/trainers", {
      method: "POST",
      body: formData,
    });
    const result = (await response.json()) as { error?: string };
    if (!response.ok) throw new Error(result.error || "Gagal menambah trainer.");
    await fetchTrainers();
  };

  const updateTrainer = async (id: number, values: TrainerFormData, file: File | null) => {
    const formData = new FormData();
    formData.append("id", String(id));
    formData.append("name", values.name);
    formData.append("roleTitle", values.roleTitle ?? "");
    formData.append("isActive", String(values.isActive));

    // Kirim existing URL jika tidak mengganti foto
    if (file) {
      formData.append("photo", file);
    } else if (values.photoUrl) {
      formData.append("existingPhotoUrl", values.photoUrl);
    }

    const response = await fetch("/api/admin/trainers", {
      method: "PUT",
      body: formData,
    });
    const result = (await response.json()) as { error?: string };
    if (!response.ok) throw new Error(result.error || "Gagal mengubah trainer.");
    await fetchTrainers();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setError("Nama Lengkap wajib diisi.");
      return;
    }

    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      if (editTarget) {
        await updateTrainer(editTarget.id, form, photoFile);
        showSuccess("Trainer berhasil diperbarui.");
      } else {
        await insertTrainer(form, photoFile);
        showSuccess("Trainer berhasil ditambahkan.");
      }

      setModalOpen(false);
      setEditTarget(null);
      setForm(EMPTY_FORM);
      resetPhotoState();
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
      const response = await fetch(`/api/admin/trainers?id=${deleteTarget.id}`, {
        method: "DELETE",
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || "Gagal menghapus trainer.");

      setDeleteTarget(null);
      showSuccess("Trainer berhasil dihapus.");
      await fetchTrainers();
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
            placeholder="Cari nama atau jabatan..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#CB2229]/30 focus:border-[#CB2229]"
          />
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#CB2229] hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
        >
          <Plus size={16} /> Tambah Trainer
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
            Memuat data trainer...
          </div>
        ) : filteredTrainers.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-400 text-sm bg-white rounded-2xl border border-slate-100">
            {search
              ? "Tidak ada trainer yang cocok dengan pencarian."
              : 'Belum ada data trainer. Klik "+ Tambah Trainer" untuk menambahkan.'}
          </div>
        ) : (
          filteredTrainers.map((trainer) => (
            <div
              key={`trainer-${trainer.id}`}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col items-center text-center gap-3 hover:shadow-md transition-shadow"
            >
              <AvatarDisplay
                name={trainer.name}
                url={trainer.photoUrl}
                size="lg"
              />
              <div className="flex-1">
                <h3 className="font-bold text-slate-800 text-sm leading-snug">
                  {trainer.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {trainer.roleTitle || "—"}
                </p>
              </div>

              {/* Status Badge */}
              <div
                className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full ${
                  trainer.isActive
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {trainer.isActive ? <Eye size={12} /> : <EyeOff size={12} />}
                {trainer.isActive ? "Aktif" : "Nonaktif"}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100 w-full justify-center">
                <button
                  onClick={() => openEdit(trainer)}
                  aria-label={`Edit ${trainer.name}`}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Pencil size={12} /> Edit
                </button>
                <button
                  onClick={() => setDeleteTarget(trainer)}
                  aria-label={`Hapus ${trainer.name}`}
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
            className="relative max-h-[92vh] w-full max-w-2xl space-y-5 overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  {editTarget ? "Edit Trainer" : "Tambah Trainer Baru"}
                </h3>
                <p className="text-xs text-slate-400">
                  {editTarget
                    ? "Perbarui informasi trainer di bawah."
                    : "Isi informasi trainer yang akan ditambahkan."}
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

            {/* Preview Avatar - gunakan photoPreview (bisa blob atau existing URL) */}
            <div className="flex justify-center">
              <AvatarDisplay name={form.name} url={photoPreview} size="lg" />
            </div>

            <div className="space-y-4">
              {/* Nama Lengkap */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Nama Lengkap *
                </label>
                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Contoh: Ahmad Fauzi, S.Kom."
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CB2229]/30 focus:border-[#CB2229]"
                  required
                />
              </div>

              {/* Jabatan / Role */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Jabatan / Role
                </label>
                <input
                  value={form.roleTitle}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, roleTitle: e.target.value }))
                  }
                  placeholder="Contoh: Senior Trainer .id Academy"
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CB2229]/30 focus:border-[#CB2229]"
                />
              </div>

              {/* ====== PHOTO UPLOAD SECTION ====== */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Foto Profil
                </label>

                {/* Image Preview */}
                {photoPreview && (
                  <div className="relative mb-3 group">
                    <div className="relative h-44 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                      <Image
                        src={photoPreview}
                        alt="Preview foto"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        resetPhotoState();
                        setForm((f) => ({ ...f, photoUrl: "" }));
                      }}
                      className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white shadow-md transition-all hover:bg-red-600 hover:scale-110"
                      title="Hapus foto"
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
                        {photoPreview
                          ? "Klik untuk ganti foto"
                          : "Klik untuk upload foto"}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-400">
                        PNG, JPEG, WebP • Maks {MAX_FILE_SIZE_MB}MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* ====== END PHOTO UPLOAD SECTION ====== */}

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
                    : "Tambah Trainer"}
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
              <h3 className="font-bold text-slate-800">Hapus Trainer?</h3>
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
