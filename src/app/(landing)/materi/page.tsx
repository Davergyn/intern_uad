"use client";

import { useState, useEffect } from "react";
import { BookOpen, ExternalLink, X, AlertCircle, Search, Loader2 } from "lucide-react";
import type { MaterialRow } from "@/types/database";

// ============================================================================
// TYPES
// ============================================================================
type MaterialWithLinks = MaterialRow & {
  links: Array<{ id: number; materialId: number; type: string; name: string; url: string }>;
};

// ============================================================================
// MODAL KOMPONEN
// ============================================================================
function LoginModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-sm p-6 bg-white rounded-3xl shadow-2xl text-center relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#CB2229]/10">
          <AlertCircle className="h-8 w-8 text-[#CB2229]" />
        </div>
        <h3 className="text-xl font-bold text-[#111827]">Masuk untuk Melanjutkan</h3>
        <p className="mt-2 text-sm text-gray-500">
          Anda harus login terlebih dahulu untuk mengakses materi. Silakan masuk dengan akun Anda atau daftar jika belum memiliki akun.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <a href="/login" className="w-full rounded-xl bg-[#CB2229] py-3 text-sm font-bold text-white hover:bg-red-700 block">
            Masuk
          </a>
          <a href="/auth/register" className="w-full rounded-xl border border-[#CB2229] py-3 text-sm font-bold text-[#CB2229] hover:bg-red-50 block">
            Daftar Akun Baru
          </a>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MATERIAL CARD KOMPONEN (DESKRIPSI DIHAPUS)
// ============================================================================
export function MaterialCard({ item, isLoggedIn }: { item: MaterialRow; isLoggedIn: boolean }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <article className="flex min-h-[300px] flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1 duration-300">
        <div className="flex h-[200px] w-full flex-shrink-0 items-center justify-center overflow-hidden bg-[#f3f4f6]">
          {item.coverUrl ? (
            <img src={item.coverUrl} alt={item.title} className="h-full w-full object-cover" />
          ) : (
            <BookOpen className="h-12 w-12 text-[#9ca3af]" />
          )}
        </div>

        <div className="flex flex-1 flex-col p-6">
          <h2 className="mb-3 line-clamp-3 text-[1.1rem] leading-snug text-[#111827] font-bold">
            {item.title}
          </h2>

          <div className="mt-auto pt-6">
            {isLoggedIn ? (
              <a
                href={item.linkUrl || "#"}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#CB2229] px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-white transition hover:bg-red-700"
              >
                Klik untuk lihat
                <ExternalLink size={14} />
              </a>
            ) : (
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-gray-200 px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-gray-700 transition hover:bg-gray-300"
              >
                Klik untuk lihat
                <ExternalLink size={14} />
              </button>
            )}
          </div>
        </div>
      </article>

      <LoginModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}

// ============================================================================
// HALAMAN UTAMA
// ============================================================================
export default function MateriPage() {
  const [materials, setMaterials] = useState<MaterialWithLinks[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const isLoggedIn = false; // Sesuaikan dengan session check project Anda

  useEffect(() => {
    async function fetchMaterials() {
      try {
        const res = await fetch("/api/admin/materi");
        if (!res.ok) throw new Error("Gagal memuat data materi.");
        const json = await res.json();
        setMaterials(json.data ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
      } finally {
        setLoading(false);
      }
    }
    fetchMaterials();
  }, []);

  const filtered = materials.filter(
    (m) =>
      m.isActive &&
      m.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <main className="min-h-screen bg-[#f9fafb]">
      <section className="bg-white border-b border-gray-100 py-12 px-4">
        <div className="mx-auto max-w-6xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#CB2229]/10 px-4 py-2 text-sm font-semibold text-[#CB2229] mb-4">
            <BookOpen size={16} />
            Perpustakaan Materi
          </div>
          <h1 className="text-4xl font-extrabold text-[#111827] mb-3">
            Materi &amp; Referensi Belajar
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto text-base">
            Kumpulan materi pelatihan, modul, dan referensi yang dapat diakses oleh peserta terdaftar.
          </p>

          <div className="mt-8 flex items-center gap-3 max-w-md mx-auto rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-[#CB2229]/30">
            <Search className="h-5 w-5 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari judul materi..."
              className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-400">
            <Loader2 className="h-10 w-10 animate-spin text-[#CB2229]" />
            <p className="text-sm">Memuat materi...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-red-500">
            <AlertCircle className="h-10 w-10" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-400">
            <BookOpen className="h-12 w-12" />
            <p className="text-base font-medium">
              {search ? `Tidak ada materi yang cocok dengan "${search}"` : "Belum ada materi tersedia."}
            </p>
          </div>
        ) : (
          <>
            <p className="mb-6 text-sm text-gray-400">
              Menampilkan <span className="font-semibold text-gray-600">{filtered.length}</span> materi
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((material) => (
                <MaterialCard key={material.id} item={material} isLoggedIn={isLoggedIn} />
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}