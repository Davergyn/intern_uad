import React from "react";
import { Users, Calendar, X, Award } from "lucide-react";
import { db } from "@/db";
import { trainers, eventTrainers, events } from "@/db/schema"; // Pastikan 'events' di-import
import { eq } from "drizzle-orm";
import ClientTrainerSection from "./ClientTrainerSection"; // Kita akan buat file ini di bawah

export const metadata = {
  title: "Trainers – .id Academy",
  description: "Kenali narasumber dan trainer profesional .id Academy.",
};

export default async function TrainersPage() {
  // BACKEND QUERY: Melakukan Left Join untuk menarik data Trainer sekaligus Event yang mereka ikuti
  const rows = await db
    .select({
      id: trainers.id,
      name: trainers.name,
      photoUrl: trainers.photoUrl,
      deskripsi: trainers.deskripsi,
      spesialisasi: trainers.spesialisasi,
      isActive: trainers.isActive,
      eventId: events.id,
      eventTitle: events.title, // Mengasumsikan kolom judul di tabel event bernama 'title'
    })
    .from(trainers)
    .leftJoin(eventTrainers, eq(trainers.id, eventTrainers.trainerId))
    .leftJoin(events, eq(eventTrainers.eventId, events.id))
    .where(eq(trainers.isActive, true));

  // AGREGASI DATA: Mengelompokkan hasil join query menjadi array objek trainer dengan list event-nya
  type EventItem = { id: number; title: string };
  type TrainerMapEntry = {
    id: number;
    name: string;
    photoUrl: string | null;
    deskripsi: string | null;
    spesialisasi: string | null;
    events: EventItem[];
  };
  const trainersMap: Record<number, TrainerMapEntry> = {};
  
  rows.forEach((row) => {
    if (!trainersMap[row.id]) {
      trainersMap[row.id] = {
        id: row.id,
        name: row.name,
        photoUrl: row.photoUrl,
        deskripsi: row.deskripsi,
        spesialisasi: row.spesialisasi,
        events: [],
      };
    }
    
    if (row.eventId && row.eventTitle) {
      // Masukkan event ke dalam list jika belum terdaftar (mencegah duplikasi)
      const isExist = trainersMap[row.id].events.some((e: EventItem) => e.id === row.eventId);
      if (!isExist) {
        trainersMap[row.id].events.push({
          id: row.eventId,
          title: row.eventTitle,
        });
      }
    }
  });

  const trainerList = Object.values(trainersMap);

  return (
    <main className="min-h-screen bg-white text-[#111827]">
      {/* ── HEADER SECTION ── */}
      <section className="mx-auto w-full max-w-4xl px-4 pt-16 pb-12 sm:px-6 lg:px-8 text-center border-b border-gray-50">
        <h1 className="text-4xl font-extrabold text-[#1f2937] sm:text-5xl">
         Trainer Kami
        </h1>
        <p className="mt-4 text-lg text-gray-500 font-medium">
          Belajar langsung dari para praktisi dan pakar industri terkemuka di bidangnya.
        </p>
      </section>

      {/* ── GRID SECTION (Dihandle oleh Client Component untuk Interaktivitas Klik) ── */}
      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="mb-10 text-center text-2xl font-bold text-[#10b981] sm:text-3xl">
          Beberapa .id Trainer Hebat di Academy
        </h2>

        {trainerList.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
            Belum ada trainer aktif yang tersedia.
          </div>
        ) : (
          <ClientTrainerSection trainers={trainerList} />
        )}
      </section>
      
      <div className="pb-16" />
    </main>
  );
}