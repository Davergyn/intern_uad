import React from "react";
import type { Metadata } from "next";
import { Lightbulb, Users, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us – Academy.id",
  description:
    "Mengenal lebih dekat Academy.id, platform edtech terdepan di Indonesia yang memberikan akses pendidikan teknologi berkualitas tinggi.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f9fafb] text-[#111827] overflow-hidden">
      
      {/* ── About Hero Section ── */}
      <section
        id="about-hero"
        className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
      >
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* ── Left: Text Content ── */}
          <div className="flex flex-1 flex-col justify-center max-w-2xl">
            
            {/* Container Terpisah (Badge Inisiatif PANDI) */}
            <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-red-100 bg-red-50 py-1.5 px-4 shadow-sm w-fit">
              <span className="flex h-2 w-2 rounded-full bg-[#CB2229] animate-pulse"></span>
              <p className="text-xs font-bold tracking-wide text-[#CB2229] uppercase">
                Inisiatif PANDI <span className="mx-1 text-red-300">•</span> Edukasi Digital Indonesia
              </p>
            </div>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-[#1f2937] sm:text-5xl lg:text-6xl">
              Mengenal lebih dekat <span className="text-[#CB2229]">Academy.id</span>
            </h1>
            
            <p className="mt-4 text-xl font-bold text-gray-700 sm:text-2xl">
              Platform edtech terdepan di Indonesia.
            </p>

            <div className="mt-8 space-y-6">
              <p className="text-base leading-relaxed text-gray-600 sm:text-lg">
                Memberikan akses pendidikan teknologi berkualitas tinggi kepada seluruh masyarakat Indonesia. Kami percaya bahwa setiap orang berhak mendapatkan kesempatan untuk mengembangkan skill digital dan mempersiapkan diri menghadapi tantangan masa depan.
              </p>
            </div>
          </div>

          {/* ── Right: Image Content ── */}
          <div className="w-full lg:w-[460px] flex-shrink-0 relative">
            {/* Latar Belakang Dekoratif di belakang gambar */}
            <div className="absolute inset-0 -z-10 translate-x-4 translate-y-4 rounded-3xl bg-gradient-to-br from-red-50 to-red-100/50 border border-red-100"></div>
            
            <div className="relative w-full aspect-square rounded-3xl bg-white border border-gray-100 shadow-xl overflow-hidden flex items-center justify-center">
              <img 
                src="/assets/aboutus.jpeg" 
                alt="Tentang Academy.id" 
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>

        </div>
      </section>

      {/* ── Nilai-Nilai Kami Section (Container Terpisah) ── */}
      <section className="w-full bg-white border-t border-gray-100 py-20 sm:py-24">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          
          {/* Header Nilai-Nilai Kami */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-[#1f2937] sm:text-4xl">
              Nilai-Nilai Kami
            </h2>
            <p className="mt-4 text-lg text-gray-500 leading-relaxed">
              Prinsip-prinsip yang menjadi fondasi kami dalam memberikan pengalaman belajar terbaik.
            </p>
          </div>

          {/* Grid Nilai-Nilai */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1: Inovasi */}
            <div className="flex flex-col p-8 rounded-2xl bg-[#f9fafb] border border-gray-100 transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-red-50 text-[#CB2229]">
                <Lightbulb className="h-7 w-7" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-[#1f2937]">
                Inovasi
              </h3>
              <p className="text-base leading-relaxed text-gray-600">
                Kami terus berinovasi dalam metode pengajaran dan teknologi pembelajaran untuk memberikan pengalaman belajar terbaik.
              </p>
            </div>

            {/* Card 2: Kolaborasi */}
            <div className="flex flex-col p-8 rounded-2xl bg-[#f9fafb] border border-gray-100 transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-red-50 text-[#CB2229]">
                <Users className="h-7 w-7" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-[#1f2937]">
                Kolaborasi
              </h3>
              <p className="text-base leading-relaxed text-gray-600">
                Kami membangun komunitas learner yang saling mendukung dan berkolaborasi untuk mencapai tujuan bersama.
              </p>
            </div>

            {/* Card 3: Keunggulan */}
            <div className="flex flex-col p-8 rounded-2xl bg-[#f9fafb] border border-gray-100 transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-red-50 text-[#CB2229]">
                <Award className="h-7 w-7" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-[#1f2937]">
                Keunggulan
              </h3>
              <p className="text-base leading-relaxed text-gray-600">
                Kami berkomitmen pada standar tertinggi dalam setiap program dan layanan yang kami tawarkan.
              </p>
            </div>

          </div>
        </div>
      </section>

    </main>
  );
}