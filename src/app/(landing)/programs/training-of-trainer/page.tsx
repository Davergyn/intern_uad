import React from "react";
import Link from "next/link";
import { db } from "@/db";
import { programs, materials } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { Rocket, BadgeCheck, Users, Mail, LayoutGrid } from "lucide-react";
// Pastikan path ke HeroSlider sudah benar sesuai struktur folder Anda
import HeroSlider from "../_components/HeroSlider"; 

export const metadata = {
  title: "Training of Trainer – .id Academy",
  description: "Program pengembangan calon trainer yang mampu menyampaikan materi literasi digital, domain, DNS, dan keamanan digital kepada komunitasnya.",
};

export default async function TrainingOfTrainerPage() {
  // 1. Ambil data program TOT untuk dimasukkan ke Slider
  const programData = await db
    .select()
    .from(programs)
    .where(
      and(
        eq(programs.kategori, "training-of-trainer"),
        eq(programs.isActive, true)
      )
    );

  // Ambil semua URL gambar yang valid
  const heroImages = programData
    .filter((p) => Boolean(p.imageUrl))
    .map((p) => p.imageUrl as string);

  // 2. Ambil data Materi dari database untuk mengisi Learning Outcomes secara dinamis
  const materialsData = await db
    .select()
    .from(materials)
    .where(eq(materials.isActive, true));

  return (
    <main className="min-h-screen bg-white text-[#111827]">
      
      {/* ── HERO SECTION ── */}
      <section className="w-full border-b border-gray-50 bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
          <div className="flex flex-col items-center gap-10 lg:flex-row lg:gap-16">
            
            {/* Kiri: Slider Gambar Interaktif */}
            <div className="w-full shrink-0 lg:w-[480px]">
              <HeroSlider images={heroImages} />
            </div>

            {/* Kanan: Teks Info */}
            <div className="flex flex-1 flex-col gap-6">
              <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-[#1f2937] sm:text-5xl lg:text-6xl">
                Training of Trainer
              </h1>

              <p className="max-w-xl text-lg leading-relaxed text-gray-500">
                Program pengembangan calon trainer yang mampu menyampaikan materi literasi digital, domain, DNS, dan keamanan digital kepada komunitasnya.
              </p>

              {/* Badges */}
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
                  <Rocket className="h-4 w-4" />
                  {materialsData.length} learning outcomes
                </span>
                <span className="flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">
                  <BadgeCheck className="h-4 w-4" />
                  Sertifikat .id Academy
                </span>
                <span className="flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-4 py-2 text-sm font-bold text-orange-700">
                  <Users className="h-4 w-4" />
                  Mentor PANDI
                </span>
              </div>

              {/* Tombol Utama */}
              <div className="mt-6">
                <Link
                  href="/auth/registrasi"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#CB2229] px-8 py-4 text-base font-bold text-white shadow-lg shadow-red-200 transition-all hover:bg-[#a01b20] hover:shadow-xl hover:shadow-red-200 active:scale-95"
                >
                  Daftar Program
                  <svg className="ml-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LEARNING OUTCOMES SECTION (Gambar Cover + Tombol) ── */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12">
          <span className="text-sm font-black uppercase tracking-widest text-[#CB2229]">
            Learning outcomes
          </span>
          <h2 className="mt-2 text-3xl font-extrabold text-[#1f2937] sm:text-4xl">
            Yang akan kamu pelajari
          </h2>
        </div>

        {materialsData.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-10 text-center text-sm font-medium text-gray-400">
            Belum ada materi pembelajaran yang tersedia saat ini.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {materialsData.map((mat) => (
              <div
                key={mat.id}
                className="group relative flex h-72 flex-col justify-end overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 shadow-sm"
              >
                {/* Latar Belakang Gambar Materi */}
                {mat.coverUrl ? (
                  <img
                    src={mat.coverUrl}
                    alt={mat.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                    <span className="text-xs font-medium text-gray-400">Cover Kosong</span>
                  </div>
                )}

                {/* Gradient Hitam Bawah */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/90 via-[#111827]/30 to-transparent" />

                {/* Konten (Judul & Tombol Link) */}
                <div className="relative z-10 p-6 transition-transform duration-300 group-hover:-translate-y-1">
                  <h3 className="line-clamp-2 text-lg font-bold leading-snug text-white">
                    {mat.title}
                  </h3>

                  <Link
                    href="/materi"
                    className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-[#10b981] transition-colors hover:text-emerald-400"
                  >
                    Lihat lebih lengkap
                    <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── BOTTOM CTA BANNER ── */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-8 rounded-3xl border border-gray-200 bg-white p-8 shadow-xl shadow-gray-100/50 sm:p-12 lg:flex-row">
          
          {/* Kiri: Teks */}
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-2xl font-extrabold text-[#1f2937] sm:text-3xl">
              Tertarik mengikuti Training of Trainer?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-base text-gray-500 lg:mx-0">
              Hubungi tim .id Academy untuk informasi jadwal, kuota, dan proses pendaftaran program ini.
            </p>
          </div>

          {/* Kanan: Tombol */}
          <div className="flex w-full shrink-0 flex-col items-center gap-4 sm:flex-row lg:w-auto">
            {/* Tombol Hubungi Kami */}
            <Link
              href="/contact-us"
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-emerald-600 bg-white px-7 py-3.5 text-sm font-bold text-emerald-600 transition-all hover:bg-emerald-50 active:scale-95 sm:w-auto"
            >
              <Mail className="h-4 w-4" />
              Hubungi Kami
            </Link>

            {/* Tombol Program Lain */}
            <Link
              href="/programs"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#f3f4f6] px-7 py-3.5 text-sm font-bold text-[#1f2937] transition-all hover:bg-gray-200 active:scale-95 sm:w-auto"
            >
              <LayoutGrid className="h-4 w-4 text-gray-500" />
              Program lain
            </Link>
          </div>
          
        </div>
      </section>

    </main>
  );
}