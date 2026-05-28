"use client";

import React, { FormEvent, useEffect, useMemo, useState } from "react";
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
} from "lucide-react";
// TODO: Import TrainerRow type from new database schema when ready
type TrainerRow = {
  id: number;
  name: string;
  role_title?: string | null;
  photo_url?: string | null;
  is_active: boolean;
};

type TrainerFormData = {
  name: string;
  role_title: string;
  photo_url: string;
  is_active: boolean;
};

const EMPTY_FORM: TrainerFormData = {
  name: "",
  role_title: "",
  photo_url: "",
  is_active: true,
};

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) return error.message;
  return fallback;
}

function isValidImageUrl(url: string): boolean {
  if (!url || !url.trim()) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
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
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  if (url && isValidImageUrl(url)) {
    return (
      <img
        src={url}
        alt={name}
        className={`${sizes[size]} rounded-full object-cover shrink-0 border-2 border-white shadow`}
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

  // Filter trainers berdasarkan search
  const filteredTrainers = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return trainers.filter(
      (trainer) =>
        !keyword ||
        trainer.name.toLowerCase().includes(keyword) ||
        (trainer.role_title ?? "").toLowerCase().includes(keyword),
    );
  }, [trainers, search]);

  // Fetch trainers dari Supabase
  const fetchTrainers = async () => {
    setIsLoading(true);
    setError("");

    try {
      const { data, error: fetchError } = await supabase
        .from("trainers")
        .select("id,name,role_title,photo_url,is_active")
        .order("id", { ascending: false });

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      setTrainers((data ?? []) as TrainerRow[]);
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

  const showSuccess = (message: string) => {
    setSuccess(message);
    window.setTimeout(() => setSuccess(""), 2500);
  };

  const openCreate = () => {
    setError("");
    setSuccess("");
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (trainer: TrainerRow) => {
    setError("");
    setSuccess("");
    setEditTarget(trainer);
    setForm({
      name: trainer.name,
      role_title: trainer.role_title ?? "",
      photo_url: trainer.photo_url ?? "",
      is_active: trainer.is_active,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setError("Nama Lengkap wajib diisi.");
      return;
    }

    if (form.photo_url && !isValidImageUrl(form.photo_url)) {
      setError("URL Foto Profil tidak valid.");
      return;
    }

    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      // Payload hanya berisi: name, role_title, photo_url, is_active
      const payload = {
        name: form.name.trim(),
        role_title: (form.role_title?.trim() || null) as string | null,
        photo_url: (form.photo_url?.trim() || null) as string | null,
        is_active: form.is_active,
      };

      if (editTarget) {
        // UPDATE
        const { error: updateError } = await supabase
          .from("trainers")
          .update(payload)
          .eq("id", editTarget.id);

        if (updateError) {
          throw new Error(updateError.message);
        }

        showSuccess("Trainer berhasil diperbarui.");
      } else {
        // INSERT
        const { error: insertError } = await supabase
          .from("trainers")
          .insert(payload);

        if (insertError) {
          throw new Error(insertError.message);
        }

        showSuccess("Trainer berhasil ditambahkan.");
      }

      setModalOpen(false);
      setEditTarget(null);
      setForm(EMPTY_FORM);
      await fetchTrainers();
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
      const { error: deleteError } = await supabase
        .from("trainers")
        .delete()
        .eq("id", deleteTarget.id);

      if (deleteError) {
        throw new Error(deleteError.message);
      }

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
                url={trainer.photo_url}
                size="lg"
              />
              <div className="flex-1">
                <h3 className="font-bold text-slate-800 text-sm leading-snug">
                  {trainer.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {trainer.role_title || "—"}
                </p>
              </div>

              {/* Status Badge */}
              <div
                className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full ${
                  trainer.is_active
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {trainer.is_active ? <Eye size={12} /> : <EyeOff size={12} />}
                {trainer.is_active ? "Aktif" : "Nonaktif"}
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

            {/* Preview Avatar */}
            <div className="flex justify-center">
              <AvatarDisplay name={form.name} url={form.photo_url} size="lg" />
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
                  value={form.role_title}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, role_title: e.target.value }))
                  }
                  placeholder="Contoh: Senior Trainer .id Academy"
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CB2229]/30 focus:border-[#CB2229]"
                />
              </div>

              {/* URL Foto Profil */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  URL Foto Profil
                </label>
                <input
                  type="url"
                  value={form.photo_url}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, photo_url: e.target.value }))
                  }
                  placeholder="https://... (kosongkan untuk avatar inisial)"
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CB2229]/30 focus:border-[#CB2229]"
                />
                {form.photo_url && isValidImageUrl(form.photo_url) && (
                  <div className="mt-2 flex justify-center rounded-xl bg-slate-50 p-3">
                    <img
                      src={form.photo_url}
                      alt="Preview"
                      className="max-h-40 max-w-full rounded-lg object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Status Aktif */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Status Tayang
                </label>
                <label className="flex min-h-10 items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5">
                  <span className="text-sm font-semibold text-slate-700">
                    {form.is_active ? "Aktif" : "Nonaktif"}
                  </span>
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        is_active: e.target.checked,
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
                {editTarget ? "Simpan Perubahan" : "Tambah Trainer"}
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
