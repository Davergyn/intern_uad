import React from "react";

export const metadata = {
  title: "Contact Us – .id Academy",
  description: "Punya pertanyaan atau ingin berkolaborasi? Hubungi tim .id Academy.",
};

export default function ContactUsPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* ══════════════════════════════════════════════════════════════════════
          1. HERO SECTION (MAP SEBAGAI BACKGROUND TAJAM)
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative pt-24 pb-48 lg:pt-32 lg:pb-56 overflow-hidden">

        {/* ── Background Map & Overlay ── */}
        <div className="absolute inset-0 z-0">
          <iframe
            src="https://www.google.com/maps?q=Pengelola+Nama+Domain+Internet+Indonesia+(PANDI)+Icon+Business+Park+BSD&output=embed"
            className="h-full w-full border-0"
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Lokasi .id Academy (PANDI)"
          ></iframe>

          {/* >>> PERBAIKAN: Gradien Putih Tipis di kiri agar teks terbaca,
              tapi map tetap tajam dan jelas di kanan <<< */}
          <div className="absolute inset-0 bg-linear-to-r from-white/70 via-white/40 to-transparent"></div>
        </div>

        {/* ── Konten Teks di Atas Map ── */}
        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            {/* Warna teks diubah menjadi gelap agar terbaca di atas map terang */}
            <h1 className="text-4xl font-extrabold text-[#1f2937] lg:text-5xl">
              Hubungi Kami
            </h1>
            <p className="mt-4 text-[1.1rem] leading-relaxed text-[#4b5563] font-medium">
              Punya pertanyaan atau ingin berkolaborasi? Jangan ragu untuk menghubungi kami.<br />
              {/* Link Instagram tetap merah agar menonjol */}
              <a href="https://instagram.com/dotidacademy" className="font-semibold text-[#CB2229] underline decoration-[#CB2229]/30 underline-offset-4 transition hover:text-[#a01b20]">
                @dotidacademy
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          2. FLOATING CONTACT INFO BAR (Seperti di Gambar_3.png)
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative z-20 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 -mt-20 lg:-mt-24">
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-xl grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">

          {/* Telepon (Merah) */}
          <a href="tel:+622130055777" className="group flex items-center justify-between p-4 transition-colors hover:bg-gray-50 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-[#CB2229]">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Telepon</p>
                <p className="text-sm font-bold text-gray-900">+62 21 3005 5777</p>
              </div>
            </div>
            <svg className="h-4 w-4 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-[#CB2229]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </a>

          {/* Email (Emerald) */}
          <a href="mailto:literasi@pandi.id" className="group flex items-center justify-between p-4 transition-colors hover:bg-gray-50 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Email</p>
                <p className="text-sm font-bold text-gray-900">literasi@pandi.id</p>
              </div>
            </div>
            <svg className="h-4 w-4 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </a>

{/* Alamat (Merah) */}
          <a 
            href="https://www.google.com/maps/search/?api=1&query=Pandi+Registry&query_place_id=ChIJ9-VWyLnkaS4RZUTUPJ2LjNk" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="group flex items-center justify-between p-4 transition-colors hover:bg-gray-50 rounded-xl"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-[#CB2229]">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Alamat</p>
                <p className="text-sm font-bold text-gray-900 line-clamp-1">Icon Business Park Unit L...</p>
              </div>
            </div>
            {/* Ikon panah miring (↗) sebagai indikator link eksternal */}
            <svg className="h-4 w-4 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-[#CB2229]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>

          {/* Instagram (Merah) */}
          <a href="https://instagram.com/dotidacademy" target="_blank" rel="noreferrer" className="group flex items-center justify-between p-4 transition-colors hover:bg-gray-50 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-[#CB2229]">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Instagram</p>
                <p className="text-sm font-bold text-gray-900">@dotidacademy</p>
              </div>
            </div>
            <svg className="h-4 w-4 text-gray-400 group-hover:text-[#CB2229]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          </a>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          3. MAIN CONTENT (Seperti di Gambar_3.png)
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* ── Kiri: Judul & Benefit (Style Emerald & Dark Red) ── */}
          <div>
            <span className="text-xs font-black tracking-widest text-emerald-600 uppercase">Kirim Pesan</span>
            <h2 className="mt-3 text-4xl font-extrabold text-[#9A1B1F] leading-tight lg:text-5xl">
              Atau tulis pesan ke tim kami
            </h2>
            <p className="mt-5 text-gray-600 leading-relaxed text-[1.05rem]">
              Punya pertanyaan, kerjasama, atau saran? Isi form di samping dan tim .id Academy akan membalas pesan kamu.
            </p>

            <div className="mt-10 flex flex-col gap-8">
              {/* Feature 1 */}
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-[#CB2229]">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>
                </div>
                <div>
                  <h3 className="font-bold text-[#9A1B1F]">Balasan Personal</h3>
                  <p className="text-sm text-gray-500 mt-1">Dijawab langsung oleh tim .id Academy</p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                  <h3 className="font-bold text-emerald-600">Gratis & Tanpa Syarat</h3>
                  <p className="text-sm text-gray-500 mt-1">Tidak ada biaya untuk konsultasi atau pertanyaan</p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-[#CB2229]">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                <div>
                  <h3 className="font-bold text-emerald-600">Data Aman</h3>
                  <p className="text-sm text-gray-500 mt-1">Pesan kamu hanya dibaca tim .id Academy</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Kanan: Form Kontak (Gaya Melayang) ── */}
          <div className="rounded-3xl bg-white p-8 shadow-2xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden">
            {/* Aksen border merah di sisi kiri (Seperti di Gambar_3.png) */}
            <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-[#CB2229]" />

            <form className="flex flex-col gap-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Nama */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-700">Nama Lengkap *</label>
                  <input
                    type="text"
                    placeholder="Nama kamu"
                    className="w-full rounded-xl border-0 bg-gray-50 px-4 py-3.5 text-sm text-gray-900 ring-1 ring-inset ring-gray-200 transition focus:bg-white focus:ring-2 focus:ring-inset focus:ring-[#CB2229] outline-none"
                  />
                </div>
                {/* Email */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-700">Email *</label>
                  <input
                    type="email"
                    placeholder="email@kamu.com"
                    className="w-full rounded-xl border-0 bg-gray-50 px-4 py-3.5 text-sm text-gray-900 ring-1 ring-inset ring-gray-200 transition focus:bg-white focus:ring-2 focus:ring-inset focus:ring-[#CB2229] outline-none"
                  />
                </div>
              </div>

              {/* Subjek */}
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">Subjek (opsional)</label>
                <input
                  type="text"
                  placeholder="Topik pesan kamu"
                  className="w-full rounded-xl border-0 bg-gray-50 px-4 py-3.5 text-sm text-gray-900 ring-1 ring-inset ring-gray-200 transition focus:bg-white focus:ring-2 focus:ring-inset focus:ring-[#CB2229] outline-none"
                />
              </div>

              {/* Pesan */}
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">Pesan *</label>
                <textarea
                  rows={5}
                  placeholder="Tulis pesan kamu di sini..."
                  className="w-full rounded-xl border-0 bg-gray-50 px-4 py-3.5 text-sm text-gray-900 ring-1 ring-inset ring-gray-200 transition focus:bg-white focus:ring-2 focus:ring-inset focus:ring-[#CB2229] outline-none resize-y"
                ></textarea>
                <p className="mt-2 text-xs font-medium text-gray-400">Minimal 10 karakter</p>
              </div>

              {/* Button Submit (Merah) */}
              <button
                type="button"
                className="mt-2 flex w-max items-center justify-center gap-2 rounded-xl bg-[#CB2229] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#a01b20] active:scale-95 shadow-md shadow-red-200"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Kirim Pesan
              </button>
            </form>
          </div>

        </div>
      </section>

    </main>
  );
}