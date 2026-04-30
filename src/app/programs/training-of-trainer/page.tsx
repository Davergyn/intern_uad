"use client";

import React, { useState } from "react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";

// ─────────────────────────────────────────────
//  HIGHLIGHT CARD
// ─────────────────────────────────────────────

function HighlightCard({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-black/5 bg-white px-4 py-3 shadow-sm">
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#d6362f]/10 text-[#d6362f]">
        {icon}
      </div>
      <p className="text-sm font-semibold text-[#1f2937]">{label}</p>
    </div>
  );
}

// ─────────────────────────────────────────────
//  IMAGE PLACEHOLDER (reusable)
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
        <p className="text-xs font-medium text-[#9ca3af] leading-relaxed">{label}</p>
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
      {/* Slide wrapper */}
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

        {/* Prev / Next buttons */}
        <button
          onClick={prev}
          aria-label="Slide sebelumnya"
          className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 shadow backdrop-blur-sm hover:bg-white transition"
        >
          <svg className="h-4 w-4 text-[#374151]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
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
            className={`h-2 rounded-full transition-all duration-300 ${current === slide.id ? "w-6 bg-[#d6362f]" : "w-2 bg-[#d1d5db]"}`}
          />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  PAGE
// ─────────────────────────────────────────────

export default function TrainingOfTrainerPage() {
  return (
    <main className="min-h-screen bg-[#f3f4f6] text-[#111827]">
      <Navbar />

      {/* ── Hero Section — 2 Column ── */}
      <section
        id="tot-hero"
        className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-14 lg:py-20"
      >
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-start lg:gap-16">

          {/* ── Left: Images ── */}
          <div className="
            w-full max-w-sm
            sm:max-w-[360px]
            md:max-w-[400px]
            lg:w-[460px] lg:max-w-none lg:flex-shrink-0
            self-start
          ">
            {/* Mobile: carousel (hidden on lg+) */}
            <div className="lg:hidden">
              <MobileCarousel />
            </div>

            {/* Desktop: 2 images stacked (hidden below lg) */}
            <div className="hidden lg:flex lg:flex-col lg:gap-4">
              <ImagePlaceholder label={"Gambar 1\nakan ditambahkan"} />
              <ImagePlaceholder label={"Gambar 2\nakan ditambahkan"} />
            </div>
          </div>

          {/* ── Right: Text Content ── */}
          <div className="flex min-w-0 flex-1 flex-col gap-5">
            {/* Badge */}
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#d6362f]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-[#d6362f]">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
              </svg>
              Program .id Academy
            </span>

            {/* Title */}
            <h1 className="text-4xl font-black leading-tight tracking-tight text-[#111827] sm:text-5xl">
              Training Of <span className="text-[#d6362f]">Trainer</span>
            </h1>

            {/* Descriptions */}
            <div className="flex flex-col gap-4 text-sm leading-7 text-[#374151] sm:text-base">
              <p>
                Program Training of Trainer (ToT) .id Academy adalah program pengembangan
                kapasitas yang diselenggarakan oleh PANDI melalui platform .id Academy,
                yang bertujuan untuk melahirkan para pelatih, fasilitator, dan pendamping
                digital yang kompeten dalam bidang pengelolaan identitas digital, literasi
                internet, dan pemanfaatan nama domain .id.
              </p>
              <p>
                Dalam program ini, peserta mendapatkan pembekalan menyeluruh mulai dari
                konsep dasar identitas digital, keamanan internet, pembuatan platform
                digital, manajemen domain dan DNS, hingga strategi penyampaian materi yang
                efektif untuk kegiatan edukasi di berbagai daerah.
              </p>
              <p>
                Program ini dirancang untuk membentuk trainer yang tidak hanya paham
                materi, tetapi juga mampu mengajarkan kembali secara mandiri dalam bentuk
                workshop, kelas pelatihan, pendampingan komunitas, atau kegiatan literasi
                digital lainnya.
              </p>
            </div>

            {/* Highlight cards */}
            <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <HighlightCard
                label="Berbasis kompetensi"
                icon={
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                }
              />
              <HighlightCard
                label="Sertifikat resmi PANDI"
                icon={
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
                  </svg>
                }
              />
              <HighlightCard
                label="Modul siap pakai"
                icon={
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625z" />
                    <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
                  </svg>
                }
              />
              <HighlightCard
                label="Mentoring langsung"
                icon={
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                  </svg>
                }
              />
            </div>

            {/* CTA */}
            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
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

      {/* ── Large gap before footer ── */}
      <div className="pb-24" />

      <Footer />
    </main>
  );
}
