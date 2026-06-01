import React from "react";
import Link from "next/link";
import { db } from "@/db";
import {
  events,
  programs,
  partnerships,
  trainers,
  eventRegistrations,
  users,
} from "@/db/schema";
import { gte, lt, eq, and, count, countDistinct, desc } from "drizzle-orm";
import type { EventRow, ProgramRow } from "@/types/database";

type Alt1PageProps = {
  searchParams?:
    | Promise<{ view?: string | string[] }>
    | { view?: string | string[] };
};

/**
 * Fungsi: formatShortDate
 * Kegunaan: Mengambil string tanggal dari database dan mengubahnya menjadi format pendek.
 * Contoh Output: { day: "12", monthYear: "Okt 2026" }
 * Error Handling: Mengembalikan strip "-" jika data tanggal tidak valid atau kosong.
 */
function formatShortDate(dateStr?: string | null) {
  if (!dateStr) return { day: "-", monthYear: "-" };
  try {
    const cleanDate = dateStr.split("T")[0];
    const date = new Date(`${cleanDate}T00:00:00`);
    if (isNaN(date.getTime())) return { day: "-", monthYear: "-" };

    const day = new Intl.DateTimeFormat("id-ID", { day: "2-digit" }).format(
      date,
    );
    const monthYear = new Intl.DateTimeFormat("id-ID", {
      month: "short",
      year: "numeric",
    }).format(date);
    return { day, monthYear };
  } catch (e) {
    return { day: "-", monthYear: "-" };
  }
}

/**
 * Fungsi: formatLongDate
 * Kegunaan: Mengubah string tanggal menjadi format panjang dan formal berbahasa Indonesia.
 * Contoh Output: "12 Oktober 2026"
 */
function formatLongDate(dateStr?: string | null) {
  if (!dateStr) return "-";
  try {
    const cleanDate = dateStr.split("T")[0];
    const date = new Date(`${cleanDate}T00:00:00`);
    if (isNaN(date.getTime())) return "-";
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  } catch (e) {
    return "-";
  }
}

/**
 * Fungsi: formatEventPrice
 * Kegunaan: Mengubah angka numerik menjadi format mata uang Rupiah (IDR).
 * Contoh Output: "Rp 150.000" atau "Gratis" jika harga 0/null.
 */
function formatEventPrice(price?: number | null) {
  if (!price) return "Gratis";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Komponen Utama: Alt1Page (Server Component)
 * Kegunaan: Halaman landing page utama. Mengambil data dari Drizzle dan merender UI.
 */
export default async function Alt1Page({ searchParams }: Alt1PageProps) {
  // Resolusi searchParams (Bawaan aslimu)
  const resolvedSearchParams =
    searchParams instanceof Promise ? await searchParams : searchParams;
  const activeView = Array.isArray(resolvedSearchParams?.view)
    ? resolvedSearchParams?.view[0]
    : resolvedSearchParams?.view;

  // Mendapatkan string tanggal hari ini untuk perbandingan query database
  const today = new Date().toISOString().split("T")[0];

  // Query: Mengambil maksimal 10 event yang akan datang dan sudah dipublikasi
  const upcomingEvents: EventRow[] = await db
    .select()
    .from(events)
    .where(
      and(gte(events.eventDate, today as any), eq(events.isPublished, true)),
    )
    .limit(10);

  // Query: Mengambil maksimal 10 event yang sudah lewat
  const pastEvents: EventRow[] = await db
    .select()
    .from(events)
    .where(
      and(lt(events.eventDate, today as any), eq(events.isPublished, true)),
    )
    .limit(10);

  // Query: Mengambil daftar partnership untuk ditampilkan di logo marquee
  const partners = await db
    .select()
    .from(partnerships)
    .orderBy(desc(partnerships.id))
    .limit(20);

  // Query: Hitung total events yang dipublikasikan
  const totalEventsResult = await db
    .select({ count: count() })
    .from(events)
    .where(eq(events.isPublished, true));
  const totalEvents = totalEventsResult[0]?.count || 0;

  // Query: Hitung total trainers yang aktif
  const totalTrainersResult = await db
    .select({ count: count() })
    .from(trainers)
    .where(eq(trainers.isActive, true));
  const totalTrainers = totalTrainersResult[0]?.count || 0;

  // Query: Hitung total users unik yang sudah mendaftar event
  const totalUsersResult = await db
    .select({ count: countDistinct(eventRegistrations.userId) })
    .from(eventRegistrations);
  const totalActiveUsers = totalUsersResult[0]?.count || 0;

  // Query: Hitung total users yang terdaftar di platform
  const totalRegisteredUsersResult = await db
    .select({ count: count() })
    .from(users);
  const totalRegisteredUsers = totalRegisteredUsersResult[0]?.count || 0;

  return (
    <main className="min-h-screen bg-[#f3f4f6] text-[#111827]">
      {/* --- 1. HERO / ABOUT US SECTION --- */}
      <section
        id="about-us"
        className="mx-auto w-full max-w-6xl px-4 pb-12 pt-10 sm:px-6 lg:px-8 lg:pt-14"
      >
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h1 className="max-w-xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">
              Elevate Your Skills
              <br />
              With <span className="text-[#d6362f]">.id Academy</span>
            </h1>

            <p className="mt-6 max-w-xl text-sm leading-7 text-[#374151] sm:text-base">
              .id Academy merupakan program edukatif dari PANDI (Pengelola Nama
              Domain Internet Indonesia) yang bertujuan memberikan pemahaman
              mendalam tentang ekosistem digital Indonesia.
            </p>

            <p className="mt-4 max-w-xl text-sm leading-7 text-[#374151] sm:text-base">
              Melalui pelatihan, webinar, workshop dan kuliah umum, materi
              pembelajaran interaktif, PANDI Academy membantu individu dan
              institusi memahami pentingnya pengelolaan domain .id, keamanan
              siber, serta transformasi digital yang berkelanjutan.
            </p>

            <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:flex-wrap">
              <button className="w-full rounded-md bg-[#cf2f2a] px-6 py-3 text-sm font-bold tracking-wide text-white shadow-sm transition hover:bg-[#b92924] sm:w-auto">
                GET YOUR JOURNEY →
              </button>

              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="grid h-9 w-9 place-items-center rounded-full border-2 border-white bg-[#d1d5db] text-xs font-bold text-[#111827]">
                    SS
                  </div>
                  <div className="grid h-9 w-9 place-items-center rounded-full border-2 border-white bg-[#9ca3af] text-xs font-bold text-white">
                    SS
                  </div>
                  <div className="grid h-9 w-9 place-items-center rounded-full border-2 border-white bg-[#6b7280] text-xs font-bold text-white">
                    SS
                  </div>
                </div>
                <p className="text-sm font-semibold text-[#111827]">
                  {totalRegisteredUsers}+ orang
                  <span className="block text-xs font-normal text-[#4b5563]">
                    sudah bergabung
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-4 right-0 h-20 w-52 rounded-2xl bg-[#d6362f]/10 sm:h-24 sm:w-64" />
            <div className="relative overflow-hidden rounded-2xl shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80"
                alt="Cyber security training visual"
                className="h-[260px] w-full object-cover sm:h-[340px] lg:h-[360px]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#7f1d1d]/40 via-transparent to-[#111827]/30" />
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-black/5 bg-white p-6 shadow-sm sm:p-8">
          <div className="grid gap-8 text-center sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-4xl font-black text-[#cf2f2a]">
                {totalEvents}+
              </p>
              <p className="mt-2 text-sm font-semibold text-[#1f2937]">
                Events Terselenggara
              </p>
            </div>
            <div>
              <p className="text-4xl font-black text-[#cf2f2a]">
                {totalTrainers}+
              </p>
              <p className="mt-2 text-sm font-semibold text-[#1f2937]">
                Narasumber Ahli
              </p>
            </div>
            <div>
              <p className="text-4xl font-black text-[#cf2f2a]">
                {totalActiveUsers}+
              </p>
              <p className="mt-2 text-sm font-semibold text-[#1f2937]">
                Peserta Aktif
              </p>
            </div>
            <div>
              <p className="text-4xl font-black text-[#cf2f2a]">4.9/5</p>
              <p className="mt-2 text-sm font-semibold text-[#1f2937]">
                Rating Platform
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- 2. UPCOMING EVENTS SECTION --- */}
      <section
        id="upcoming-events"
        className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-[#111827]">
              Upcoming <span className="text-[#CB2229]">Events</span>
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Jangan lewatkan kesempatan untuk datang pada event yang akan
              mendorong karirmu.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/events/up-events"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-[#CB2229] px-5 py-2 text-sm font-semibold text-[#CB2229] transition hover:bg-red-50"
            >
              Lihat Selengkapnya →
            </Link>

            {upcomingEvents.length > 3 && (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  id="btn-scroll-left"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:bg-gray-50 hover:text-[#CB2229]"
                  aria-label="Geser ke Kiri"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </button>
                <button
                  id="btn-scroll-right"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:bg-gray-50 hover:text-[#CB2229]"
                  aria-label="Geser ke Kanan"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        <div
          id="carousel-container"
          className="mt-8 flex flex-nowrap w-full snap-x snap-mandatory gap-6 overflow-x-auto pb-4 pt-2 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {upcomingEvents.length === 0 ? (
            <div className="w-full flex-none rounded-2xl border border-dashed py-12 text-center text-sm text-gray-400">
              Belum ada event terjadwal di masa depan.
            </div>
          ) : (
            upcomingEvents.map((event) => {
              const { day, monthYear } = formatShortDate(event.eventDate);
              return (
                <div
                  key={event.id}
                  className="flex-none w-[85%] sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] snap-start flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="relative h-48 w-full bg-slate-100">
                    <img
                      src={
                        event.thumbnailUrl ||
                        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80"
                      }
                      alt={event.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute bottom-2 left-3 flex flex-col items-center rounded-xl bg-white px-3 py-1.5 shadow-md">
                      <span className="text-xl font-black leading-none text-[#CB2229]">
                        {day}
                      </span>
                      <span className="mt-0.5 text-[0.65rem] font-bold uppercase text-gray-500">
                        {monthYear}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
                      <span className="rounded bg-red-50 px-2 py-0.5 uppercase tracking-wider text-[#CB2229]">
                        {event.eventType}
                      </span>
                      <span>•</span>
                      <span>{event.startTime?.slice(0, 5) || "08:00"} WIB</span>
                      <span>•</span>
                      <span className="capitalize">
                        {event.deliveryMode?.replace("_", " ")}
                      </span>
                    </div>

                    <h3 className="mt-3 line-clamp-2 text-base font-bold text-gray-800">
                      {event.title}
                    </h3>

                    <p className="mt-2 line-clamp-2 flex-1 text-xs leading-relaxed text-gray-500">
                      {event.description ||
                        "Bergabunglah dalam sesi interaktif ini untuk meningkatkan wawasan digital Anda bersama expert."}
                    </p>

                    <div className="mt-5 flex items-center justify-between border-t border-gray-50 pt-4">
                      <div>
                        <span className="block text-[0.65rem] font-bold uppercase text-gray-400">
                          Biaya / Kuota
                        </span>
                        <span className="text-xs font-bold text-gray-800">
                          {formatEventPrice(
                            event.price ? parseFloat(event.price) : null,
                          )}{" "}
                          <span className="font-normal text-gray-400">
                            ({event.quota || 0} seat)
                          </span>
                        </span>
                      </div>
                      <Link
                        href={`/events/${event.id}`}
                        className="rounded-lg bg-[#CB2229] px-4 py-2 text-xs font-bold text-white transition hover:bg-red-700"
                      >
                        Daftar Sekarang →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* --- 3. PAST EVENTS SECTION (CAROUSEL) --- */}
      <section
        id="past-events"
        className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-[#111827]">
              Past <span className="text-[#CB2229]">Events</span>
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Arsip kegiatan inspiratif yang telah sukses diselenggarakan
              sebelumnya.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/events/past-events"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-[#CB2229] px-5 py-2 text-sm font-semibold text-[#CB2229] transition hover:bg-red-50"
            >
              Lihat Selengkapnya →
            </Link>

            {pastEvents.length > 3 && (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  id="btn-scroll-left-past"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:bg-gray-50 hover:text-[#CB2229]"
                  aria-label="Geser ke Kiri"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </button>
                <button
                  id="btn-scroll-right-past"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:bg-gray-50 hover:text-[#CB2229]"
                  aria-label="Geser ke Kanan"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        <div
          id="carousel-container-past"
          className="mt-8 flex flex-nowrap w-full snap-x snap-mandatory gap-6 overflow-x-auto pb-4 pt-2 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {pastEvents.length === 0 ? (
            <div className="w-full flex-none rounded-2xl border border-dashed py-12 text-center text-sm text-gray-400">
              Belum ada arsip event masa lalu.
            </div>
          ) : (
            pastEvents.map((event) => {
              const { day, monthYear } = formatShortDate(event.eventDate);
              return (
                <div
                  key={event.id}
                  className="flex-none w-[85%] sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] snap-start flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="relative h-48 w-full bg-slate-100">
                    <img
                      src={
                        event.thumbnailUrl ||
                        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80"
                      }
                      alt={event.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute bottom-2 left-3 flex flex-col items-center rounded-xl bg-white px-3 py-1.5 shadow-md">
                      <span className="text-xl font-black leading-none text-gray-500">
                        {day}
                      </span>
                      <span className="mt-0.5 text-[0.65rem] font-bold uppercase text-gray-400">
                        {monthYear}
                      </span>
                    </div>
                    {/* Badge Selesai */}
                    <div className="absolute right-3 top-3 rounded bg-black/70 px-2 py-1 backdrop-blur-sm">
                      <span className="text-[0.65rem] font-bold uppercase tracking-wider text-white">
                        Selesai
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
                      <span className="rounded bg-gray-100 px-2 py-0.5 uppercase tracking-wider text-gray-600">
                        {event.eventType}
                      </span>
                      <span>•</span>
                      <span>{event.startTime?.slice(0, 5) || "08:00"} WIB</span>
                      <span>•</span>
                      <span className="capitalize">
                        {event.deliveryMode?.replace("_", " ")}
                      </span>
                    </div>

                    <h3 className="mt-3 line-clamp-2 text-base font-bold text-gray-800">
                      {event.title}
                    </h3>

                    <p className="mt-2 line-clamp-2 flex-1 text-xs leading-relaxed text-gray-500">
                      {event.description ||
                        "Event ini telah selesai diselenggarakan. Terima kasih atas partisipasi Anda."}
                    </p>

                    <div className="mt-5 flex items-center justify-between border-t border-gray-50 pt-4">
                      <div>
                        <span className="block text-[0.65rem] font-bold uppercase text-gray-400">
                          Biaya / Kuota
                        </span>
                        <span className="text-xs font-bold text-gray-800">
                          {formatEventPrice(
                            event.price ? parseFloat(event.price) : null,
                          )}{" "}
                          <span className="font-normal text-gray-400">
                            ({event.quota || 0} seat)
                          </span>
                        </span>
                      </div>
                      <Link
                        href={`/events/${event.id}`}
                        className="rounded-lg bg-gray-100 px-4 py-2 text-xs font-bold text-gray-600 transition hover:bg-gray-200"
                      >
                        Lihat Detail →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* SCRIPT INJEKSI VANILLA JS (GABUNGAN UPCOMING & PAST EVENTS) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Logika untuk Upcoming Events
                const btnLeft = document.getElementById('btn-scroll-left');
                const btnRight = document.getElementById('btn-scroll-right');
                const carousel = document.getElementById('carousel-container');
                
                if (carousel) {
                  if (btnLeft) {
                    btnLeft.addEventListener('click', function() {
                      carousel.scrollBy({ left: -(carousel.clientWidth / 1.5), behavior: 'smooth' });
                    });
                  }
                  if (btnRight) {
                    btnRight.addEventListener('click', function() {
                      carousel.scrollBy({ left: (carousel.clientWidth / 1.5), behavior: 'smooth' });
                    });
                  }
                }

                // Logika untuk Past Events
                const btnLeftPast = document.getElementById('btn-scroll-left-past');
                const btnRightPast = document.getElementById('btn-scroll-right-past');
                const carouselPast = document.getElementById('carousel-container-past');
                
                if (carouselPast) {
                  if (btnLeftPast) {
                    btnLeftPast.addEventListener('click', function() {
                      carouselPast.scrollBy({ left: -(carouselPast.clientWidth / 1.5), behavior: 'smooth' });
                    });
                  }
                  if (btnRightPast) {
                    btnRightPast.addEventListener('click', function() {
                      carouselPast.scrollBy({ left: (carouselPast.clientWidth / 1.5), behavior: 'smooth' });
                    });
                  }
                }
              })();
            `,
          }}
        />
      </section>

      {/* --- 4. OUR PARTNERS SECTION --- */}
      <section
        id="our-partners"
        className="mx-auto w-full max-w-6xl overflow-hidden px-4 py-12 mt-16 text-center sm:px-6 lg:px-8"
      >
        <h2 className="text-2xl font-black text-[#111827]">Our Partners</h2>
        <p className="mt-1 text-xs font-bold uppercase tracking-widest text-[#CB2229]">
          DIPERCAYA OLEH MITRA KAMI
        </p>

        <div className="relative mt-10 flex w-full overflow-hidden mask-gradient">
          {partners.length === 0 ? (
            <div className="mx-auto text-xs text-gray-400">
              Belum ada logo partner yang diaktifkan.
            </div>
          ) : (
            <div
              className="flex w-max shrink-0 items-center gap-12 sm:gap-20"
              style={{ animation: "marquee 20s linear infinite" }}
            >
              {[...partners, ...partners].map((p, index) => (
                <div
                  key={`${p.id}-${index}`}
                  className="flex h-32 w-32 shrink-0 items-center justify-center p-4 transition-all duration-300 sm:h-48 sm:w-48"
                >
                  <img
                    src={p.logoUrl || ""}
                    alt={p.name || "Partner Logo"}
                    className="h-full w-full object-contain filter grayscale transition-all duration-300 hover:filter-none"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          .mask-gradient {
            mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
            -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          }
        `}</style>
      </section>
    </main>
  );
}
