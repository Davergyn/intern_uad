import { BookOpen, ExternalLink } from "lucide-react";

// TODO: Import MaterialRow type from new database schema when ready
type MaterialRow = {
  id: string;
  title: string;
  description?: string;
  cover_url?: string;
  link_url?: string;
};

function MaterialCard({ item }: { item: MaterialRow }) {
  return (
    <article className="flex min-h-[380px] flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
      <div className="flex h-[200px] w-full flex-shrink-0 items-center justify-center overflow-hidden bg-[#f3f4f6]">
        {item.cover_url ? (
          <img
            src={item.cover_url}
            alt={item.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <BookOpen className="h-12 w-12 text-[#9ca3af]" />
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h2 className="mb-3 line-clamp-3 text-[1.05rem] leading-snug text-[#4b5563]">
          {item.title}
        </h2>
        {item.description && (
          <p className="line-clamp-3 text-sm leading-6 text-slate-500">
            {item.description}
          </p>
        )}
        <div className="mt-auto pt-6">
          <a
            href={item.link_url || "#"}
            target={item.link_url ? "_blank" : undefined}
            rel={item.link_url ? "noreferrer" : undefined}
            className="inline-flex items-center gap-2 rounded-xl bg-[#CB2229] px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-white transition hover:bg-red-700"
          >
            Klik untuk lihat
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </article>
  );
}

export default async function MateriPage() {
  const materials = await getActiveMaterials();

  return (
    <main className="min-h-screen bg-[#f9fafb] text-[#111827]">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="mb-10 flex items-start gap-6 rounded-2xl bg-[#e5e7eb] p-8 sm:p-10">
          <BookOpen className="mt-0.5 h-10 w-10 flex-shrink-0 text-[#111827]" />
          <div>
            <h1 className="text-2xl font-extrabold text-[#111827]">Materi</h1>
            <p className="mt-2 text-[1.05rem] text-[#4b5563]">
              Belajar tanpa batas. Pilih materimu, mulai langkah besarmu.
            </p>
            <p className="text-[1.05rem] text-[#4b5563]">
              Dari pemula hingga profesional, semua yang kamu butuhkan ada di
              sini.
            </p>
          </div>
        </div>

        {materials.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
            Belum ada materi aktif yang tersedia.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {materials.map((item) => (
              <MaterialCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
      <div className="pb-16" />{" "}
    </main>
  );
}
