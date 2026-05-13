import Link from "next/link";
import { Check } from "lucide-react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import { getActiveProgramImagesBySlug } from "@/lib/supabase-content";
import ProgramImageSlider from "./program-image-slider";

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
  const programImages = await getActiveProgramImagesBySlug(slug);
  const images = programImages
    .filter((program) => Boolean(program.image_url))
    .map((program) => ({
      id: program.id,
      imageUrl: program.image_url as string,
      title: program.title || fallbackTitle,
    }));

  return (
    <main className="min-h-screen bg-white text-[#111827]">
      <Navbar />

      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-start lg:gap-16">
          <div className="w-full max-w-sm self-start sm:max-w-[420px] lg:w-[460px] lg:max-w-none lg:flex-shrink-0">
            <ProgramImageSlider images={images} />
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-6">
            <h1 className="text-4xl font-black leading-tight tracking-tight text-[#111827] sm:text-5xl">
              {fallbackTitle}
            </h1>

            <div className="flex flex-col gap-4 text-sm leading-7 text-[#374151] sm:text-base">
              {fallbackDescription.split(/\n{2,}/).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold text-[#111827] sm:text-base">
                Melalui program ini, peserta diharapkan dapat:
              </p>
              <ul className="flex flex-col gap-2.5">
                {fallbackBenefits.map((benefit) => (
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
