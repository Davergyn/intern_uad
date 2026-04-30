"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// ─────────────────────────────────────────────
//  NAV ICONS
// ─────────────────────────────────────────────

const icons: Record<string, React.ReactNode> = {
  "About Us": (
    <svg className="h-[15px] w-[15px] flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 5a1 1 0 011-1h2a1 1 0 010 2H4a1 1 0 01-1-1zm0 7a1 1 0 011-1h2a1 1 0 010 2H4a1 1 0 01-1-1zm0 7a1 1 0 011-1h2a1 1 0 010 2H4a1 1 0 01-1-1zm5-14a1 1 0 011-1h10a1 1 0 010 2H9a1 1 0 01-1-1zm0 7a1 1 0 011-1h10a1 1 0 010 2H9a1 1 0 01-1-1zm0 7a1 1 0 011-1h10a1 1 0 010 2H9a1 1 0 01-1-1z" />
    </svg>
  ),
  "Events": (
    <svg className="h-[15px] w-[15px] flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
    </svg>
  ),
  "Programs": (
    <svg className="h-[15px] w-[15px] flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
    </svg>
  ),
  "Trainers": (
    <svg className="h-[15px] w-[15px] flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
    </svg>
  ),
  "Materi": (
    <svg className="h-[15px] w-[15px] flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
    </svg>
  ),
  "Contact Us": (
    <svg className="h-[15px] w-[15px] flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
    </svg>
  ),
};

// ─────────────────────────────────────────────
//  DATA CONFIG
// ─────────────────────────────────────────────

const eventsDropdown = [
  { label: "Upcoming Events", href: "#upcoming-events" },
  { label: "Past Events", href: "#past-events" },
];

const programsDropdown = [
  { label: "Training of Trainer", href: "/programs/training-of-trainer" },
  { label: "Seminar", href: "/programs/seminar" },
  { label: "Workshop", href: "/programs/workshop" },
  { label: "Partnership", href: "/programs/partnership" },
];

type NavItem =
  | { type: "link"; label: string; href: string }
  | { type: "dropdown"; label: string; items: { label: string; href: string }[] };

const navConfig: NavItem[] = [
  { type: "link", label: "About Us", href: "/about" },
  { type: "dropdown", label: "Events", items: eventsDropdown },
  { type: "dropdown", label: "Programs", items: programsDropdown },
  { type: "link", label: "Trainers", href: "/trainers" },
  { type: "link", label: "Materi", href: "/materi" },
  { type: "link", label: "Contact Us", href: "/contact-us" },
];

// ─────────────────────────────────────────────
//  SMOOTH SCROLL HELPER
// ─────────────────────────────────────────────

function scrollToSection(href: string) {
  if (!href.startsWith("#")) {
    window.location.href = href;
    return;
  }
  const id = href.slice(1);
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// ─────────────────────────────────────────────
//  ACTIVE SECTION HOOK
// ─────────────────────────────────────────────

function useActiveSection(sectionIds: string[]) {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [sectionIds]);

  return active;
}

// ─────────────────────────────────────────────
//  DESKTOP DROPDOWN COMPONENT
// ─────────────────────────────────────────────

function DesktopDropdown({
  label,
  items,
  isGrid,
  isActive,
}: {
  label: string;
  items: { label: string; href: string }[];
  isGrid?: boolean;
  isActive?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleOpen = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };
  const handleClose = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 120);
  };

  // Close on outside click
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={handleOpen}
      onMouseLeave={handleClose}
    >
      {/* Trigger */}
      <button
        className={`group relative flex items-center gap-1.5 py-1 text-sm font-medium transition-colors duration-200 ${isActive ? "text-[#d6362f]" : "text-[#1f2937] hover:text-[#d6362f]"
          }`}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {icons[label]}
        {label}
        <svg
          className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
        {/* Active underline */}
        <span
          className={`absolute -bottom-1 left-0 h-[2px] rounded-full bg-[#d6362f] transition-all duration-300 ${isActive ? "w-full opacity-100" : "w-0 opacity-0"
            }`}
        />
      </button>

      {/* Dropdown panel */}
      <div
        className={`absolute left-0 top-full z-50 mt-2 origin-top transition-all duration-200 ${open
            ? "scale-y-100 opacity-100 translate-y-0 pointer-events-auto"
            : "scale-y-95 opacity-0 -translate-y-1 pointer-events-none"
          }`}
      >
        <div
          className={`rounded-xl border border-white/20 bg-white/80 p-2 shadow-xl shadow-black/10 backdrop-blur-md ${isGrid ? "grid grid-cols-2 gap-1 min-w-[280px]" : "min-w-[180px]"
            }`}
        >
          {items.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                scrollToSection(item.href);
                setOpen(false);
              }}
              className="group/item flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-[#374151] transition-all duration-150 hover:bg-[#d6362f]/8 hover:text-[#d6362f]"
            >
              <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#d6362f]/40 transition-colors group-hover/item:bg-[#d6362f]" />
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  DESKTOP NAV LINK
// ─────────────────────────────────────────────

function DesktopNavLink({
  label,
  href,
  isActive,
}: {
  label: string;
  href: string;
  isActive?: boolean;
}) {
  return (
    <button
      onClick={() => scrollToSection(href)}
      className={`relative flex items-center gap-1.5 py-1 text-sm font-medium transition-colors duration-200 ${isActive ? "text-[#d6362f]" : "text-[#1f2937] hover:text-[#d6362f]"
        }`}
    >
      {icons[label]}
      {label}
      <span
        className={`absolute -bottom-1 left-0 h-[2px] rounded-full bg-[#d6362f] transition-all duration-300 ${isActive ? "w-full opacity-100" : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
          }`}
      />
    </button>
  );
}

// ─────────────────────────────────────────────
//  MAIN NAVBAR
// ─────────────────────────────────────────────

const allSectionIds = [
  "about-us", "upcoming-events", "past-events",
  "training", "workshop", "seminar", "partnership",
  "trainers", "materi", "contact-us",
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);
  const activeSection = useActiveSection(allSectionIds);

  const toggleMobileDropdown = (label: string) =>
    setMobileDropdown(mobileDropdown === label ? null : label);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/90 backdrop-blur-lg">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">

        {/* ── Logo ── */}
        <a
          href="/"
          className="text-2xl font-extrabold tracking-tight"
          aria-label=".id academy home"
        >
          <span className="text-[#d6362f]">.id</span>{" "}
          <span className="text-[#10b981]">academy</span>
        </a>

        {/* ── Desktop Nav ── */}
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Main navigation">
          {navConfig.map((item) =>
            item.type === "dropdown" ? (
              <DesktopDropdown
                key={item.label}
                label={item.label}
                items={item.items}
                isGrid={item.label === "Programs"}
                isActive={item.items.some((sub) => "#" + activeSection === sub.href)}
              />
            ) : (
              <DesktopNavLink
                key={item.label}
                label={item.label}
                href={item.href}
                isActive={"#" + activeSection === item.href}
              />
            )
          )}
        </nav>

        {/* ── Desktop LOG IN + Hamburger ── */}
        <div className="flex items-center gap-3">
          {/* LOG IN only on desktop */}
          <button className="hidden rounded-lg bg-[#cf2f2a] px-5 py-2 text-xs font-bold tracking-widest text-white shadow-sm transition-all duration-200 hover:bg-[#b92924] hover:shadow-md lg:block">
            LOG IN
          </button>

          {/* Hamburger (mobile) */}
          <button
            id="navbar-hamburger"
            className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] rounded-md p-1 transition hover:bg-black/5 lg:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-drawer"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className={`block h-[2px] w-5 rounded-full bg-[#1f2937] transition-all duration-300 ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`} />
            <span className={`block h-[2px] w-5 rounded-full bg-[#1f2937] transition-all duration-300 ${menuOpen ? "opacity-0 scale-x-0" : ""}`} />
            <span className={`block h-[2px] w-5 rounded-full bg-[#1f2937] transition-all duration-300 ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      {/* ── Mobile Drawer ── */}
      <div
        id="mobile-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className={`overflow-hidden transition-all duration-300 ease-in-out lg:hidden ${menuOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <nav className="flex flex-col border-t border-black/5 bg-white/95 px-4 pb-5 pt-2 text-sm font-medium text-[#1f2937] backdrop-blur-md">

          {navConfig.map((item) =>
            item.type === "dropdown" ? (
              <div key={item.label} className="border-b border-black/5">
                <button
                  className={`flex w-full items-center justify-between py-3.5 text-left transition-colors duration-150 hover:text-[#d6362f] ${item.items.some((s) => "#" + activeSection === s.href) ? "text-[#d6362f]" : ""
                    }`}
                  onClick={() => toggleMobileDropdown(item.label)}
                  aria-expanded={mobileDropdown === item.label}
                >
                  <span className="flex items-center gap-2 font-semibold">{icons[item.label]}{item.label}</span>
                  <svg
                    className={`h-4 w-4 transition-transform duration-200 ${mobileDropdown === item.label ? "rotate-180" : ""}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {/* Sub-items */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${mobileDropdown === item.label ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
                    }`}
                >
                  <div className={`mb-3 ml-2 ${item.label === "Programs" ? "grid grid-cols-2 gap-1" : "flex flex-col gap-1"}`}>
                    {item.items.map((sub) => (
                      <button
                        key={sub.label}
                        onClick={() => {
                          scrollToSection(sub.href);
                          setMenuOpen(false);
                        }}
                        className={`rounded-lg px-3 py-2.5 text-left text-sm transition-colors duration-150 hover:bg-[#d6362f]/8 hover:text-[#d6362f] ${"#" + activeSection === sub.href
                            ? "bg-[#d6362f]/8 font-semibold text-[#d6362f]"
                            : "text-[#374151]"
                          }`}
                      >
                        {sub.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <button
                key={item.label}
                onClick={() => {
                  scrollToSection(item.href);
                  setMenuOpen(false);
                }}
                className={`flex items-center gap-2 border-b border-black/5 py-3.5 text-left font-semibold transition-colors duration-150 hover:text-[#d6362f] ${"#" + activeSection === item.href ? "text-[#d6362f]" : ""
                  }`}
              >
                {icons[item.label]}
                {item.label}
              </button>
            )
          )}

          {/* LOG IN inside mobile drawer */}
          <button
            className="mt-4 w-full rounded-lg bg-[#cf2f2a] py-3 text-sm font-bold tracking-widest text-white shadow-sm transition-all duration-200 hover:bg-[#b92924] active:scale-95"
            onClick={() => setMenuOpen(false)}
          >
            LOG IN
          </button>
        </nav>
      </div>
    </header>
  );
}