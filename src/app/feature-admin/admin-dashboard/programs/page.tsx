"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  Eye,
  EyeOff,
  ImageIcon,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import type { ProgramRow, ProgramKategori } from "@/types/database";
import { supabase } from "@/utils/supabase/client";

type CategoryFilter = "all" | ProgramKategori;

type ProgramPhotoForm = {
  kategori: ProgramKategori;
  title: string;
  image_url: string;
  is_active: boolean;
};

const KATEGORI_OPTIONS: Array<{
  value: ProgramKategori;
  label: string;
  color: string;
}> = [
  {
    value: "training-of-trainer",
    label: "Training of Trainer",
    color: "bg-green-50 text-green-700",
  },
  { value: "seminar", label: "Seminar", color: "bg-blue-50 text-blue-700" },
  { value: "workshop", label: "Workshop", color: "bg-amber-50 text-amber-700" },
  {
    value: "partnership",
    label: "Partnership",
    color: "bg-purple-50 text-purple-700",
  },
];

const EMPTY_FORM: ProgramPhotoForm = {
  kategori: "training-of-trainer",
  title: "",
  image_url: "",
  is_active: true,
};

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

function isValidImageUrl(url: string): boolean {
  if (!url.trim()) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export default function ManageProgramsPage() {
  const [items, setItems] = useState<ProgramRow[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ProgramRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ProgramRow | null>(null);
  const [form, setForm] = useState<ProgramPhotoForm>(EMPTY_FORM);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const filteredItems = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return items.filter((item) => {
      const matchesSearch =
        !keyword ||
        item.title.toLowerCase().includes(keyword) ||
        (item.image_url ?? "").toLowerCase().includes(keyword);
      const matchesCategory =
        categoryFilter === "all" || item.kategori === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [categoryFilter, items, search]);

  const fetchItems = async () => {
    setIsLoading(true);
    setError("");

    try {
      const { data, error: fetchError } = await supabase
        .from("programs")
        .select("id,title,kategori,image_url,is_active")
        .order("id", { ascending: false });

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      setItems((data ?? []) as ProgramRow[]);
    } catch (fetchError) {
      setItems([]);
      setError(getErrorMessage(fetchError, "Gagal memuat data program."));
    }

    setIsLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchItems();
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

  const openEdit = (row: ProgramRow) => {
    setError("");
    setSuccess("");
    setEditTarget(row);
    setForm({
      kategori: row.kategori,
      title: row.title,
      image_url: row.image_url ?? "",
      is_active: row.is_active,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.title.trim()) {
      setError("Label/Nama Foto wajib diisi.");
      return;
    }

    if (!form.image_url.trim() || !isValidImageUrl(form.image_url)) {
      setError("URL Gambar wajib diisi dan valid.");
      return;
    }

    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        title: form.title.trim(),
        kategori: form.kategori,
        image_url: form.image_url.trim(),
        is_active: form.is_active,
      };

      if (editTarget) {
        // UPDATE
        const { error: updateError } = await supabase
          .from("programs")
          .update(payload)
          .eq("id", editTarget.id);

        if (updateError) {
          throw new Error(updateError.message);
        }

        showSuccess("Foto program berhasil diperbarui.");
      } else {
        // INSERT - Auto-generate slug dengan kombinasi kategori + timestamp
        const generatedSlug = `${form.kategori}-${Date.now()}`;
        const insertPayload = {
          ...payload,
          slug: generatedSlug,
        };

        const { error: insertError } = await supabase
          .from("programs")
          .insert(insertPayload);

        if (insertError) {
          throw new Error(insertError.message);
        }

        showSuccess("Foto program berhasil ditambahkan.");
      }

      setModalOpen(false);
      setEditTarget(null);
      setForm(EMPTY_FORM);
      await fetchItems();
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
      const { error: deleteError } = await supabase
        .from("programs")
        .delete()
        .eq("id", deleteTarget.id);

      if (deleteError) {
        throw new Error(deleteError.message);
      }

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
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cari label/nama..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm focus:border-[#CB2229] focus:outline-none focus:ring-2 focus:ring-[#CB2229]/30"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(event) =>
            setCategoryFilter(event.target.value as CategoryFilter)
          }
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:border-[#CB2229] focus:outline-none focus:ring-2 focus:ring-[#CB2229]/30 lg:w-56"
        >
          <option value="all">Semua Program</option>
          {KATEGORI_OPTIONS.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>

        <button
          onClick={openCreate}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#CB2229] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700"
        >
          <Plus size={16} /> Tambah Foto
        </button>
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

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h2 className="font-bold text-slate-800">Manajemen Foto Program</h2>
            <p className="text-xs text-slate-400">
              Kelola foto kegiatan dengan kategori, URL gambar, dan status
              aktif.
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
                <th className="px-6 py-3">URL</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 text-center text-sm text-slate-400"
                  >
                    <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" />
                    Memuat data program dan partner...
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 text-center text-sm text-slate-400"
                  >
                    Memuat data program...
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
                        <div className="flex h-10 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100">
                          {item.image_url && isValidImageUrl(item.image_url) ? (
                            <img
                              src={item.image_url}
                              alt={item.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <ImageIcon size={18} className="text-slate-400" />
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
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${category.color}`}
                        >
                          {category.label}
                        </span>
                      </td>
                      <td className="max-w-md px-6 py-4">
                        <p className="truncate text-xs text-slate-500">
                          {item.image_url || "-"}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${item.is_active ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}
                        >
                          {item.is_active ? (
                            <Eye size={12} />
                          ) : (
                            <EyeOff size={12} />
                          )}
                          {item.is_active ? "Aktif" : "Nonaktif"}
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
                    {form.is_active ? "Aktif" : "Nonaktif"}
                  </span>
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        is_active: event.target.checked,
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

              <div className="md:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  URL Gambar *
                </label>
                <input
                  type="url"
                  value={form.image_url}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      image_url: event.target.value,
                    }))
                  }
                  required
                  placeholder="https://..."
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-[#CB2229] focus:outline-none focus:ring-2 focus:ring-[#CB2229]/30"
                />
                {form.image_url && isValidImageUrl(form.image_url) && (
                  <div className="mt-2 flex justify-center rounded-xl bg-slate-50 p-3">
                    <img
                      src={form.image_url}
                      alt="Preview"
                      className="max-h-40 max-w-full rounded-lg object-cover"
                    />
                  </div>
                )}
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
                {editTarget ? "Simpan Perubahan" : "Tambah"}
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
