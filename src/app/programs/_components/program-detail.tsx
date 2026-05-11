import Link from "next/link";
import { Check, ImageIcon } from "lucide-react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import { getActiveProgramBySlug } from "@/lib/supabase-content";

type ProgramDetailProps = {
  slug: string;
  fallbackTitle: string;
  fallbackDescription: string;
  fallbackBenefits: string[];
};

function splitBenefits(raw: string | null, fallback: string[]) {
  if (!raw) return fallback;
  return raw
    .split(/\r?\n|;/)
    .map((item) => item.replace(/^[-*•]\s*/, "").trim())
    .filter(Boolean);
}

function ProgramImage({ src, label }: { src: string | null; label: string }) {
  if (src) {
    return <img src={src} alt={label} className="aspect-[4/3] w-full rounded-2xl object-cover" />;
  }

  return (
    <div className="flex aspect-[4/3] w-full items-center justify-center rounded-2xl border-2 border-dashed border-[#d1d5db] bg-[#f9fafb]">
      <div className="px-6 text-center">
        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[#CB2229]/10">
          <ImageIcon className="h-8 w-8 text-[#CB2229]/50" />
        </div>
        <p className="whitespace-pre-line text-xs font-medium leading-relaxed text-[#9ca3af]">{label}</p>
      </div>
    </div>
  );
}

export default async function ProgramDetail({
  slug,
  fallbackTitle,
  fallbackDescription,
  fallbackBenefits,
}: ProgramDetailProps) {
  const program = await getActiveProgramBySlug(slug);
  const title = program?.title ?? fallbackTitle;
  const description = program?.description ?? fallbackDescription;
  const benefits = splitBenefits(program?.benefits ?? null, fallbackBenefits);

  return (
    <main className="min-h-screen bg-white text-[#111827]">
      <Navbar />

      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-start lg:gap-16">
          <div className="w-full max-w-sm self-start sm:max-w-[420px] lg:w-[460px] lg:max-w-none lg:flex-shrink-0">
            <div className="flex flex-col gap-4">
              <ProgramImage src={program?.image_1_url ?? null} label="Gambar 1 akan ditambahkan" />
              <ProgramImage src={program?.image_2_url ?? null} label="Gambar 2 akan ditambahkan" />
            </div>
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-6">
            <h1 className="text-4xl font-black leading-tight tracking-tight text-[#111827] sm:text-5xl">
              {title}
            </h1>

            <div className="flex flex-col gap-4 text-sm leading-7 text-[#374151] sm:text-base">
              {description.split(/\n{2,}/).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold text-[#111827] sm:text-base">
                Melalui program ini, peserta diharapkan dapat:
              </p>
              <ul className="flex flex-col gap-2.5">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-[#CB2229]/15">
                      <Check className="h-2.5 w-2.5 text-[#CB2229]" />
                    </span>
                    <span className="text-sm leading-7 text-[#374151] sm:text-base">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="h-px bg-black/5" />

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
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
          </div>
        </div>
      </section>

      <div className="h-px bg-black/5" />
      <div className="pb-24" />
      <Footer />
    </main>
  );
}
