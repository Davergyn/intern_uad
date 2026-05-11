import { Users } from "lucide-react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { getActiveTrainers } from "@/lib/supabase-content";
import type { TrainerRow } from "@/types/database";

function TrainerCard({ trainer }: { trainer: TrainerRow }) {
  return (
    <article className="flex min-h-[340px] flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
      <div className="flex h-[240px] w-full items-end justify-center overflow-hidden bg-[#fafafa]">
        {trainer.photo_url ? (
          <img src={trainer.photo_url} alt={trainer.name} className="h-full w-full object-cover object-top" />
        ) : (
          <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-[#CB2229]/10">
            <Users className="h-10 w-10 text-[#CB2229]/50" />
          </div>
        )}
      </div>
      <div className="p-5 text-center">
        <h2 className="mb-1.5 line-clamp-2 text-[1.05rem] font-bold leading-tight text-[#1f2937]">
          {trainer.name}
        </h2>
        <p className="text-[0.82rem] text-gray-500">{trainer.role_title || "Trainer .id Academy"}</p>
      </div>
    </article>
  );
}

export default async function TrainersPage() {
  const trainers = await getActiveTrainers();

  return (
    <main className="min-h-screen bg-[#f9fafb] text-[#111827]">
      <Navbar />

      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="mb-10 flex items-center gap-5 rounded-xl bg-[#f3f4f6] p-8">
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
            <Users className="h-7 w-7 text-[#1f2937]" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-[#1f2937]">Trainers</h1>
            <p className="mt-1 max-w-xl text-sm text-[#6b7280]">
              Kenali para narasumber dan trainer profesional .id Academy yang aktif membimbing perjalanan digital Anda.
            </p>
          </div>
        </div>

        {trainers.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
            Belum ada trainer aktif yang tersedia.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {trainers.map((trainer) => (
              <TrainerCard key={trainer.id} trainer={trainer} />
            ))}
          </div>
        )}
      </div>

      <div className="pb-16" />
      <Footer />
    </main>
  );
}
