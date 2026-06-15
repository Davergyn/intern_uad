import React from "react";
import Link from "next/link"; // <-- Tambahkan import Link
import {
  fetchLandingPageData,
} from "./_lib/landing-helpers";
import UpcomingCarousel from "./_components/UpcomingCarousel";
import PastCarousel from "./_components/PastCarousel";

type Alt1PageProps = {
  searchParams?:
  | Promise<{ view?: string | string[] }>
  | { view?: string | string[] };
};

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

  // Fetch semua data landing page dari helpers (query dijalankan secara paralel)
  const {
    upcomingEvents,
    pastEvents,
    partners,
    totalEvents,
    totalTrainers,
    totalActiveUsers,
    totalRegisteredUsers,
  } = await fetchLandingPageData();

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
              AcademyID merupakan program edukatif dari PANDI (Pengelola Nama
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
              <Link
                href="/login"
                className="inline-flex w-full items-center justify-center rounded-md bg-[#cf2f2a] px-6 py-3 text-sm font-bold tracking-wide text-white shadow-sm transition hover:bg-[#b92924] sm:w-auto"
              >
                GET YOUR JOURNEY →
              </Link>

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
            <div className="relative overflow-hidden rounded-2xl shadow-xl">
              <img
                src="/assets/aboutus.jpeg"
                alt="Kantor Academy ID"
                className="h-[260px] w-full object-cover sm:h-[340px] lg:h-[360px]"
              />
              <div className="pointer-events-none absolute inset-0 to-[#111827]/30" />
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
      <UpcomingCarousel upcomingEvents={upcomingEvents} />

      {/* --- 3. PAST EVENTS SECTION (CAROUSEL) --- */}
      <PastCarousel pastEvents={pastEvents} />

      {/* --- MENGAPA MEMILIH KAMI SECTION (Red Background) --- */}
      <section className="relative overflow-hidden py-20 sm:py-24">

        {/* Dekorasi Background */}
        <div className="pointer-events-none absolute left-0 top-0 -ml-32 -mt-32 h-96 w-96 rounded-full border-[40px] border-white/5" />
        <div className="pointer-events-none absolute right-0 bottom-0 -mb-32 -mr-32 h-96 w-96 rounded-full border-[40px] border-white/5" />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-[#cf2f2a] sm:text-4xl">
              Mengapa Memilih Kami?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg ">
              Empat keunggulan .id Academy sebagai mitra perjalanan digital kamu.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

            {/* Card 1 */}
            <div className="rounded-3xl bg-white p-8 shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/20">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-[#CB2229]">
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="mb-3 text-lg font-bold text-[#cf2f2a]">Kurikulum Terstruktur</h3>
              <p className="text-sm leading-relaxed text-gray-500">
                Materi pembelajaran dirancang oleh ahli sesuai standar industri dan kebutuhan ekosistem digital Indonesia.
              </p>
            </div>

            {/* Card 2 */}
            <div className="rounded-3xl bg-white p-8 shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/20">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="mb-3 text-lg font-bold text-[#cf2f2a]">Mentor Berpengalaman</h3>
              <p className="text-sm leading-relaxed text-gray-500">
                Belajar langsung dari praktisi dan trainer .id Academy yang sudah berpengalaman di bidangnya.
              </p>
            </div>

            {/* Card 3 */}
            <div className="rounded-3xl bg-white p-8 shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/20">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="mb-3 text-lg font-bold text-[#cf2f2a]">Sertifikat Resmi</h3>
              <p className="text-sm leading-relaxed text-gray-500">
                Dapatkan sertifikat digital resmi yang dapat diverifikasi setelah menyelesaikan program.
              </p>
            </div>

            {/* Card 4 */}
            <div className="rounded-3xl bg-white p-8 shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/20">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-[#CB2229]">
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="mb-3 text-lg font-bold text-[#cf2f2a]">Komunitas Aktif</h3>
              <p className="text-sm leading-relaxed text-gray-500">
                Bergabung dengan ribuan peserta aktif untuk networking, kolaborasi, dan diskusi seputar dunia digital.
              </p>
            </div>
          </div>

          {/* Tombol Aksi */}
          <div className="mt-14 flex flex-col items-center justify-center">
            <Link
              href="/programs"
              className="group flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-bold text-[#10b981] shadow-lg transition-all hover:bg-gray-50 active:scale-95"
            >
              Mulai Belajar Gratis
              <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <p className="mt-4 text-xs font-medium text-white/80">
              Gratis • Tanpa kartu kredit • Akses materi langsung
            </p>
          </div>
        </div>
      </section>

      {/* --- 4. OUR PARTNERS SECTION --- */}
      <section
        id="our-partners"
        className="mx-auto w-full max-w-6xl overflow-hidden px-4 py-12 text-center sm:px-6 lg:px-8"
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
                    src={p.imageUrl || "undefined"}
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