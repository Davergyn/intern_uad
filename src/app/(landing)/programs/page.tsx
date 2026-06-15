import Link from "next/link";
import { db } from "@/db";
import { programs as programsTable, partnerships } from "@/db/schema";
import { eq, and } from "drizzle-orm";

const programList = [
  {
    slug: "training-of-trainer",
    title: "Training of Trainer",
    description:
      "Program pelatihan untuk mencetak trainer .id Academy yang siap berbagi ilmu domain .id dan literasi digital.",
    kategori: "training-of-trainer" as const,
  },
  {
    slug: "workshop",
    title: "Workshop",
    description:
      "Sesi praktik intensif seputar domain .id, keamanan siber, dan transformasi digital.",
    kategori: "workshop" as const,
  },
  {
    slug: "seminar",
    title: "Seminar",
    description:
      "Kuliah umum terbuka tentang dunia digital Indonesia bersama narasumber ahli.",
    kategori: "seminar" as const,
  },
];

export default async function ProgramsPage() {
  // Fetch satu gambar per program dari DB
  const programsWithImages = await Promise.all(
    programList.map(async (program) => {
      let imageUrl: string | null = null;

      if (program.slug === "partnership") {
        const result = await db
          .select()
          .from(partnerships)
          .limit(1);
        imageUrl = result[0]?.logoUrl ?? null;
      } else if (program.kategori) {
        const result = await db
          .select()
          .from(programsTable)
          .where(
            and(
              eq(programsTable.kategori, program.kategori),
              eq(programsTable.isActive, true)
            )
          )
          .limit(1);
        imageUrl = result[0]?.imageUrl ?? null;
      }

      return { ...program, imageUrl };
    })
  );

  return (
    <main className="min-h-screen bg-white text-[#111827]">
      {/* ── Header ── */}
      <section className="mx-auto w-full max-w-6xl px-4 pt-12 pb-8 sm:px-6 lg:px-8 lg:pt-16">
        <h1 className="text-3xl font-black text-[#111827] sm:text-4xl">
          Semua Program
        </h1>
        <p className="mt-2 text-base text-[#6b7280]">
          Pilih program yang sesuai dengan kebutuhanmu bersama .id Academy.
        </p>
      </section>

      {/* ── Program Cards ── */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {programsWithImages.map((program) => (
            <Link
              key={program.slug}
              href={`/programs/${program.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Foto */}
              <div className="aspect-[4/3] w-full overflow-hidden bg-[#f3f4f6]">
                {program.imageUrl ? (
                  <img
                    src={program.imageUrl}
                    alt={program.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[#f3f4f6]">
                    <span className="text-xs text-[#9ca3af]">
                      Gambar belum tersedia
                    </span>
                  </div>
                )}
              </div>

              {/* Konten */}
              <div className="flex flex-1 flex-col gap-2 p-5">
                <h2 className="text-base font-bold text-[#CB2229]">
                  {program.title}
                </h2>
                <p className="text-sm leading-relaxed text-[#6b7280]">
                  {program.description}
                </p>
                <div className="mt-auto pt-3">
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#059669] transition-all group-hover:gap-2">
                    Pelajari Selengkapnya
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
