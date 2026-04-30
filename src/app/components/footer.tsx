import React from "react";

// ─────────────────────────────────────────────
//  DATA
// ─────────────────────────────────────────────

const companyLinks = [
  { label: "About Us",       href: "/about" },
  { label: "Careers",        href: "#" },
  { label: "Premium Tools",  href: "#" },
  { label: "Blog",           href: "#" },
];

const pageLinks = [
  { label: "Login",    href: "#" },
  { label: "Register", href: "#" },
  { label: "Add List", href: "#" },
  { label: "Contact",  href: "#" },
];

const legalLinks = [
  { label: "Terms",    href: "#" },
  { label: "Privacy",  href: "#" },
  { label: "Team",     href: "#" },
  { label: "About Us", href: "/about" },
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
      <h3 className="mb-5 text-sm font-bold text-[#1f2937]">{title}</h3>
      <ul className="flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="text-sm text-[#6b7280] transition-colors duration-150 hover:text-[#d6362f]"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// ─────────────────────────────────────────────
//  SOCIAL ICON
// ─────────────────────────────────────────────

function SocialIcon({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e5e7eb] text-[#6b7280] transition-colors duration-150 hover:border-[#d6362f] hover:text-[#d6362f]"
    >
      {children}
    </a>
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
        <div className="grid grid-cols-2 gap-10 py-12 sm:grid-cols-4 lg:gap-16">

          {/* Brand column */}
          <div className="col-span-2 sm:col-span-1">
            {/* Logo */}
            <a href="/" className="inline-flex items-baseline gap-0.5 text-xl font-extrabold tracking-tight">
              <span className="text-[#d6362f]">.id</span>
              <span className="text-[#10b981]">academy</span>
            </a>

            {/* Tagline */}
            <p className="mt-3 text-sm leading-6 text-[#6b7280]">
              Pengembangan kapasitas digital oleh PANDI — inspirasi Indonesia yang lebih terhubung.
            </p>

            {/* Social icons */}
            <div className="mt-5 flex gap-2">
              <SocialIcon href="#" label="Instagram">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
                  <rect x="5" y="5" width="14" height="14" rx="4" />
                  <circle cx="12" cy="12" r="3.2" />
                  <circle cx="16.7" cy="7.3" r="1" fill="currentColor" stroke="none" />
                </svg>
              </SocialIcon>
              <SocialIcon href="#" label="Twitter / X">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M19.8 7.1c-.6.3-1.2.5-1.9.6.7-.4 1.2-1 1.5-1.8-.6.4-1.3.6-2 .8a3.1 3.1 0 0 0-5.5 2c0 .2 0 .5.1.7-2.6-.1-4.9-1.4-6.4-3.4-.3.5-.4 1-.4 1.6 0 1 .5 1.9 1.3 2.4-.5 0-1-.1-1.5-.4v.1c0 1.4 1 2.6 2.3 2.8-.2.1-.5.1-.8.1-.2 0-.4 0-.6-.1.4 1.2 1.5 2.1 2.8 2.2A6.2 6.2 0 0 1 4 17.3a8.7 8.7 0 0 0 4.7 1.4c5.6 0 8.8-4.7 8.8-8.8v-.4c.6-.4 1.2-1 1.6-1.6-.6.3-1.2.5-1.9.6.7-.5 1.2-1 1.6-1.8Z" />
                </svg>
              </SocialIcon>
              <SocialIcon href="#" label="YouTube">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
                  <rect x="4" y="6.5" width="16" height="11" rx="3" />
                  <path d="M10 10.2v3.6l3.5-1.8L10 10.2Z" fill="currentColor" stroke="none" />
                </svg>
              </SocialIcon>
            </div>
          </div>

          {/* Link columns */}
          <FooterCol title="Company" links={companyLinks} />
          <FooterCol title="Pages"   links={pageLinks} />
          <FooterCol title="Legal"   links={legalLinks} />
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
