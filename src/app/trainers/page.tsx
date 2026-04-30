"use client";

import React, { useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

// ─────────────────────────────────────────────
//  DATA
// ─────────────────────────────────────────────

type Trainer = {
  id: number;
  name: string;
  role: string;
  image: string;
};

const trainers: Trainer[] = [
  { id: 1,  name: "Ahmad Fauzi",          role: "Trainer .id Academy", image: "/img/trainers/trainer-1.png" },
  { id: 2,  name: "Siti Rahmawati",       role: "Trainer .id Academy", image: "/img/trainers/trainer-2.png" },
  { id: 3,  name: "Budi Santoso",         role: "Trainer .id Academy", image: "/img/trainers/trainer-3.png" },
  { id: 4,  name: "Dewi Kusuma",          role: "Trainer .id Academy", image: "/img/trainers/trainer-4.png" },
  { id: 5,  name: "Eko Prasetyo",         role: "Trainer .id Academy", image: "/img/trainers/trainer-5.png" },
  { id: 6,  name: "Fajar Hidayat",        role: "Trainer .id Academy", image: "/img/trainers/trainer-6.png" },
  { id: 7,  name: "Gita Amalia",          role: "Trainer .id Academy", image: "/img/trainers/trainer-7.png" },
  { id: 8,  name: "Hendra Wijaya",        role: "Trainer .id Academy", image: "/img/trainers/trainer-8.png" },
  { id: 9,  name: "Indah Permatasari",    role: "Trainer .id Academy", image: "/img/trainers/trainer-9.png" },
  { id: 10, name: "Joko Susilo",          role: "Trainer .id Academy", image: "/img/trainers/trainer-10.png" },
  { id: 11, name: "Kartika Dewi",         role: "Trainer .id Academy", image: "/img/trainers/trainer-11.png" },
  { id: 12, name: "Lukman Hakim",         role: "Trainer .id Academy", image: "/img/trainers/trainer-12.png" },
  { id: 13, name: "Maya Sari",            role: "Trainer .id Academy", image: "/img/trainers/trainer-13.png" },
  { id: 14, name: "Nanda Putra",          role: "Trainer .id Academy", image: "/img/trainers/trainer-14.png" },
  { id: 15, name: "Oktavia Lestari",      role: "Trainer .id Academy", image: "/img/trainers/trainer-15.png" },
  { id: 16, name: "Pandu Raka",           role: "Trainer .id Academy", image: "/img/trainers/trainer-16.png" },
  { id: 17, name: "Qori Anindita",        role: "Trainer .id Academy", image: "/img/trainers/trainer-17.png" },
  { id: 18, name: "Rizky Firmansyah",     role: "Trainer .id Academy", image: "/img/trainers/trainer-18.png" },
  { id: 19, name: "Sari Melati",          role: "Trainer .id Academy", image: "/img/trainers/trainer-19.png" },
  { id: 20, name: "Teguh Wibowo",         role: "Trainer .id Academy", image: "/img/trainers/trainer-20.png" },
];

const ITEMS_PER_PAGE = 10;

// ─────────────────────────────────────────────
//  TRAINER CARD
// ─────────────────────────────────────────────

function TrainerCard({ trainer }: { trainer: Trainer }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col">
      {/* Photo container — fixed height */}
      <div className="h-[260px] w-full overflow-hidden bg-[#fafafa] flex items-end justify-center">
        <img
          src={trainer.image}
          alt={trainer.name}
          className="w-full h-full object-contain object-bottom"
          onError={(e) => {
            const t = e.currentTarget;
            t.style.display = "none";
            const parent = t.parentElement;
            if (parent && !parent.querySelector(".trainer-fallback")) {
              const fb = document.createElement("div");
              fb.className =
                "trainer-fallback w-20 h-20 rounded-full bg-[#d6362f]/10 flex items-center justify-center mb-4";
              fb.innerHTML = `<svg class="w-10 h-10 text-[#d6362f]/40" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>`;
              parent.appendChild(fb);
            }
          }}
        />
      </div>

      {/* Text area */}
      <div className="p-5 text-center">
        <p className="text-[1.05rem] font-bold text-[#1f2937] leading-tight mb-1.5 line-clamp-2">
          {trainer.name}
        </p>
        <p className="text-[0.82rem] text-gray-400">{trainer.role}</p>
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
  const pages = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <div className="flex justify-center items-center gap-2 mt-12">
      {/* Prev */}
      <button
        onClick={() => onChange(Math.max(1, current - 1))}
        disabled={current === 1}
        aria-label="Halaman sebelumnya"
        className="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition hover:bg-gray-100 disabled:opacity-30"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      {/* Page numbers */}
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          aria-label={`Halaman ${p}`}
          aria-current={p === current ? "page" : undefined}
          className={`flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium transition ${
            p === current
              ? "bg-[#1f2937] text-white"
              : "text-gray-500 hover:bg-gray-100"
          }`}
        >
          {p}
        </button>
      ))}

      {/* Next */}
      <button
        onClick={() => onChange(Math.min(total, current + 1))}
        disabled={current === total}
        aria-label="Halaman berikutnya"
        className="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition hover:bg-gray-100 disabled:opacity-30"
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

export default function TrainersPage() {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(trainers.length / ITEMS_PER_PAGE);
  const start = (page - 1) * ITEMS_PER_PAGE;
  const visible = trainers.slice(start, start + ITEMS_PER_PAGE);

  const handlePageChange = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-[#f9fafb] text-[#111827]">
      <Navbar />

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-10 lg:py-14">

        {/* ── Header Banner ── */}
        <div className="mb-10 flex items-center gap-5 rounded-xl bg-[#f3f4f6] p-8">
          {/* Icon */}
          <div className="flex-shrink-0 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
            <svg className="h-7 w-7 text-[#1f2937]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
            </svg>
          </div>

          {/* Text */}
          <div>
            <h1 className="text-xl font-extrabold text-[#1f2937]">Trainers</h1>
            <p className="mt-1 text-sm text-[#6b7280] max-w-xl">
              Kenali para narasumber dan trainer profesional .id Academy — praktisi berpengalaman yang siap
              membimbing perjalanan digital Anda bersama PANDI.
            </p>
          </div>
        </div>

        {/* ── Grid ── */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {visible.map((trainer) => (
            <TrainerCard key={trainer.id} trainer={trainer} />
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

      {/* Spacer */}
      <div className="pb-16" />
      <Footer />
    </main>
  );
}
