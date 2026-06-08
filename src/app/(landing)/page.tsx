import React from "react";
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
      <UpcomingCarousel upcomingEvents={upcomingEvents} />

      {/* --- 3. PAST EVENTS SECTION (CAROUSEL) --- */}
      <PastCarousel pastEvents={pastEvents} />

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
