"use client";

import React, { useState } from "react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";

// ─────────────────────────────────────────────
//  IMAGE PLACEHOLDER
// ─────────────────────────────────────────────

function ImagePlaceholder({ label }: { label: string }) {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl border-2 border-dashed border-[#d1d5db] bg-[#f9fafb] aspect-[4/3] flex items-center justify-center">
      <div className="text-center px-6">
        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[#d6362f]/10">
          <svg className="h-8 w-8 text-[#d6362f]/50" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 18.75V7.5A2.25 2.25 0 015.25 5.25h13.5A2.25 2.25 0 0121 7.5v11.25" />
          </svg>
        </div>
        <p className="text-xs font-medium text-[#9ca3af] leading-relaxed whitespace-pre-line">{label}</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  MOBILE CAROUSEL
// ─────────────────────────────────────────────

const SLIDES = [
  { id: 0, label: "Gambar 1\nakan ditambahkan" },
  { id: 1, label: "Gambar 2\nakan ditambahkan" },
];

function MobileCarousel() {
  const [current, setCurrent] = useState(0);
  const prev = () => setCurrent((c) => (c === 0 ? SLIDES.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === SLIDES.length - 1 ? 0 : c + 1));

  return (
    <div className="w-full">
      <div className="relative w-full overflow-hidden rounded-2xl">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {SLIDES.map((slide) => (
            <div key={slide.id} className="min-w-full">
              <ImagePlaceholder label={slide.label} />
            </div>
          ))}
        </div>

        {/* Prev button */}
        <button
          onClick={prev}
          aria-label="Slide sebelumnya"
          className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 shadow backdrop-blur-sm hover:bg-white transition"
        >
          <svg className="h-4 w-4 text-[#374151]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        {/* Next button */}
        <button
          onClick={next}
          aria-label="Slide berikutnya"
          className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 shadow backdrop-blur-sm hover:bg-white transition"
        >
          <svg className="h-4 w-4 text-[#374151]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>

      {/* Dot indicators */}
      <div className="mt-3 flex justify-center gap-2">
        {SLIDES.map((slide) => (
          <button
            key={slide.id}
            onClick={() => setCurrent(slide.id)}
            aria-label={`Slide ${slide.id + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              current === slide.id ? "w-6 bg-[#d6362f]" : "w-2 bg-[#d1d5db]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  BULLET ITEM
// ─────────────────────────────────────────────

function BulletItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-1.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-[#d6362f]/15">
        <svg className="h-2.5 w-2.5 text-[#d6362f]" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
        </svg>
      </span>
      <span className="text-sm leading-7 text-[#374151] sm:text-base">{text}</span>
    </li>
  );
}

// ─────────────────────────────────────────────
//  PAGE
// ─────────────────────────────────────────────

export default function WorkshopPage() {
  return (
    <main className="min-h-screen bg-white text-[#111827]">
      <Navbar />

      {/* ── Hero Section ── */}
      <section
        id="workshop-hero"
        className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-14 lg:py-20"
      >
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-start lg:gap-16">

          {/* ── Left: Images ── */}
          <div className="
            w-full max-w-sm
            sm:max-w-[360px]
            md:max-w-[420px]
            lg:w-[460px] lg:max-w-none lg:flex-shrink-0
            self-start
          ">
            {/* Mobile: carousel */}
            <div className="lg:hidden">
              <MobileCarousel />
            </div>

            {/* Desktop: 2 images stacked */}
            <div className="hidden lg:flex lg:flex-col lg:gap-4">
              <ImagePlaceholder label={"Gambar 1\nakan ditambahkan"} />
              <ImagePlaceholder label={"Gambar 2\nakan ditambahkan"} />
            </div>
          </div>

          {/* ── Right: Text Content ── */}
          <div className="flex min-w-0 flex-1 flex-col gap-6">

            {/* Title */}
            <h1 className="text-4xl font-black leading-tight tracking-tight text-[#111827] sm:text-5xl">
              Workshop
            </h1>

            {/* Description paragraphs */}
            <div className="flex flex-col gap-4 text-sm leading-7 text-[#374151] sm:text-base">
              <p>
                Program Workshop .id Academy adalah kegiatan pelatihan interaktif yang
                diselenggarakan oleh PANDI melalui platform .id Academy, yang bertujuan
                untuk memberikan keterampilan praktis kepada peserta dalam membangun,
                mengelola, dan mengoptimalkan identitas digital menggunakan nama domain
                .id.
              </p>
              <p>
                Workshop ini dirancang dengan metode <em className="font-semibold not-italic text-[#111827]">learning by doing</em>, di mana peserta
                tidak hanya memperoleh pengetahuan teoritis, tetapi juga langsung
                mempraktikkan pembuatan platform digital, pengelolaan domain, penerapan
                keamanan digital (cyber hygiene), serta pemanfaatan teknologi pendukung
                seperti website builder, DNS management, dan digital marketing.
              </p>
            </div>

            {/* Bullet outcomes */}
            <div>
              <p className="mb-3 text-sm font-semibold text-[#111827] sm:text-base">
                Melalui kegiatan ini, peserta diharapkan dapat:
              </p>
              <ul className="flex flex-col gap-2.5">
                <BulletItem text="Memahami fungsi dan pentingnya domain .id sebagai identitas digital" />
                <BulletItem text="Membuat dan mengelola website menggunakan nama domain .id secara mandiri." />
                <BulletItem text="Menerapkan prinsip keamanan data dalam penggunaan teknologi." />
                <BulletItem text="Memanfaatkan layanan DNS management untuk konfigurasi domain." />
                <BulletItem text="Mengoptimalkan kehadiran digital melalui strategi konten dan digital marketing." />
              </ul>
            </div>
            <p>
              Program workshop ini menjadi bagian dari komitmen PANDI untuk mendukung peningkatan literasi digital nasional 
              dan memperkuat ekosistem teknologi lokal yang inklusif, kreatif, dan berdaya saing global.
            </p>

            {/* Divider */}
            <div className="h-px bg-black/5" />

            {/* CTA */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button className="rounded-md bg-[#cf2f2a] px-6 py-3 text-sm font-bold tracking-wide text-white shadow-sm transition hover:bg-[#b92924]">
                Daftar Sekarang →
              </button>
              <button className="rounded-md border border-[#d6362f] px-6 py-3 text-sm font-bold tracking-wide text-[#d6362f] transition hover:bg-[#d6362f]/5">
                Unduh Brosur
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ── Divider ── */}
      <div className="h-px bg-black/5" />

      {/* ── Spacer ── */}
      <div className="pb-24" />

      <Footer />
    </main>
  );
}
