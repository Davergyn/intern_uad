import React from "react";
import Link from "next/link";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
// Import Supabase Server Client (Sesuaikan path import dengan struktur foldermu)
import { createServerSupabaseClient } from "@/utils/supabase/server";
import type { EventRow, ProgramRow } from "@/types/database";

type Alt1PageProps = {
  searchParams?: Promise<{ view?: string | string[] }> | { view?: string | string[] };
};

// Helper: Format tanggal aman dari error "Invalid time value"
function formatShortDate(dateStr?: string | null) {
  if (!dateStr) return { day: "-", monthYear: "-" };
  try {
    const cleanDate = dateStr.split("T")[0];
    const date = new Date(`${cleanDate}T00:00:00`);
    if (isNaN(date.getTime())) return { day: "-", monthYear: "-" };

    const day = new Intl.DateTimeFormat("id-ID", { day: "2-digit" }).format(date);
    const monthYear = new Intl.DateTimeFormat("id-ID", { month: "short", year: "numeric" }).format(date);
    return { day, monthYear };
  } catch (e) {
    return { day: "-", monthYear: "-" };
  }
}

// Helper: Format tanggal panjang untuk list horizontal
function formatLongDate(dateStr?: string | null) {
  if (!dateStr) return "-";
  try {
    const cleanDate = dateStr.split("T")[0];
    const date = new Date(`${cleanDate}T00:00:00`);
    if (isNaN(date.getTime())) return "-";
    return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(date);
  } catch (e) {
    return "-";
  }
}

// Helper: Format harga
function formatEventPrice(price?: number | null) {
  if (!price) return "Gratis";
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(price);
}

export default async function Alt1Page({ searchParams }: Alt1PageProps) {
  // Resolusi searchParams (Bawaan aslimu)
  const resolvedSearchParams = searchParams instanceof Promise ? await searchParams : searchParams;
  const activeView = Array.isArray(resolvedSearchParams?.view)
    ? resolvedSearchParams?.view[0]
    : resolvedSearchParams?.view;

  // --- 1. FETCHING DATA DARI SUPABASE (SERVER-SIDE) ---
  const supabase = createServerSupabaseClient();
  
  // Dapatkan tanggal hari ini (YYYY-MM-DD) di server untuk filtering waktu
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" });

  // Ambil Data Events (Hanya yang dipublish)
  const { data: rawEvents } = await supabase
    .from("events")
    .select("id, title, description, type, delivery, event_date, start_time, end_time, quota, price, thumbnail_url, is_published")
    .eq("is_published", true);

  const events = (rawEvents || []) as EventRow[];

  // Pemisahan Waktu Otomatis (Time-Based Filtering)
  const upcomingEvents = events
    .filter((e) => e.event_date && e.event_date >= today)
    .sort((a, b) => (a.event_date || "").localeCompare(b.event_date || ""))
    .slice(0, 3); // Ambil 3 terdekat

  const pastEvents = events
    .filter((e) => e.event_date && e.event_date < today)
    .sort((a, b) => (b.event_date || "").localeCompare(a.event_date || ""))
    .slice(0, 3); // Ambil 3 terbaru yang sudah selesai

  // Ambil Data Partner (Hanya kategori 'partnership' yang aktif)
  const { data: rawPartners } = await supabase
    .from("programs")
    .select("id, title, image_url, is_active")
    .eq("is_active", true)
    .eq("kategori", "partnership");

  const partners = (rawPartners || []) as ProgramRow[];

  return (
    <main className="min-h-screen bg-[#f3f4f6] text-[#111827]">
      <Navbar />

      {/* --- HERO / ABOUT US SECTION (BAWAAN ASLIMU) --- */}
      <section id="about-us" className="mx-auto w-full max-w-6xl px-4 pb-12 pt-10 sm:px-6 lg:px-8 lg:pt-14">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h1 className="max-w-xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">
              Elevate Your Skills
              <br />
              With <span className="text-[#d6362f]">.id Academy</span>
            </h1>

            <p className="mt-6 max-w-xl text-sm leading-7 text-[#374151] sm:text-base">
              .id Academy merupakan program edukatif dari PANDI (Pengelola Nama Domain
              Internet Indonesia) yang bertujuan memberikan pemahaman mendalam tentang
              ekosistem digital Indonesia.
            </p>

            <p className="mt-4 max-w-xl text-sm leading-7 text-[#374151] sm:text-base">
              Melalui pelatihan, webinar, workshop dan kuliah umum, materi pembelajaran
              interaktif, PANDI Academy membantu individu dan institusi memahami pentingnya
              pengelolaan domain .id, keamanan siber, serta transformasi digital yang
              berkelanjutan.
            </p>

            <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:flex-wrap">
              <button className="w-full rounded-md bg-[#cf2f2a] px-6 py-3 text-sm font-bold tracking-wide text-white shadow-sm transition hover:bg-[#b92924] sm:w-auto">
                GET YOUR JOURNEY →
              </button>

              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="grid h-9 w-9 place-items-center rounded-full border-2 border-white bg-[#d1d5db] text-xs font-bold text-[#111827]">SS</div>
                  <div className="grid h-9 w-9 place-items-center rounded-full border-2 border-white bg-[#9ca3af] text-xs font-bold text-white">SS</div>
                  <div className="grid h-9 w-9 place-items-center rounded-full border-2 border-white bg-[#6b7280] text-xs font-bold text-white">SS</div>
                </div>
                <p className="text-sm font-semibold text-[#111827]">
                  5000+ orang
                  <span className="block text-xs font-normal text-[#4b5563]">sudah bergabung</span>
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
              <p className="text-4xl font-black text-[#cf2f2a]">50+</p>
              <p className="mt-2 text-sm font-semibold text-[#1f2937]">Events Terselenggara</p>
            </div>
            <div>
              <p className="text-4xl font-black text-[#cf2f2a]">1000+</p>
              <p className="mt-2 text-sm font-semibold text-[#1f2937]">Narasumber Ahli</p>
            </div>
            <div>
              <p className="text-4xl font-black text-[#cf2f2a]">5000+</p>
              <p className="mt-2 text-sm font-semibold text-[#1f2937]">Peserta Aktif</p>
            </div>
            <div>
              <p className="text-4xl font-black text-[#cf2f2a]">4.9/5</p>
              <p className="mt-2 text-sm font-semibold text-[#1f2937]">Rating Platform</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- 2. UPCOMING EVENTS SECTION (GRID 3 KOLOM) --- */}
      <section id="upcoming-events" className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-[#111827]">
              Upcoming <span className="text-[#CB2229]">Events</span>
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Jangan lewatkan kesempatan untuk datang pada event yang akan mendorong karirmu.
            </p>
          </div>
          <Link
            href="/events"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-[#CB2229] px-5 py-2 text-sm font-semibold text-[#CB2229] transition hover:bg-red-50"
          >
            Lihat Selengkapnya →
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {upcomingEvents.length === 0 ? (
            <div className="col-span-3 rounded-2xl border border-dashed py-12 text-center text-sm text-gray-400">
              Belum ada event terjadwal di masa depan.
            </div>
          ) : (
            upcomingEvents.map((event) => {
              const { day, monthYear } = formatShortDate(event.event_date);
              return (
                <div key={event.id} className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md">
                  {/* Thumbnail & Tanggal floating */}
                  <div className="relative h-48 w-full bg-slate-100">
                    <img
                      src={event.thumbnail_url || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80"}
                      alt={event.title}
                      className="h-full w-full object-cover"
                    />
                    {/* Badge Tanggal persis batas kiri bawah gambar */}
                    <div className="absolute bottom-2 left-3 flex flex-col items-center rounded-xl bg-white px-3 py-1.5 shadow-md">
                      <span className="text-xl font-black leading-none text-[#CB2229]">{day}</span>
                      <span className="mt-0.5 text-[0.65rem] font-bold uppercase text-gray-500">{monthYear}</span>
                    </div>
                  </div>

                  {/* Konten Utama */}
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
                      <span className="rounded bg-red-50 px-2 py-0.5 uppercase tracking-wider text-[#CB2229]">
                        {event.type}
                      </span>
                      <span>•</span>
                      <span>{event.start_time?.slice(0, 5) || "08:00"} WIB</span>
                      <span>•</span>
                      <span className="capitalize">{event.delivery?.replace("_", " ")}</span>
                    </div>

                    <h3 className="mt-3 line-clamp-2 text-base font-bold text-gray-800">
                      {event.title}
                    </h3>

                    <p className="mt-2 line-clamp-2 flex-1 text-xs leading-relaxed text-gray-500">
                      {event.description || "Bergabunglah dalam sesi interaktif ini untuk meningkatkan wawasan digital Anda bersama expert."}
                    </p>

                    {/* Footer Card: Kuota/Harga & Tombol */}
                    <div className="mt-5 flex items-center justify-between border-t border-gray-50 pt-4">
                      <div>
                        <span className="block text-[0.65rem] font-bold uppercase text-gray-400">Biaya / Kuota</span>
                        <span className="text-xs font-bold text-gray-800">
                          {formatEventPrice(event.price)} <span className="font-normal text-gray-400">({event.quota || 0} seat)</span>
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

      {/* --- 3. PAST EVENTS SECTION (LIST HORIZONTAL CARD) --- */}
      <section id="past-events" className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-[#111827]">
              Past <span className="text-[#CB2229]">Events</span>
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              Arsip kegiatan inspiratif yang telah sukses diselenggarakan sebelumnya.
            </p>
          </div>
          <Link
            href="/events?tab=past"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-gray-200 px-4 py-1.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-50"
          >
            Lihat Selengkapnya →
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {pastEvents.length === 0 ? (
            <div className="col-span-3 rounded-xl border border-dashed py-8 text-center text-xs text-gray-400">
              Belum ada arsip event masa lalu.
            </div>
          ) : (
            pastEvents.map((event) => (
              <div key={event.id} className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-3 shadow-xs">
                {/* Thumbnail Mini */}
                <img
                  src={event.thumbnail_url || "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=300&q=80"}
                  alt={event.title}
                  className="h-20 w-24 shrink-0 object-cover rounded-lg"
                />

                {/* Info Singkat */}
                <div className="flex flex-1 flex-col overflow-hidden">
                  <div className="flex items-center gap-1.5 text-[0.65rem] font-bold text-gray-400">
                    <span className="uppercase text-[#CB2229]">{event.type}</span>
                    <span>•</span>
                    <span className="truncate">{formatLongDate(event.event_date)}</span>
                  </div>

                  <h3 className="mt-1 line-clamp-2 text-xs font-bold leading-tight text-gray-800">
                    {event.title}
                  </h3>

                  {/* Badge Selesai di sudut bawah */}
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[0.65rem] text-gray-400 truncate">{event.quota || 0} Peserta</span>
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[0.65rem] font-bold text-emerald-600">
                      Selesai
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* --- 4. OUR PARTNERS SECTION (INFINITE MARQUEE LOGO DINAMIS) --- */}
      <section id="our-partners" className="mx-auto w-full max-w-6xl overflow-hidden px-4 py-12 text-center sm:px-6 lg:px-8">
        <h2 className="text-2xl font-black text-[#111827]">Our Partners</h2>
        <p className="mt-1 text-xs font-bold uppercase tracking-widest text-[#CB2229]">
          DIPERCAYA OLEH MITRA KAMI
        </p>

        {/* Kontainer Marquee dengan penutup bayangan (fade) di kiri & kanan */}
        <div className="relative mt-10 flex w-full overflow-hidden mask-gradient">
          {partners.length === 0 ? (
            <div className="mx-auto text-xs text-gray-400">Belum ada logo partner yang diaktifkan.</div>
          ) : (
            /* Kontainer Track Animasi: Menggunakan inline style khusus untuk memicu 
              animasi mulus ke kiri. Kita render array 2 kali agar looping-nya infinite.
            */
            <div 
              className="flex w-max shrink-0 items-center gap-16 sm:gap-24"
              style={{
                animation: "marquee 25s linear infinite",
              }}
            >
              {[...partners, ...partners].map((p, index) => (
                <img
                  // Gunakan kombinasi id dan index agar key tetap unik saat diduplikasi
                  key={`${p.id}-${index}`} 
                  src={p.image_url || ""}
                  alt={p.title || "Partner Logo"}
                  // Ukuran diperbesar (h-16 / h-20) dengan efek hover berwarna
                  className="h-16 w-auto shrink-0 object-contain transition-all duration-300 filter grayscale hover:filter-none sm:h-20"
                />
              ))}
            </div>
          )}
        </div>

        {/* Definisi Keyframes Animasi langsung disisipkan via tag <style> 
          agar tidak perlu repot mengedit file tailwind.config.ts
        */}
        <style>{`
          @keyframes marquee {
            0% {
              transform: translateX(0%);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          /* Efek opsional: Membuat ujung kiri dan kanan sedikit memudar */
          .mask-gradient {
            mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
            -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          }
        `}</style>
      </section>

      <Footer />
    </main>
  );
}