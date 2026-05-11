"use client";

import React, { useState } from "react";
import { Plus, Search, Pencil, Trash2, X } from "lucide-react";

type EventType = "Webinar" | "Workshop" | "Seminar" | "Training";
type DeliveryMode = "Online" | "Face to Face";

type EventRow = {
  id: number;
  eventName: string;
  eventType: EventType;
  eventDate: string;
  deliveryMode: DeliveryMode;
};

const INITIAL_DATA: EventRow[] = [
  { id: 1, eventName: "Transformasi Digital UMKM dengan Domain .id", eventType: "Webinar", eventDate: "12 Januari 2025", deliveryMode: "Online" },
  { id: 2, eventName: "Cara Membuat Website Profesional Menggunakan Domain .id", eventType: "Workshop", eventDate: "20 Februari 2025", deliveryMode: "Face to Face" },
  { id: 3, eventName: "Kedaulatan Digital Indonesia di Era Internet 5.0", eventType: "Seminar", eventDate: "5 Maret 2025", deliveryMode: "Online" },
  { id: 4, eventName: "Training of Trainer Batch 3 – Literasi Digital Nasional", eventType: "Training", eventDate: "18 Maret 2025", deliveryMode: "Face to Face" },
  { id: 5, eventName: "Keamanan Siber: Lindungi Identitas Digital Anda", eventType: "Webinar", eventDate: "2 April 2025", deliveryMode: "Online" },
  { id: 6, eventName: "DNS Management & Konfigurasi Domain .id untuk Pemula", eventType: "Workshop", eventDate: "14 April 2025", deliveryMode: "Face to Face" },
];

const TYPE_COLOR: Record<EventType, string> = {
  Webinar: "bg-blue-50 text-blue-600",
  Workshop: "bg-amber-50 text-amber-600",
  Seminar: "bg-purple-50 text-purple-600",
  Training: "bg-green-50 text-green-600",
};

const EMPTY_FORM: Omit<EventRow, "id"> = {
  eventName: "",
  eventType: "Webinar",
  eventDate: "",
  deliveryMode: "Online",
};

export default function ManageEventsPage() {
  const [data, setData] = useState<EventRow[]>(INITIAL_DATA);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<EventRow | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const filtered = data.filter(
    (e) =>
      e.eventName.toLowerCase().includes(search.toLowerCase()) ||
      e.eventType.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (row: EventRow) => {
    setEditTarget(row);
    setForm({ eventName: row.eventName, eventType: row.eventType, eventDate: row.eventDate, deliveryMode: row.deliveryMode });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.eventName.trim() || !form.eventDate.trim()) return;
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
            placeholder="Cari event..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#CB2229]/30 focus:border-[#CB2229]"
          />
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#CB2229] hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
        >
          <Plus size={16} /> Tambah Event
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-800">Daftar Events</h2>
          <span className="text-xs text-slate-400">{filtered.length} data</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                <th className="px-6 py-3">No</th>
                <th className="px-6 py-3">Nama Event</th>
                <th className="px-6 py-3">Tipe</th>
                <th className="px-6 py-3">Tanggal</th>
                <th className="px-6 py-3">Metode</th>
                <th className="px-6 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-sm">
                    Tidak ada data ditemukan.
                  </td>
                </tr>
              ) : (
                filtered.map((row, idx) => (
                  <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-500">{idx + 1}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-800 max-w-xs">
                      <p className="truncate">{row.eventName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${TYPE_COLOR[row.eventType]}`}>
                        {row.eventType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">{row.eventDate}</td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-1.5 text-xs font-medium w-fit ${row.deliveryMode === "Online" ? "text-sky-600" : "text-rose-500"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${row.deliveryMode === "Online" ? "bg-sky-500" : "bg-rose-500"}`} />
                        {row.deliveryMode}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(row)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteId(row.id)}
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

      {/* Create/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">
                {editTarget ? "Edit Event" : "Tambah Event Baru"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Nama Event *</label>
                <input
                  value={form.eventName}
                  onChange={(e) => setForm((f) => ({ ...f, eventName: e.target.value }))}
                  placeholder="Judul/nama event..."
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CB2229]/30 focus:border-[#CB2229]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Tipe Event</label>
                  <select
                    value={form.eventType}
                    onChange={(e) => setForm((f) => ({ ...f, eventType: e.target.value as EventType }))}
                    className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CB2229]/30 focus:border-[#CB2229] bg-white"
                  >
                    {["Webinar", "Workshop", "Seminar", "Training"].map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Metode</label>
                  <select
                    value={form.deliveryMode}
                    onChange={(e) => setForm((f) => ({ ...f, deliveryMode: e.target.value as DeliveryMode }))}
                    className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CB2229]/30 focus:border-[#CB2229] bg-white"
                  >
                    {["Online", "Face to Face"].map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Tanggal *</label>
                <input
                  value={form.eventDate}
                  onChange={(e) => setForm((f) => ({ ...f, eventDate: e.target.value }))}
                  placeholder="Contoh: 12 Januari 2025"
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CB2229]/30 focus:border-[#CB2229]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                Batal
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 text-sm font-semibold bg-[#CB2229] hover:bg-red-700 text-white rounded-xl transition-colors"
              >
                {editTarget ? "Simpan Perubahan" : "Tambah Event"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteId != null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center space-y-4">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <Trash2 size={24} className="text-[#CB2229]" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Hapus Event?</h3>
              <p className="text-sm text-slate-500 mt-1">Data yang dihapus tidak dapat dikembalikan.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2 text-sm font-medium border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                Batal
              </button>
              <button onClick={handleDelete} className="flex-1 py-2 text-sm font-semibold bg-[#CB2229] hover:bg-red-700 text-white rounded-xl transition-colors">
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
