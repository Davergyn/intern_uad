import React from "react";
import Link from "next/link";
import { db } from "@/db"; // Sesuaikan dengan path instance Drizzle db Anda
import { partnerships } from "@/db/schema"; // Sesuaikan dengan path file schema Anda
import { eq } from "drizzle-orm";

export const metadata = {
  title: "Partnership – .id Academy",
  description: "Kolaborasi untuk memperluas dampak literasi digital Indonesia.",
};

// ────────────────────────────────────────────────────────────────────────
//  KOMPONEN IKON KATEGORI
// ────────────────────────────────────────────────────────────────────────
const icons = {
  Instansi: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m22 4v-4M5 21h14M5 17h14M7 17V7m10 10V7M9 17V7m6 10V7M12 3L3 7h18L12 3z" />
    </svg>
  ),
  Registrar: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
    </svg>
  ),
  Akademisi: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M12 14l9-5-9-5-9 5 9 5z" />
      <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0v6" />
    </svg>
  ),
  Komunitas: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  )
};

// ────────────────────────────────────────────────────────────────────────
//  MAIN PAGE COMPONENT (SERVER COMPONENT)
// ────────────────────────────────────────────────────────────────────────
export default async function PartnershipPage() {
  // 1. Ambil data dari database Drizzle (Hanya yang aktif)
  const allPartners = await db
    .select()
    .from(partnerships)
    .where(eq(partnerships.isActive, true));

  // 2. Kelompokkan berdasarkan kolom 'kategori' dari ENUM Supabase
  const categories = [
    {
      id: "instansi",
      title: "Instansi",
      subtitle: "Pemerintah & lembaga resmi",
      icon: icons.Instansi,
      data: allPartners.filter(p => p.kategori === "instansi"),
    },
    {
      id: "registrar",
      title: "Registrar",
      subtitle: "Registrar & mitra domain .id",
      icon: icons.Registrar,
      data: allPartners.filter(p => p.kategori === "registrar"),
    },
    {
      id: "akademisi",
      title: "Akademisi",
      subtitle: "Universitas & lembaga pendidikan",
      icon: icons.Akademisi,
      data: allPartners.filter(p => p.kategori === "akademisi"),
    },
    {
      id: "komunitas",
      title: "Komunitas",
      subtitle: "Komunitas & organisasi",
      icon: icons.Komunitas,
      data: allPartners.filter(p => p.kategori === "komunitas"),
    }
  ];

  return (
    <main className="min-h-screen bg-white pb-24">
      
      {/* ── HERO SECTION ── */}
      <section className="bg-[#f9fafb] py-16 border-b border-gray-100 text-center px-4">
        <div className="mx-auto max-w-4xl">
          <span className="text-sm font-black tracking-widest text-[#CB2229] uppercase">
            Kolaborasi & Kemitraan
          </span>
          <h1 className="mt-4 text-4xl font-extrabold text-[#1f2937] sm:text-5xl">
            Partner <span className="text-[#CB2229]">.id Academy</span>
          </h1>
          <p className="mt-6 text-lg text-gray-500 leading-relaxed max-w-3xl mx-auto">
            Program Partnership .id Academy membuka kolaborasi dengan institusi, komunitas, kampus, dan organisasi untuk memperluas dampak literasi digital Indonesia.
          </p>
        </div>
      </section>

      {/* ── LIST PARTNER BERDASARKAN KATEGORI ── */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col gap-16">
          {categories.map((category) => {
            // Jika kategori ini kosong (belum ada data di DB), tidak perlu di-render
            if (category.data.length === 0) return null;

            return (
              <div key={category.id}>
                
                {/* Header Kategori */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-[#9A1B1F]">
                    {category.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-[#9A1B1F]">
                      {category.title}
                    </h2>
                    <p className="text-sm font-medium text-slate-500">
                      {category.subtitle} · {category.data.length} mitra
                    </p>
                  </div>
                </div>

                {/* Grid Logo Partner (Responsif) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {category.data.map((partner) => (
                    <div
                      key={partner.id}
                      title={partner.description ?? partner.name}
                      className="group relative flex h-28 w-full flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-[#CB2229]/30 hover:shadow-md overflow-hidden"
                    >
                      {partner.imageUrl ? (
                        <img
                          src={partner.imageUrl}
                          alt={partner.name}
                          className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105 filter grayscale group-hover:grayscale-0"
                        />
                      ) : (
                        <span className="text-xs font-bold text-gray-400 text-center break-words">
                          {partner.name}
                        </span>
                      )}
                      {/* Overlay hover dengan nama */}
                      <div className="absolute inset-x-0 bottom-0 translate-y-full bg-[#CB2229]/90 px-2 py-1.5 text-center transition-transform duration-200 group-hover:translate-y-0">
                        <p className="truncate text-[10px] font-bold text-white">{partner.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
              </div>
            );
          })}
        </div>
      </section>

      {/* ── CTA BOTTOM SECTION (Tanpa Container Merah) ── */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 mt-8 text-center border-t border-gray-100">
        <h2 className="text-3xl font-extrabold text-[#1f2937] sm:text-4xl">
          Tertarik menjadi mitra .id Academy?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-500">
          Mari berkolaborasi memperluas akses literasi digital untuk lebih banyak orang di Indonesia.
        </p>
        
        <Link
          href="/contact-us"
          className="mt-8 inline-flex items-center gap-3 rounded-xl bg-[#CB2229] px-8 py-3.5 font-bold text-white shadow-lg shadow-red-200 transition-all hover:bg-[#a01b20] hover:shadow-xl hover:shadow-red-200 active:scale-95"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Hubungi Kami
        </Link>
      </section>

    </main>
  );
}