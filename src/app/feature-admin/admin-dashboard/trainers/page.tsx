"use client";

import React, { useState } from "react";
import { Plus, Search, Pencil, Trash2, X, UserCircle } from "lucide-react";

type Trainer = {
  id: number;
  trainerName: string;
  trainerRole: string;
  imageUrl: string;
};

const INITIAL_DATA: Trainer[] = [
  { id: 1, trainerName: "Ahmad Fauzi, S.Kom.", trainerRole: "Senior Trainer .id Academy", imageUrl: "" },
  { id: 2, trainerName: "Dr. Rina Kartika, M.T.", trainerRole: "Pakar Keamanan Siber", imageUrl: "" },
  { id: 3, trainerName: "Budi Santoso, M.Kom.", trainerRole: "Trainer Digital Marketing", imageUrl: "" },
  { id: 4, trainerName: "Siti Rahma, S.T.", trainerRole: "Trainer DNS & Domain Management", imageUrl: "" },
  { id: 5, trainerName: "Dian Pratama, M.M.", trainerRole: "Trainer Transformasi Digital UMKM", imageUrl: "" },
  { id: 6, trainerName: "Reza Mahendra, S.Kom.", trainerRole: "Trainer Web Development", imageUrl: "" },
];

const EMPTY_FORM: Omit<Trainer, "id"> = {
  trainerName: "",
  trainerRole: "",
  imageUrl: "",
};

function AvatarDisplay({ name, url, size = "md" }: { name: string; url: string; size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "w-9 h-9 text-sm", md: "w-14 h-14 text-lg", lg: "w-20 h-20 text-2xl" };
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  if (url) {
    return (
      <img
        src={url}
        alt={name}
        className={`${sizes[size]} rounded-full object-cover flex-shrink-0 border-2 border-white shadow`}
      />
    );
  }
  return (
    <div
      className={`${sizes[size]} rounded-full bg-gradient-to-br from-[#CB2229] to-rose-400 flex items-center justify-center text-white font-bold flex-shrink-0 border-2 border-white shadow`}
    >
      {initials || <UserCircle size={20} />}
    </div>
  );
}

export default function ManageTrainersPage() {
  const [data, setData] = useState<Trainer[]>(INITIAL_DATA);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Trainer | null>(null);
  const [form, setForm] = useState<Omit<Trainer, "id">>(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const filtered = data.filter(
    (t) =>
      t.trainerName.toLowerCase().includes(search.toLowerCase()) ||
      t.trainerRole.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (row: Trainer) => {
    setEditTarget(row);
    setForm({ trainerName: row.trainerName, trainerRole: row.trainerRole, imageUrl: row.imageUrl });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.trainerName.trim()) return;
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
            placeholder="Cari trainer..."
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

      {/* Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-400 text-sm bg-white rounded-2xl border border-slate-100">
            Tidak ada data ditemukan.
          </div>
        ) : (
          filtered.map((trainer) => (
            <div
              key={trainer.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col items-center text-center gap-3 hover:shadow-md transition-shadow"
            >
              <AvatarDisplay name={trainer.trainerName} url={trainer.imageUrl} size="lg" />
              <div>
                <h3 className="font-bold text-slate-800 text-sm leading-snug">{trainer.trainerName}</h3>
                <p className="text-xs text-slate-500 mt-1">{trainer.trainerRole}</p>
              </div>
              <div className="flex items-center gap-2 mt-auto pt-2 border-t border-slate-100 w-full justify-center">
                <button
                  onClick={() => openEdit(trainer)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Pencil size={12} /> Edit
                </button>
                <button
                  onClick={() => setDeleteId(trainer.id)}
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
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">
                {editTarget ? "Edit Trainer" : "Tambah Trainer Baru"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
                <X size={18} />
              </button>
            </div>

            {/* Preview Avatar */}
            <div className="flex justify-center">
              <AvatarDisplay name={form.trainerName} url={form.imageUrl} size="lg" />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Nama Lengkap *</label>
                <input
                  value={form.trainerName}
                  onChange={(e) => setForm((f) => ({ ...f, trainerName: e.target.value }))}
                  placeholder="Nama beserta gelar..."
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CB2229]/30 focus:border-[#CB2229]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Jabatan / Role</label>
                <input
                  value={form.trainerRole}
                  onChange={(e) => setForm((f) => ({ ...f, trainerRole: e.target.value }))}
                  placeholder="Jabatan/deskripsi trainer..."
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CB2229]/30 focus:border-[#CB2229]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">URL Foto Profil</label>
                <input
                  value={form.imageUrl}
                  onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                  placeholder="https://... (kosongkan untuk avatar inisial)"
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CB2229]/30 focus:border-[#CB2229]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                Batal
              </button>
              <button onClick={handleSave} className="px-5 py-2 text-sm font-semibold bg-[#CB2229] hover:bg-red-700 text-white rounded-xl transition-colors">
                {editTarget ? "Simpan Perubahan" : "Tambah Trainer"}
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
              <h3 className="font-bold text-slate-800">Hapus Trainer?</h3>
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
