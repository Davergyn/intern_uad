import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us â€“ .id Academy",
  description:
    "Pelajari lebih lanjut tentang .id Academy, program inisiatif PANDI untuk peningkatan literasi digital Indonesia.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f3f4f6] text-[#111827]">

      {/* â”€â”€ About Section â”€â”€ */}
      <section
        id="about-hero"
        className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 pt-14 pb-48"
      >
        <div className="flex items-start gap-10 lg:gap-16">

          {/* â”€â”€ Left: Photo / Asset placeholder â”€â”€ */}
          {/* hidden on mobile (< sm), shrinks on tablet, full on desktop */}
          <div className="
            hidden sm:block
            flex-shrink-0
            w-[220px] md:w-[280px] lg:w-[380px]
            self-start
          ">
            <div className="
              aspect-[3/4]
              w-full
              rounded-2xl
              border-2 border-dashed border-[#d1d5db]
              bg-[#f9fafb]
              flex items-center justify-center
            ">
              {/* placeholder icon */}
              <div className="text-center px-4">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#d6362f]/10">
                  <svg
                    className="h-7 w-7 text-[#d6362f]/50"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 18.75V7.5A2.25 2.25 0 015.25 5.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9H5.25"
                    />
                  </svg>
                </div>
                <p className="text-xs font-medium text-[#9ca3af] leading-relaxed">
                  Foto / Aset<br />akan ditambahkan
                </p>
              </div>
            </div>
          </div>

          {/* â”€â”€ Right: Text content â”€â”€ */}
          <div className="flex flex-col gap-3 min-w-0">
            <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl">
              Tentang{" "}
              <span className="text-[#d6362f]">.id Academy</span>
            </h1>

            <p className="mt-2 text-sm leading-7 text-[#374151] sm:text-base">
              .id Academy merupakan program inisiatif dari Pengelola Nama Domain
              Internet Indonesia (PANDI) yang berfokus pada peningkatan literasi
              digital masyarakat Indonesia, khususnya dalam pemanfaatan teknologi
              dan pengembangan identitas digital melalui penggunaan nama domain
              .id. Program ini dirancang sebagai wadah edukasi, pelatihan, dan
              kolaborasi antara PANDI dengan berbagai mitra strategis, seperti
              perguruan tinggi, lembaga pendidikan, dan pelaku industri digital
              nasional.
            </p>

            <p className="text-sm leading-7 text-[#374151] sm:text-base">
              Melalui berbagai kegiatan seperti Training of Trainer (ToT), Kuliah
              Umum, dan Workshop, .id Academy berupaya mencetak generasi digital
              yang kompeten, kreatif, dan siap menghadapi tantangan di era
              transformasi digital.
            </p>
          </div>

        </div>
      </section>    </main>
  );
}
