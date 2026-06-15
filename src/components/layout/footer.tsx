import React from "react";
import Link from "next/link";

// ─────────────────────────────────────────────
//  DATA
// ─────────────────────────────────────────────

const jelajahiLinks = [
  { label: "Program",        href: "/programs" },
  { label: "Materi",         href: "/materi" },
  { label: "Event Mendatang",href: "/events/up-events" },
  { label: "Event Berlalu",  href: "/events/past-events" },
  { label: "Narasumber",     href: "/trainers" },
];

const akunLinks = [
  { label: "Login",       href: "/login" },
  { label: "Dashboard",   href: "/user" },
  { label: "Sertifikat",  href: "#" },
  { label: "Tentang Kami",href: "/about" },
];

// ─────────────────────────────────────────────
//  FOOTER COLUMN
// ─────────────────────────────────────────────

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <nav aria-label={title}>
      <h3 className="mb-4 text-sm font-bold text-[#CB2229]">{title}</h3>
      <ul className="flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.label}>
            {link.href.startsWith("/") ? (
              <Link
                href={link.href}
                className="text-sm text-[#6b7280] transition-colors duration-150 hover:text-[#CB2229]"
              >
                {link.label}
              </Link>
            ) : (
              <a
                href={link.href}
                className="text-sm text-[#6b7280] transition-colors duration-150 hover:text-[#CB2229]"
              >
                {link.label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

// ─────────────────────────────────────────────
//  FOOTER
// ─────────────────────────────────────────────

export default function Footer() {
  return (
    <footer className="border-t border-[#f3f4f6] bg-white">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* ── Main grid ── */}
        <div className="grid grid-cols-2 gap-10 py-12 sm:grid-cols-4 lg:gap-12">

          {/* ── Brand column ── */}
          <div className="col-span-2 sm:col-span-1">
            {/* Logo */}
            <Link href="/" className="inline-flex items-baseline gap-0.5 text-xl font-extrabold tracking-tight">
              <span className="text-[#d6362f]">.id</span>
              <span className="text-[#10b981]">academy</span>
            </Link>

            {/* Deskripsi */}
            <p className="mt-3 text-sm leading-6 text-[#6b7280]">
              Inisiatif edukasi <strong className="font-semibold text-[#374151]">PANDI</strong> (Pengelola Nama
              Domain Internet Indonesia) untuk meningkatkan literasi digital seputar domain
              .id, keamanan siber, dan transformasi digital.
            </p>

            {/* Social icons */}
            <div className="mt-5 flex gap-2">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/dotidacademy"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram .id Academy"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e5e7eb] text-[#6b7280] transition-colors duration-150 hover:border-[#CB2229] hover:text-[#CB2229]"
              >
                {/* @ icon */}
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94" />
                </svg>
              </a>

              {/* Web / PANDI */}
              <a
                href="https://pandi.id/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Website PANDI"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e5e7eb] text-[#6b7280] transition-colors duration-150 hover:border-[#CB2229] hover:text-[#CB2229]"
              >
                {/* Globe icon */}
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </a>
            </div>
          </div>

          {/* ── Jelajahi ── */}
          <FooterCol title="Jelajahi" links={jelajahiLinks} />

          {/* ── Akun ── */}
          <FooterCol title="Akun" links={akunLinks} />

          {/* ── Kontak ── */}
          <div>
            <h3 className="mb-4 text-sm font-bold text-[#CB2229]">Kontak</h3>
            <ul className="flex flex-col gap-3">
              {/* Email */}
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#9ca3af]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m2 7 10 7 10-7" />
                </svg>
                <a href="mailto:literasi@pandi.id" className="text-sm text-[#6b7280] transition-colors hover:text-[#CB2229]">
                  literasi@pandi.id
                </a>
              </li>
              {/* Telepon */}
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#9ca3af]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.26h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.9a16 16 0 0 0 6 6l.9-.9a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span className="text-sm text-[#6b7280]">+62 21 3005 5777</span>
              </li>
              {/* Alamat */}
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#9ca3af]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                  <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span className="text-sm text-[#6b7280]">Icon Business Park, BSD City, Tangerang</span>
              </li>
            </ul>

            {/* Hubungi tim */}
            <Link
              href="/contact-us"
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#CB2229] transition-all hover:gap-2"
            >
              Hubungi tim
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-[#f3f4f6] py-6 sm:flex-row">
          <p className="text-xs text-[#9ca3af]">
            © {new Date().getFullYear()} PANDI – Pengelola Nama Domain Internet Indonesia. All rights reserved.
          </p>
          <p className="text-xs text-[#9ca3af]">
            Made with <span className="text-[#d6362f]">♥</span> for a better digital Indonesia.
          </p>
        </div>

      </div>
    </footer>
  );
}
