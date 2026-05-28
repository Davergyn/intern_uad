import React from "react";

export const metadata = {
  title: "Contact Us â€“ .id Academy",
  description:
    "Hubungi tim .id Academy â€“ kami siap membantu Anda melalui telepon, email, maupun Instagram @dotidacademy.",
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//  PAGE
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function ContactUsPage() {
  return (
    <main className="min-h-screen bg-white text-[#111827]">

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          TOP SECTION â€” grey background
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section className="relative bg-[#f3f4f6] pt-20 pb-32 lg:pb-36">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">

            {/* â”€â”€ Left: Heading â”€â”€ */}
            <div className="flex-1">
              <h1 className="text-4xl font-extrabold leading-tight text-[#1f2937] lg:text-5xl">
                .id Academy
              </h1>
              <p className="mt-4 text-[1.1rem] leading-relaxed text-[#4b5563]">
                Contact us with pleasure on Instagram
                <br />
                <a
                  href="https://instagram.com/dotidacademy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#1f2937] transition hover:text-[#d6362f]"
                >
                  @dotidacademy
                </a>
              </p>
            </div>

            {/* â”€â”€ Right: Monitor image (overlaps downward) â”€â”€ */}
            <div className="relative w-full lg:w-[480px] lg:flex-shrink-0 lg:-mb-28">
              <div className="overflow-hidden rounded-xl shadow-2xl bg-[#e5e7eb] aspect-[4/3] flex items-center justify-center">
                {/* Placeholder â€” replace src with actual image */}
                <div className="flex flex-col items-center justify-center gap-3 opacity-30 p-10">
                  <svg
                    className="h-20 w-20 text-[#6b7280]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 7.409A2.25 2.25 0 012.25 5.493V5.25"
                    />
                  </svg>
                  <p className="text-sm font-medium text-[#9ca3af]">
                    Gambar akan ditambahkan
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          BOTTOM SECTION â€” white background
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section className="bg-white pt-12 pb-24">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:gap-16">

            {/* â”€â”€ Call Us card (overlaps upward) â”€â”€ */}
            <div className="w-full lg:w-[420px] lg:flex-shrink-0 -mt-20 lg:-mt-24 relative z-10">
              <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl">
                <h2 className="mb-6 text-2xl font-bold text-[#1f2937]">Call Us</h2>

                {/* Phone */}
                <p className="text-[0.95rem] font-bold text-[#1f2937]">
                  Contact our award-winning support team :
                </p>
                <a
                  href="tel:+622130055777"
                  className="mt-1 block text-[1rem] font-bold text-[#0ea5e9] transition hover:underline"
                >
                  +622130055777
                </a>

                {/* Email */}
                <p className="mt-6 text-[0.95rem] font-bold text-[#1f2937]">
                  Or contact our email support team :
                </p>
                <a
                  href="mailto:literasi@pandi.id"
                  className="mt-1 block text-[1rem] font-bold text-[#0ea5e9] transition hover:underline"
                >
                  literasi@pandi.id
                </a>

                {/* Extra info */}
                <div className="mt-8 flex items-center gap-3 rounded-xl bg-[#f9fafb] px-4 py-3">
                  <svg
                    className="h-5 w-5 flex-shrink-0 text-[#10b981]"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-xs text-[#6b7280]">
                    Kami siap membantu Seninâ€“Jumat, pukul 08.00â€“17.00 WIB.
                  </p>
                </div>
              </div>
            </div>

            {/* â”€â”€ Right: Additional info / spacer on desktop â”€â”€ */}
            <div className="mt-10 flex-1 lg:mt-0 lg:pt-6">
              <h2 className="text-2xl font-bold text-[#1f2937]">
                Ada yang bisa kami bantu?
              </h2>
              <p className="mt-3 text-[0.95rem] leading-7 text-[#6b7280]">
                Tim .id Academy siap menjawab pertanyaan Anda seputar program
                pelatihan, pendaftaran, materi, maupun kemitraan. Jangan ragu
                untuk menghubungi kami melalui saluran yang tersedia.
              </p>

              {/* Contact options */}
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  {
                    label: "Instagram",
                    value: "@dotidacademy",
                    href: "https://instagram.com/dotidacademy",
                    icon: (
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
                        <rect x="5" y="5" width="14" height="14" rx="4" />
                        <circle cx="12" cy="12" r="3.2" />
                        <circle cx="16.7" cy="7.3" r="1" fill="currentColor" stroke="none" />
                      </svg>
                    ),
                  },
                  {
                    label: "Email",
                    value: "literasi@pandi.id",
                    href: "mailto:literasi@pandi.id",
                    icon: (
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                    ),
                  },
                  {
                    label: "Telepon",
                    value: "+622130055777",
                    href: "tel:+622130055777",
                    icon: (
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                      </svg>
                    ),
                  },
                ].map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="group flex flex-col gap-2 rounded-xl border border-gray-100 bg-[#f9fafb] p-4 transition hover:border-[#d6362f]/30 hover:shadow-sm"
                  >
                    <span className="text-[#6b7280] transition group-hover:text-[#d6362f]">
                      {item.icon}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wide text-[#9ca3af]">
                      {item.label}
                    </span>
                    <span className="text-sm font-bold text-[#1f2937] break-all">
                      {item.value}
                    </span>
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>    </main>
  );
}
