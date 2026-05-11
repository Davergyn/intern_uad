"use client";

import React, { useState } from "react";
import { Plus, Search, Pencil, Trash2, X, PlusCircle, MinusCircle } from "lucide-react";

type ProgramCategory = "Training of Trainer" | "Kuliah Umum" | "Workshop" | "Partnership";

type Program = {
  id: number;
  programCategory: ProgramCategory;
  title: string;
  description: string;
  image1_url: string;
  image2_url: string;
  benefits: string[];
};

const INITIAL_DATA: Program[] = [
  {
    id: 1,
    programCategory: "Training of Trainer",
    title: "Training of Trainer .id Academy",
    description: "Program pelatihan untuk menghasilkan trainer berkualitas yang mampu mendidik masyarakat tentang ekosistem digital Indonesia.",
    image1_url: "https://placehold.co/400x300",
    image2_url: "https://placehold.co/400x300",
    benefits: ["Memahami konsep domain .id secara mendalam", "Mampu melatih peserta lain", "Mendapatkan sertifikasi resmi PANDI"],
  },
  {
    id: 2,
    programCategory: "Kuliah Umum",
    title: "Kuliah Umum Kedaulatan Digital",
    description: "Sesi kuliah umum yang membahas pentingnya kedaulatan digital dan peran domain .id dalam ekosistem internet Indonesia.",
    image1_url: "https://placehold.co/400x300",
    image2_url: "https://placehold.co/400x300",
    benefits: ["Wawasan luas tentang internet Indonesia", "Networking dengan profesional digital", "Sertifikat partisipasi"],
  },
  {
    id: 3,
    programCategory: "Workshop",
    title: "Workshop Pembuatan Website dengan Domain .id",
    description: "Workshop hands-on untuk membangun website profesional menggunakan domain .id.",
    image1_url: "https://placehold.co/400x300",
    image2_url: "https://placehold.co/400x300",
    benefits: ["Praktik langsung membuat website", "Mendapatkan domain .id gratis", "Mentoring dari praktisi"],
  },
];

const CATEGORY_COLOR: Record<ProgramCategory, string> = {
  "Training of Trainer": "bg-green-50 text-green-700",
  "Kuliah Umum": "bg-blue-50 text-blue-700",
  "Workshop": "bg-amber-50 text-amber-700",
  "Partnership": "bg-purple-50 text-purple-700",
};

const EMPTY_FORM: Omit<Program, "id"> = {
  programCategory: "Training of Trainer",
  title: "",
  description: "",
  image1_url: "",
  image2_url: "",
  benefits: [""],
};

export default function ManageProgramsPage() {
  const [data, setData] = useState<Program[]>(INITIAL_DATA);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Program | null>(null);
  const [form, setForm] = useState<Omit<Program, "id">>(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const filtered = data.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.programCategory.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditTarget(null);
    setForm({ ...EMPTY_FORM, benefits: [""] });
    setModalOpen(true);
  };

  const openEdit = (row: Program) => {
    setEditTarget(row);
    setForm({
      programCategory: row.programCategory,
      title: row.title,
      description: row.description,
      image1_url: row.image1_url,
      image2_url: row.image2_url,
      benefits: [...row.benefits],
    });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.title.trim()) return;
    const cleanedBenefits = form.benefits.filter((b) => b.trim());
    if (editTarget) {
      setData((prev) =>
        prev.map((r) => (r.id === editTarget.id ? { ...r, ...form, benefits: cleanedBenefits } : r))
      );
    } else {
      const newId = Math.max(0, ...data.map((d) => d.id)) + 1;
      setData((prev) => [...prev, { id: newId, ...form, benefits: cleanedBenefits }]);
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (deleteId == null) return;
    setData((prev) => prev.filter((r) => r.id !== deleteId));
    setDeleteId(null);
  };

  const updateBenefit = (idx: number, val: string) => {
    setForm((f) => {
      const b = [...f.benefits];
      b[idx] = val;
      return { ...f, benefits: b };
    });
  };

  const addBenefit = () => setForm((f) => ({ ...f, benefits: [...f.benefits, ""] }));
  const removeBenefit = (idx: number) =>
    setForm((f) => ({ ...f, benefits: f.benefits.filter((_, i) => i !== idx) }));

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari program..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#CB2229]/30 focus:border-[#CB2229]"
          />
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#CB2229] hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
        >
          <Plus size={16} /> Tambah Program
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-400 text-sm bg-white rounded-2xl border border-slate-100">
            Tidak ada data ditemukan.
          </div>
        ) : (
          filtered.map((prog) => (
            <div key={prog.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
              <div className="p-5 flex-1">
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold mb-3 ${CATEGORY_COLOR[prog.programCategory]}`}>
                  {prog.programCategory}
                </span>
                <h3 className="font-bold text-slate-800 text-base leading-snug mb-2">{prog.title}</h3>
                <p className="text-sm text-slate-500 line-clamp-3">{prog.description}</p>
                {prog.benefits.length > 0 && (
                  <ul className="mt-3 space-y-1">
                    {prog.benefits.slice(0, 2).map((b, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs text-slate-600">
                        <span className="text-[#CB2229] mt-0.5">•</span> {b}
                      </li>
                    ))}
                    {prog.benefits.length > 2 && (
                      <li className="text-xs text-slate-400">+{prog.benefits.length - 2} lainnya</li>
                    )}
                  </ul>
                )}
              </div>
              <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => openEdit(prog)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Pencil size={13} /> Edit
                </button>
                <button
                  onClick={() => setDeleteId(prog.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={13} /> Hapus
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
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between sticky top-0 bg-white pb-2 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">
                {editTarget ? "Edit Program" : "Tambah Program Baru"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Kategori</label>
                <select
                  value={form.programCategory}
                  onChange={(e) => setForm((f) => ({ ...f, programCategory: e.target.value as ProgramCategory }))}
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CB2229]/30 focus:border-[#CB2229] bg-white"
                >
                  {["Training of Trainer", "Kuliah Umum", "Workshop", "Partnership"].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Judul *</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Judul program..."
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CB2229]/30 focus:border-[#CB2229]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Deskripsi</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Penjelasan program..."
                  rows={3}
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CB2229]/30 focus:border-[#CB2229] resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">URL Gambar 1</label>
                  <input
                    value={form.image1_url}
                    onChange={(e) => setForm((f) => ({ ...f, image1_url: e.target.value }))}
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CB2229]/30 focus:border-[#CB2229]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">URL Gambar 2</label>
                  <input
                    value={form.image2_url}
                    onChange={(e) => setForm((f) => ({ ...f, image2_url: e.target.value }))}
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CB2229]/30 focus:border-[#CB2229]"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-600">Manfaat / Benefits</label>
                  <button onClick={addBenefit} className="flex items-center gap-1 text-xs text-[#CB2229] hover:underline">
                    <PlusCircle size={13} /> Tambah
                  </button>
                </div>
                <div className="space-y-2">
                  {form.benefits.map((b, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input
                        value={b}
                        onChange={(e) => updateBenefit(i, e.target.value)}
                        placeholder={`Manfaat ${i + 1}...`}
                        className="flex-1 px-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CB2229]/30 focus:border-[#CB2229]"
                      />
                      {form.benefits.length > 1 && (
                        <button onClick={() => removeBenefit(i)} className="text-slate-400 hover:text-red-500 transition-colors">
                          <MinusCircle size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                Batal
              </button>
              <button onClick={handleSave} className="px-5 py-2 text-sm font-semibold bg-[#CB2229] hover:bg-red-700 text-white rounded-xl transition-colors">
                {editTarget ? "Simpan Perubahan" : "Tambah Program"}
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
              <h3 className="font-bold text-slate-800">Hapus Program?</h3>
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
