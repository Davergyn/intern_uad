"use client";

import React from "react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";

// ─────────────────────────────────────────────
//  DATA — Array of Objects (DRY)
// ─────────────────────────────────────────────

type Partner = { name: string; logo: string };
type Category = { id: string; label: string; partners: Partner[] };

const categories: Category[] = [
  {
    id: "akademisi",
    label: "Akademisi",
    partners: [
      { name: "Universitas Indraprasta PGRI", logo: "/img/partners/akademisi-1.png" },
      { name: "Universitas Islam Nusantara", logo: "/img/partners/akademisi-2.png" },
      { name: "Universitas Narotama Surabaya", logo: "/img/partners/akademisi-3.png" },
      { name: "Universitas Negeri Manado", logo: "/img/partners/akademisi-4.png" },
      { name: "Universitas Diponegoro", logo: "/img/partners/akademisi-5.png" },
      { name: "Institut Teknologi Bandung", logo: "/img/partners/akademisi-6.png" },
      { name: "Universitas Gadjah Mada", logo: "/img/partners/akademisi-7.png" },
      { name: "Universitas Indonesia", logo: "/img/partners/akademisi-8.png" },
      { name: "Universitas Brawijaya", logo: "/img/partners/akademisi-9.png" },
      { name: "Universitas Airlangga", logo: "/img/partners/akademisi-10.png" },
    ],
  },
  {
    id: "komunitas",
    label: "Komunitas",
    partners: [
      { name: "Komunitas Digital Indonesia", logo: "/img/partners/komunitas-1.png" },
      { name: "Open Source Indonesia", logo: "/img/partners/komunitas-2.png" },
      { name: "Tech in Asia", logo: "/img/partners/komunitas-3.png" },
      { name: "GDG Indonesia", logo: "/img/partners/komunitas-4.png" },
      { name: "Startup Studio", logo: "/img/partners/komunitas-5.png" },
    ],
  },
  {
    id: "instansi",
    label: "Instansi",
    partners: [
      { name: "Kominfo", logo: "/img/partners/instansi-1.png" },
      { name: "BSSN", logo: "/img/partners/instansi-2.png" },
      { name: "Kemendikbud", logo: "/img/partners/instansi-3.png" },
      { name: "BRIN", logo: "/img/partners/instansi-4.png" },
      { name: "Bank Indonesia", logo: "/img/partners/instansi-5.png" },
    ],
  },
  {
    id: "general",
    label: "General",
    partners: [
      { name: "Partner Umum 1", logo: "/img/partners/general-1.png" },
      { name: "Partner Umum 2", logo: "/img/partners/general-2.png" },
      { name: "Partner Umum 3", logo: "/img/partners/general-3.png" },
      { name: "Partner Umum 4", logo: "/img/partners/general-4.png" },
      { name: "Partner Umum 5", logo: "/img/partners/general-5.png" },
    ],
  },
];

// ─────────────────────────────────────────────
//  LOGO CARD
// ─────────────────────────────────────────────

function LogoCard({ partner }: { partner: Partner }) {
  return (
    <div
      className="
        flex-shrink-0
        w-[140px] sm:w-auto
        snap-start
        bg-white
        rounded-xl
        border border-gray-100
        shadow-sm
        hover:shadow-md
        transition-shadow duration-200
        flex items-center justify-center
        p-4
        h-32
      "
    >
      <img
        src={partner.logo}
        alt={partner.name}
        title={partner.name}
        className="h-20 w-full object-contain"
        onError={(e) => {
          // Tampilkan placeholder teks jika gambar tidak ada
          const target = e.currentTarget as HTMLImageElement;
          target.style.display = "none";
          const parent = target.parentElement;
          if (parent && !parent.querySelector(".logo-fallback")) {
            const fallback = document.createElement("span");
            fallback.className =
              "logo-fallback text-[10px] text-center font-medium text-[#9ca3af] leading-tight px-1";
            fallback.innerText = partner.name;
            parent.appendChild(fallback);
          }
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────
//  CATEGORY SECTION
// ─────────────────────────────────────────────

function CategorySection({ category }: { category: Category }) {
  return (
    <div>
      {/* Category label */}
      <h2 className="text-xl font-bold text-[#1f2937] mb-4">{category.label}</h2>

      {/* Mobile: horizontal scroll */}
      <div
        className="
          flex lg:hidden
          overflow-x-auto
          snap-x snap-mandatory
          gap-4
          pb-4
          [&::-webkit-scrollbar]:hidden
          [-ms-overflow-style:none]
          [scrollbar-width:none]
        "
      >
        {category.partners.map((partner) => (
          <LogoCard key={partner.name} partner={partner} />
        ))}
      </div>

      {/* Desktop: 5-column grid */}
      <div className="hidden lg:grid lg:grid-cols-5 lg:gap-4">
        {category.partners.map((partner) => (
          <LogoCard key={partner.name} partner={partner} />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  PAGE
// ─────────────────────────────────────────────

export default function PartnershipPage() {
  return (
    <main className="min-h-screen bg-white text-[#111827]">
      <Navbar />

      {/* ── Header Section ── */}
      <section className="w-full bg-[#f4f5f7] py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-[#1f2937]">Partnership</h1>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {categories.map((category) => (
          <CategorySection key={category.id} category={category} />
        ))}
      </section>

      {/* ── Divider ── */}
      <div className="h-px bg-black/5" />
      <div className="pb-24" />

      <Footer />
    </main>
  );
}
