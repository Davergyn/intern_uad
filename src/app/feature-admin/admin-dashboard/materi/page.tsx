"use client";

import React, { useState } from "react";
import { Plus, Search, Pencil, Trash2, X, ExternalLink, BookOpen } from "lucide-react";

type Materi = {
  id: number;
  materiTitle: string;
  actionLink: string;
  coverUrl: string;
};

const INITIAL_DATA: Materi[] = [
  { id: 1, materiTitle: "Transformasi Digital di Era Society 5.0", actionLink: "https://example.com/materi-1", coverUrl: "" },
  { id: 2, materiTitle: "Panduan Lengkap Registrasi Domain .id", actionLink: "https://example.com/materi-2", coverUrl: "" },
  { id: 3, materiTitle: "Keamanan Siber untuk UMKM Indonesia", actionLink: "https://example.com/materi-3", coverUrl: "" },
  { id: 4, materiTitle: "DNS Management & Konfigurasi Dasar", actionLink: "https://example.com/materi-4", coverUrl: "" },
  { id: 5, materiTitle: "Personal Branding Digital di Era Modern", actionLink: "https://example.com/materi-5", coverUrl: "" },
  { id: 6, materiTitle: "E-Commerce dengan Domain .id Terpercaya", actionLink: "https://example.com/materi-6", coverUrl: "" },
];

const COVER_GRADIENTS = [
  "from-blue-400 to-blue-600",
  "from-purple-400 to-purple-600",
  "from-emerald-400 to-emerald-600",
  "from-amber-400 to-orange-500",
  "from-rose-400 to-red-600",
  "from-indigo-400 to-indigo-600",
];

const EMPTY_FORM: Omit<Materi, "id"> = {
  materiTitle: "",
  actionLink: "",
  coverUrl: "",
};

export default function ManageMateriPage() {
  const [data, setData] = useState<Materi[]>(INITIAL_DATA);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Materi | null>(null);
  const [form, setForm] = useState<Omit<Materi, "id">>(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const filtered = data.filter((m) =>
    m.materiTitle.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (row: Materi) => {
    setEditTarget(row);
    setForm({ materiTitle: row.materiTitle, actionLink: row.actionLink, coverUrl: row.coverUrl });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.materiTitle.trim()) return;
    if (editTarget) {
      setData((prev) => prev.map((r) => (r.id === editTarget.id ? { ...r, ...form } : r)));
    } else {
      const newId = Math.max(0, ...data.map((d) => d.id)) + 1;
      setData((prev) => [...prev, { id: newId, ...form }]);
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (deleteId == null) return;
    setData((prev) => prev.filter((r) => r.id !== deleteId));
    setDeleteId(null);
  };

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari materi..."
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

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.length === 0 ? (
            <div className="col-span-full py-16 text-center text-slate-400 text-sm bg-white rounded-2xl border border-slate-100">
              Tidak ada data ditemukan.
            </div>
          ) : (
            filtered.map((mat, idx) => (
              <div key={mat.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                {/* Cover */}
                <div className={`h-36 bg-gradient-to-br ${COVER_GRADIENTS[idx % COVER_GRADIENTS.length]} flex items-center justify-center relative overflow-hidden`}>
                  {mat.coverUrl ? (
                    <img src={mat.coverUrl} alt={mat.materiTitle} className="w-full h-full object-cover" />
                  ) : (
                    <BookOpen size={40} className="text-white/50" />
                  )}
                  <div className="absolute inset-0 bg-black/10" />
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-bold text-slate-800 text-sm leading-snug flex-1">{mat.materiTitle}</h3>
                  {mat.actionLink && (
                    <a
                      href={mat.actionLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 flex items-center gap-1 text-[11px] text-[#CB2229] hover:underline font-medium truncate"
                    >
                      <ExternalLink size={11} />
                      <span className="truncate">{mat.actionLink}</span>
                    </a>
                  )}
                </div>
                <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button onClick={() => openEdit(mat)} className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Pencil size={12} /> Edit
                  </button>
                  <button onClick={() => setDeleteId(mat.id)} className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
            <span className="text-xs text-slate-400">{filtered.length} data</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                  <th className="px-6 py-3">No</th>
                  <th className="px-6 py-3">Judul Materi</th>
                  <th className="px-6 py-3">Link</th>
                  <th className="px-6 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-slate-400 text-sm">Tidak ada data ditemukan.</td>
                  </tr>
                ) : (
                  filtered.map((mat, idx) => (
                    <tr key={mat.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-slate-500">{idx + 1}</td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-800 max-w-xs">
                        <p className="truncate">{mat.materiTitle}</p>
                      </td>
                      <td className="px-6 py-4">
                        {mat.actionLink ? (
                          <a href={mat.actionLink} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-[#CB2229] hover:underline font-medium max-w-[200px] truncate">
                            <ExternalLink size={11} className="flex-shrink-0" />
                            <span className="truncate">{mat.actionLink}</span>
                          </a>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEdit(mat)} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                            <Pencil size={15} />
                          </button>
                          <button onClick={() => setDeleteId(mat.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
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
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">
                {editTarget ? "Edit Materi" : "Tambah Materi Baru"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Judul Materi *</label>
                <input
                  value={form.materiTitle}
                  onChange={(e) => setForm((f) => ({ ...f, materiTitle: e.target.value }))}
                  placeholder="Judul modul/buku..."
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CB2229]/30 focus:border-[#CB2229]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Link Aksi (KLIK UNTUK LIHAT)</label>
                <input
                  value={form.actionLink}
                  onChange={(e) => setForm((f) => ({ ...f, actionLink: e.target.value }))}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CB2229]/30 focus:border-[#CB2229]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">URL Cover (opsional)</label>
                <input
                  value={form.coverUrl}
                  onChange={(e) => setForm((f) => ({ ...f, coverUrl: e.target.value }))}
                  placeholder="https://... (kosongkan untuk gradient)"
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CB2229]/30 focus:border-[#CB2229]"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Batal</button>
              <button onClick={handleSave} className="px-5 py-2 text-sm font-semibold bg-[#CB2229] hover:bg-red-700 text-white rounded-xl transition-colors">
                {editTarget ? "Simpan Perubahan" : "Tambah Materi"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId != null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center space-y-4">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <Trash2 size={24} className="text-[#CB2229]" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Hapus Materi?</h3>
              <p className="text-sm text-slate-500 mt-1">Data yang dihapus tidak dapat dikembalikan.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2 text-sm font-medium border border-slate-200 rounded-xl hover:bg-slate-50">Batal</button>
              <button onClick={handleDelete} className="flex-1 py-2 text-sm font-semibold bg-[#CB2229] hover:bg-red-700 text-white rounded-xl">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
