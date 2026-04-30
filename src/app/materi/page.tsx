"use client";

import React, { useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

// ─────────────────────────────────────────────
//  DATA
// ─────────────────────────────────────────────

type Materi = {
  id: number;
  title: string;
  link: string;
  thumbnail?: string;
};

const allMateri: Materi[] = [
  { id: 1,  title: "Transformasi Digital di Era Society 5.0",                        link: "#" },
  { id: 2,  title: "Mengenal Domain .id sebagai Identitas Digital Bangsa",           link: "#" },
  { id: 3,  title: "Keamanan Siber untuk Pemula: Lindungi Data Anda",                link: "#" },
  { id: 4,  title: "Cara Membuat Website Profesional dengan Domain .id",             link: "#" },
  { id: 5,  title: "DNS Management: Panduan Lengkap untuk Pemula",                   link: "#" },
  { id: 6,  title: "Digital Marketing Berbasis SEO dan Nama Domain",                 link: "#" },
  { id: 7,  title: "Pengelolaan Identitas Digital untuk UMKM",                       link: "#" },
  { id: 8,  title: "Cyber Hygiene: Kebiasaan Digital yang Aman",                     link: "#" },
  { id: 9,  title: "Strategi Konten Digital untuk Pemula",                           link: "#" },
  { id: 10, title: "Website Builder: Bangun Situs Tanpa Coding",                     link: "#" },
  { id: 11, title: "Dasar-Dasar Pemrograman Web: HTML, CSS & JavaScript",            link: "#" },
  { id: 12, title: "Literasi Internet: Bijak Berinternet di Era Informasi",          link: "#" },
  { id: 13, title: "Personal Branding Digital Menggunakan Domain .id",               link: "#" },
  { id: 14, title: "E-Commerce: Membangun Toko Online yang Terpercaya",              link: "#" },
  { id: 15, title: "Cloud Computing: Dasar dan Manfaat untuk Bisnis",                link: "#" },
  { id: 16, title: "Pengenalan Kecerdasan Buatan dan Machine Learning",              link: "#" },
  { id: 17, title: "Media Sosial sebagai Instrumen Literasi Digital",                link: "#" },
  { id: 18, title: "Hak Kekayaan Intelektual di Dunia Digital",                     link: "#" },
];

const ITEMS_PER_PAGE = 9;

// ─────────────────────────────────────────────
//  MATERI CARD
// ─────────────────────────────────────────────

function MateriCard({ item }: { item: Materi }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col min-h-[380px] overflow-hidden">
      {/* Thumbnail area */}
      <div className="h-[200px] w-full flex-shrink-0 bg-[#f3f4f6] flex items-center justify-center overflow-hidden">
        {item.thumbnail ? (
          <img
            src={item.thumbnail}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 opacity-30">
            <svg className="h-12 w-12 text-[#9ca3af]" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
        )}
      </div>

      {/* Text area — pushed to bottom via mt-auto */}
      <div className="mt-auto flex flex-col">
        <p className="text-[1.05rem] leading-snug text-[#4b5563] px-6 pt-5 mb-6 line-clamp-3">
          {item.title}
        </p>
        <div className="px-6 pb-6">
          <a
            href={item.link}
            className="inline-flex items-center gap-1 rounded border border-transparent px-2 py-1 text-[0.8rem] font-extrabold uppercase tracking-wider text-black transition-all duration-150 hover:border-gray-300"
          >
            Klik untuk lihat →
          </a>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  PAGINATION
// ─────────────────────────────────────────────

function Pagination({
  current,
  total,
  onChange,
}: {
  current: number;
  total: number;
  onChange: (page: number) => void;
}) {
  // Build page list with ellipsis: always show 1, current-1, current, current+1, last
  const pages: (number | "...")[] = [];
  if (total <= 5) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    pages.push(1);
    if (current > 3) pages.push("...");
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
      pages.push(i);
    }
    if (current < total - 2) pages.push("...");
    pages.push(total);
  }

  const btnBase =
    "flex items-center justify-center w-9 h-9 rounded-md text-sm font-semibold transition-all duration-150";
  const activeClass = "bg-[#1f2937] text-white";
  const inactiveClass = "text-[#6b7280] hover:bg-gray-100";
  const arrowClass =
    "flex items-center justify-center w-9 h-9 rounded-md text-[#6b7280] hover:bg-gray-100 transition-all disabled:opacity-30";

  return (
    <div className="flex justify-center items-center gap-2 mt-16">
      {/* Prev */}
      <button
        onClick={() => onChange(Math.max(1, current - 1))}
        disabled={current === 1}
        aria-label="Halaman sebelumnya"
        className={arrowClass}
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      {/* Page numbers */}
      {pages.map((p, idx) =>
        p === "..." ? (
          <span key={`ellipsis-${idx}`} className="flex items-center justify-center w-9 h-9 text-sm text-[#9ca3af]">
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            aria-label={`Halaman ${p}`}
            aria-current={p === current ? "page" : undefined}
            className={`${btnBase} ${p === current ? activeClass : inactiveClass}`}
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onChange(Math.min(total, current + 1))}
        disabled={current === total}
        aria-label="Halaman berikutnya"
        className={arrowClass}
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
//  PAGE
// ─────────────────────────────────────────────

export default function MateriPage() {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(allMateri.length / ITEMS_PER_PAGE);
  const start = (page - 1) * ITEMS_PER_PAGE;
  const visible = allMateri.slice(start, start + ITEMS_PER_PAGE);

  const handlePageChange = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-[#f9fafb] text-[#111827]">
      <Navbar />

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-10 lg:py-14">

        {/* ── Header Banner ── */}
        <div className="mb-10 flex items-start gap-6 rounded-2xl bg-[#e5e7eb] p-8 sm:p-10">
          {/* Graduation cap icon */}
          <div className="flex-shrink-0 mt-0.5">
            <svg
              className="h-10 w-10 text-[#111827]"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
            </svg>
          </div>

          {/* Text */}
          <div>
            <h1 className="text-2xl font-extrabold text-[#111827]">Materi</h1>
            <p className="mt-2 text-[1.05rem] text-[#4b5563]">
              &ldquo;Belajar Tanpa Batas. Pilih Materimu, Mulai Langkah Besarmu!&rdquo;
            </p>
            <p className="text-[1.05rem] text-[#4b5563]">
              Dari pemula hingga profesional — semua yang kamu butuhkan ada di sini.
            </p>
          </div>
        </div>

        {/* ── Grid ── */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {visible.map((item) => (
            <MateriCard key={item.id} item={item} />
          ))}
        </div>

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <Pagination
            current={page}
            total={totalPages}
            onChange={handlePageChange}
          />
        )}
      </div>

      <div className="pb-16" />
      <Footer />
    </main>
  );
}
