import React from "react";
import Navbar from "./navbar";

const stats = [
  { label: "Total arsip", value: "120+", note: "Event terdokumentasi" },
  { label: "Format", value: "3", note: "Online, hybrid, offline" },
  { label: "Topik teratas", value: "AI", note: "Paling banyak diminati" },
  { label: "Update terakhir", value: "2026", note: "Arsip terbaru tersedia" },
];

export default function PassEventsPage() {
  return (
    <main className="min-h-screen bg-[#f7f8fa] text-[#111827]">
      <Navbar />

      <section className="relative overflow-hidden border-b border-[#e5e7eb] bg-linear-to-r from-[#c91d27] via-[#da1f2b] to-[#ec1d2f]">
        <div className="pointer-events-none absolute -left-20 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full border-24px border-white/10" />
        <div className="pointer-events-none absolute right-[-80px] top-[-70px] h-52 w-52 rounded-full border-30px border-white/10" />
        <div className="pointer-events-none absolute bottom-[-120px] right-[-60px] h-64 w-64 rounded-full border-42px border-white/10" />

        <div className="relative mx-auto grid w-full max-w-6xl gap-7 px-4 py-10 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-10 lg:px-8 lg:py-14">
          <div className="text-white">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#b93030] shadow-sm">
              <span aria-hidden="true">*</span>
              Arsip pembelajaran .id Academy
            </div>

            <div className="mb-4 flex items-start gap-4">
              <div className="grid h-24 w-24 place-items-center">
                <img
                  src="/img/assets/clock%20icon.svg"
                  alt="Clock icon"
                  className="h-20 w-20 object-contain"
                />
              </div>

              <div>
                <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
                  Past Events
                </h1>
                <p className="mt-2 max-w-xl text-[1.08rem] font-medium leading-8 text-white/95 sm:text-[1.12rem]">
                  Jelajahi rekam jejak webinar, workshop, dan sesi pelatihan yang telah diselenggarakan.
                </p>
              </div>
            </div>


          </div>

          <div className="grid grid-cols-2 gap-3">
            {stats.map((item) => (
              <article
                key={item.label}
                className="rounded-xl border border-black/5 bg-[#f5f5f5] p-3 shadow-md">
                <p className="text-[0.95rem] text-[#6b7280]">{item.label}</p>
                <p className="mt-1 text-[2.1rem] font-extrabold leading-none text-[#1f2937]">{item.value}</p>
                <p className="mt-2 text-sm font-semibold text-[#b63a3a]">{item.note}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ========== Past events card grid (6 cards) ========== */}

      <section className="past-events-section">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div>
            <h2 className="text-[clamp(1.9rem,2.2vw,2.6rem)] font-extrabold leading-[1.15] text-[#111827]">
              Daftar event terdahulu
            </h2>
            <p className="mt-2 text-[clamp(0.95rem,1.05vw,1.2rem)] leading-[1.45] text-[#6b7280]">
              Lorem Ipsum dolar sitmet, consecratun adipascingg elit, sed da sat eiusmod
            </p>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <div className="relative w-full max-w-[370px]">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M21 21L16.65 16.65M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Cari nama event"
                className="h-14 w-full rounded-full border border-[#f0e4e4] bg-[#f4ecec] pl-12 pr-4 text-[1.05rem] text-[#6b7280] outline-none placeholder:text-[#6b7280]"
              />
            </div>

            <button className="h-14 rounded-full bg-[#f4ecec] px-8 text-[1.1rem] font-semibold text-[#b12d2d]">
              Semua
            </button>
            <button className="h-14 rounded-full bg-[#f4ecec] px-8 text-[1.1rem] font-semibold text-[#b12d2d]">
              Webinar
            </button>
            <button className="h-14 rounded-full bg-[#f4ecec] px-8 text-[1.1rem] font-semibold text-[#b12d2d]">
              Workshop
            </button>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <article
                key={i}
                className="overflow-hidden rounded-xl border border-[#d9dde3] bg-white shadow-[0_2px_8px_rgba(17,24,39,0.08)]"
              >
                <div className="relative h-[230px] w-full">
                  <img
                    src="/img/assets/img_for_upcomingE.png"
                    alt={`event-${i}`}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute right-3 top-3 rounded-full bg-[#ef4444] px-3 py-1 text-[11px] font-semibold text-white">
                    Webinar
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="text-[clamp(1.3rem,1.55vw,1.75rem)] font-extrabold leading-[1.2] text-[#111827]">
                    Judul Upcoming Event 1
                  </h3>

                  <p className="mt-2 text-[clamp(0.95rem,1.05vw,1.08rem)] leading-[1.55] text-[#4b5563]">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                    exercitation ullamco laboris
                  </p>

                  <div className="mt-3 flex items-center gap-4 text-[0.78rem] sm:text-[0.82rem] text-[#6b7280]">
                    <span className="inline-flex items-center gap-1">
                      <img src="/img/icon/icon_people.svg" alt="" className="h-4 w-4" />
                      04 April 2026
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <img src="/img/icon/ticket-icon.svg" alt="" className="h-4 w-4" />
                      Kampus 4 UAD
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-7 flex items-center justify-between">
            <p className="text-[1.05rem] text-[#6b7280]">
              Menampilkan 6 event pilihan dari arsip terbaru.
            </p>
            <div className="flex items-center gap-3">
              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f7ecec] text-[#6b7280]">
                ←
              </button>
              <button className="h-10 w-10 rounded-full bg-[#d6362f] font-semibold text-white">1</button>
              <button className="h-10 w-10 rounded-full bg-[#f7ecec] font-semibold text-[#6b7280]">2</button>
              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f7ecec] text-[#6b7280]">
                →
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
