"use client";

import React, { FormEvent, useEffect, useMemo, useState } from "react";
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
} from "lucide-react";
// TODO: Import MaterialRow type from new database schema when ready
type MaterialRow = {
  id: number;
  title: string;
  description?: string | null;
  link_url?: string | null;
  cover_url?: string | null;
  is_active: boolean;
};

type MaterialFormData = {
  title: string;
  description: string;
  link_url: string;
  cover_url: string;
  is_active: boolean;
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
  link_url: "",
  cover_url: "",
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

  // Filter materials berdasarkan search
  const filteredMaterials = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return materials.filter(
      (material) => !keyword || material.title.toLowerCase().includes(keyword),
    );
  }, [materials, search]);

  // Fetch materials dari Supabase
  const fetchMaterials = async () => {
    setIsLoading(true);
    setError("");

    try {
      const { data, error: fetchError } = await supabase
        .from("materials")
        .select("id,title,description,link_url,cover_url,is_active")
        .order("id", { ascending: false });

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      setMaterials((data as MaterialRow[]) ?? []);
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

  const openEdit = (material: MaterialRow) => {
    setError("");
    setSuccess("");
    setEditTarget(material);
    setForm({
      title: material.title,
      description: material.description ?? "",
      link_url: material.link_url ?? "",
      cover_url: material.cover_url ?? "",
      is_active: material.is_active,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.title.trim()) {
      setError("Judul Materi wajib diisi.");
      return;
    }

    if (form.link_url && !isValidImageUrl(form.link_url)) {
      setError("Link Aksi harus berupa URL yang valid.");
      return;
    }

    if (form.cover_url && !isValidImageUrl(form.cover_url)) {
      setError("URL Cover harus berupa URL yang valid.");
      return;
    }

    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      // Payload: title, description, link_url, cover_url, is_active
      const payload = {
        title: form.title.trim(),
        description: (form.description?.trim() || null) as string | null,
        link_url: (form.link_url?.trim() || null) as string | null,
        cover_url: (form.cover_url?.trim() || null) as string | null,
        is_active: form.is_active,
      };

      if (editTarget) {
        // UPDATE
        const { error: updateError } = await supabase
          .from("materials")
          .update(payload)
          .eq("id", editTarget.id);

        if (updateError) {
          throw new Error(updateError.message);
        }

        showSuccess("Materi berhasil diperbarui.");
      } else {
        // INSERT
        const { error: insertError } = await supabase
          .from("materials")
          .insert(payload);

        if (insertError) {
          throw new Error(insertError.message);
        }

        showSuccess("Materi berhasil ditambahkan.");
      }

      setModalOpen(false);
      setEditTarget(null);
      setForm(EMPTY_FORM);
      await fetchMaterials();
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
        .from("materials")
        .delete()
        .eq("id", deleteTarget.id);

      if (deleteError) {
        throw new Error(deleteError.message);
      }

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
            filteredMaterials.map((mat, idx) => (
              <div
                key={`material-${mat.id}`}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow"
              >
                {/* Cover Area */}
                <div
                  className={`h-36 bg-linear-to-br ${COVER_GRADIENTS[mat.id % COVER_GRADIENTS.length]} flex items-center justify-center relative overflow-hidden`}
                >
                  {mat.cover_url && isValidImageUrl(mat.cover_url) ? (
                    <img
                      src={mat.cover_url}
                      alt={mat.title}
                      className="w-full h-full object-cover"
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
                      {mat.link_url ? (
                        <a
                          href={mat.link_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-[#CB2229] hover:underline font-medium truncate max-w-[150px]"
                          title={mat.link_url}
                        >
                          <ExternalLink size={12} className="shrink-0" />
                          <span className="truncate">{mat.link_url}</span>
                        </a>
                      ) : (
                        <span className="text-xs text-slate-300">—</span>
                      )}
                    </div>

                    {/* Right Column - Status Badge */}
                    <div className="flex justify-end">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full ${
                          mat.is_active
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {mat.is_active ? (
                          <Eye size={11} />
                        ) : (
                          <EyeOff size={11} />
                        )}
                        {mat.is_active ? "Aktif" : "Nonaktif"}
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
                      colSpan={5}
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
                      colSpan={5}
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
                      <td className="px-6 py-4 text-sm font-medium text-slate-800 max-w-xs">
                        <p className="truncate">{mat.title}</p>
                      </td>
                      <td className="px-6 py-4">
                        {mat.link_url ? (
                          <a
                            href={mat.link_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-[#CB2229] hover:underline font-medium max-w-50 truncate"
                          >
                            <ExternalLink size={11} className="shrink-0" />
                            <span className="truncate">{mat.link_url}</span>
                          </a>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${
                            mat.is_active
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {mat.is_active ? (
                            <Eye size={10} />
                          ) : (
                            <EyeOff size={10} />
                          )}
                          {mat.is_active ? "Aktif" : "Nonaktif"}
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

            {/* Preview Cover */}
            {form.cover_url && isValidImageUrl(form.cover_url) ? (
              <div className="flex justify-center rounded-xl bg-slate-50 p-3">
                <img
                  src={form.cover_url}
                  alt="Preview"
                  className="max-h-40 max-w-full rounded-lg object-cover"
                />
              </div>
            ) : (
              <div
                className={`h-32 bg-linear-to-br ${COVER_GRADIENTS[Math.floor(Math.random() * COVER_GRADIENTS.length)]} rounded-xl flex items-center justify-center`}
              >
                <BookOpen size={40} className="text-white/50" />
              </div>
            )}

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
                  value={form.link_url}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, link_url: e.target.value }))
                  }
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CB2229]/30 focus:border-[#CB2229]"
                />
              </div>

              {/* URL Cover */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  URL Cover (opsional)
                </label>
                <input
                  type="url"
                  value={form.cover_url}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, cover_url: e.target.value }))
                  }
                  placeholder="https://... (kosongkan untuk gradient)"
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CB2229]/30 focus:border-[#CB2229]"
                />
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
                {editTarget ? "Simpan Perubahan" : "Tambah Materi"}
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
