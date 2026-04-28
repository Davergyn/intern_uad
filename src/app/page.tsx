import React from "react";
import Navbar from "./navbar";
import UpcomingEvents from "./main_page/upcoming_events";
import PastEvents from "./main_page/past_events";
import PassEventsPage from "./pass_events";
import WhyChooseUs from "./main_page/why_choose_us";
import WhatTheySay from "./main_page/what_they_say";
import OurPartners from "./main_page/our_partners";
import Footer from "./footer";

type Alt1PageProps = {
  searchParams?: Promise<{ view?: string | string[] }> | { view?: string | string[] };
};

export default async function Alt1Page({ searchParams }: Alt1PageProps) {
  const resolvedSearchParams = searchParams instanceof Promise ? await searchParams : searchParams;
  const activeView = Array.isArray(resolvedSearchParams?.view)
    ? resolvedSearchParams?.view[0]
    : resolvedSearchParams?.view;

  if (activeView === "pass_events") {
    return <PassEventsPage />;
  }

  return (
    <main className="min-h-screen bg-[#f3f4f6] text-[#111827]">
      <Navbar />

      <section className="mx-auto w-full max-w-6xl px-4 pb-12 pt-10 sm:px-6 lg:px-8 lg:pt-14">
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

            <div className="mt-8 flex flex-wrap items-center gap-5">
              <button className="rounded-md bg-[#cf2f2a] px-6 py-3 text-sm font-bold tracking-wide text-white shadow-sm transition hover:bg-[#b92924]">
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
      <UpcomingEvents />
      <PastEvents />
      <WhyChooseUs />
      <WhatTheySay />
      <OurPartners />
      <Footer />
    </main>
  );
}