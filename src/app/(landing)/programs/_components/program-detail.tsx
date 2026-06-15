import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { programs, partnerships } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import type { ProgramRow } from "@/types/database";
import { Rocket, BadgeCheck, Users } from "lucide-react";

const validCategories = ["training-of-trainer", "seminar", "workshop"];

type ProgramDetailProps = {
  slug: string;
  fallbackTitle: string;
  fallbackDescription: string;
  fallbackBenefits: string[];
};

export default async function ProgramDetail({
  slug,
  fallbackTitle,
  fallbackDescription,
  fallbackBenefits,
}: ProgramDetailProps) {
  let images: { id: number; imageUrl: string; title: string }[] = [];

  if (slug === "partnership") {
    const partnerData = await db.select().from(partnerships);

    images = partnerData
      .filter((p) => Boolean(p.imageUrl))
      .map((p) => ({
        id: p.id,

        imageUrl: p.imageUrl ?? "",
        title: p.name || fallbackTitle,
      }));
  } else {
    if (!validCategories.includes(slug)) {
      notFound();
    }

    const programImages: ProgramRow[] = await db
      .select()
      .from(programs)
      .where(
        and(
          eq(
            programs.kategori,
            slug as "training-of-trainer" | "seminar" | "workshop"
          ),
          eq(programs.isActive, true)
        )
      );

    images = programImages
      .filter((program) => Boolean(program.imageUrl))
      .map((program) => ({
        id: program.id,
        imageUrl: program.imageUrl as string,
        title: program.title || fallbackTitle,
      }));
  }

  // Ambil satu gambar saja untuk hero
  const heroImage = images[0] ?? null;

  return (
    <main className="min-h-screen bg-white text-[#111827]">
      {/* ── Hero Section (White Background) ── */}
      <section className="w-full bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:gap-12">
            {/* Gambar kiri */}
            <div className="w-full flex-shrink-0 lg:w-[420px]">
              {heroImage ? (
                <img
                  src={heroImage.imageUrl}
                  alt={heroImage.title}
                  className="aspect-[4/3] w-full rounded-2xl object-cover shadow-xl"
                />
              ) : (
                <div className="flex aspect-[4/3] w-full items-center justify-center rounded-2xl border-2 border-dashed border-[#d1d5db] bg-[#f9fafb]">
                  <span className="text-[#9ca3af] text-sm">Gambar belum tersedia</span>
                </div>
              )}
            </div>

            {/* Konten kanan */}
            <div className="flex min-w-0 flex-1 flex-col gap-5">
              <h1 className="text-4xl font-black leading-tight tracking-tight text-[#111827] sm:text-5xl lg:text-6xl">
                {fallbackTitle}
              </h1>

              <p className="text-sm leading-relaxed text-[#374151] sm:text-base">
                {fallbackDescription}
              </p>

              {/* Badge-badge */}
              <div className="flex flex-wrap gap-2">
                <span className="flex items-center gap-1.5 rounded-full border border-[#e5e7eb] bg-[#f9fafb] px-3 py-1.5 text-xs font-medium text-[#374151]">
                  <Rocket className="h-3.5 w-3.5 text-[#CB2229]" />
                  {fallbackBenefits.length} learning outcomes
                </span>
                <span className="flex items-center gap-1.5 rounded-full border border-[#e5e7eb] bg-[#f9fafb] px-3 py-1.5 text-xs font-medium text-[#374151]">
                  <BadgeCheck className="h-3.5 w-3.5 text-[#CB2229]" />
                  Sertifikat .id Academy
                </span>
                <span className="flex items-center gap-1.5 rounded-full border border-[#e5e7eb] bg-[#f9fafb] px-3 py-1.5 text-xs font-medium text-[#374151]">
                  <Users className="h-3.5 w-3.5 text-[#CB2229]" />
                  Mentor PANDI
                </span>
              </div>

              {/* Tombol Daftar Program */}
              <div>
                <Link
                  href="/auth/registrasi"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#CB2229] px-6 py-3 text-sm font-bold tracking-wide text-white shadow-sm transition hover:bg-red-700 active:scale-95"
                >
                  <Rocket className="h-4 w-4" />
                  Daftar Program
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Detail / Benefits Section ── */}
      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <h2 className="mb-6 text-2xl font-bold text-[#111827] sm:text-3xl">
          Melalui program ini, peserta diharapkan dapat:
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          {fallbackBenefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-3">
              <span className="mt-1.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#CB2229]/15">
                <svg className="h-3 w-3 text-[#CB2229]" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="text-sm leading-7 text-[#374151] sm:text-base">{benefit}</span>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/auth/registrasi"
            className="rounded-xl bg-[#CB2229] px-6 py-3 text-center text-sm font-bold tracking-wide text-white shadow-sm transition hover:bg-red-700"
          >
            Daftar Sekarang
          </Link>
          <Link
            href="/contact-us"
            className="rounded-xl border border-[#CB2229] px-6 py-3 text-center text-sm font-bold tracking-wide text-[#CB2229] transition hover:bg-[#CB2229]/5"
          >
            Hubungi Kami
          </Link>
        </div>
      </section>

      <div className="h-px bg-black/5" />
      <div className="pb-16" />
    </main>
  );
}