"use client";

import React, { useState, useEffect } from "react";
import { Users, Calendar, X, Award } from "lucide-react";

interface EventItem {
  id: number;
  title: string;
}

interface TrainerData {
  id: number;
  name: string;
  photoUrl: string | null;
  deskripsi: string | null;
  spesialisasi: string | null;
  events: EventItem[];
}

export default function ClientTrainerSection({ trainers }: { trainers: TrainerData[] }) {
  const [selectedTrainer, setSelectedTrainer] = useState<TrainerData | null>(null);

  // Mencegah scroll pada body ketika modal terbuka
  useEffect(() => {
    if (selectedTrainer) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedTrainer]);

  return (
    <>
      {/* ── GRID UTAMA TRAINER ── */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {trainers.map((trainer) => (
          <article
            key={trainer.id}
            onClick={() => setSelectedTrainer(trainer)}
            className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md hover:border-gray-200 cursor-pointer"
          >
            {/* Foto Trainer */}
            <div className="flex h-[260px] w-full items-end justify-center overflow-hidden bg-[#f9fafb]">
              {trainer.photoUrl ? (
                <img
                  src={trainer.photoUrl}
                  alt={trainer.name}
                  className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-[#CB2229]/10">
                  <Users className="h-10 w-10 text-[#CB2229]/50" />
                </div>
              )}
            </div>

            {/* Nama & Deskripsi */}
            <div className="flex flex-col justify-between p-5 text-left flex-grow">
              <div>
                <h2 className="mb-1 line-clamp-2 text-[1.05rem] font-bold leading-tight text-[#CB2229] group-hover:underline">
                  {trainer.name}
                </h2>
                {trainer.deskripsi ? (
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {trainer.deskripsi}
                  </p>
                ) : (
                  <p className="text-xs font-medium text-gray-400 italic">
                    Trainer .id Academy
                  </p>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* ── MODAL DETAIL TRAINER (POP-UP) ── */}
      {selectedTrainer && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
          onClick={() => setSelectedTrainer(null)}
        >
          <div 
            className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-gray-100 flex flex-col gap-8 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()} // Mencegah modal tertutup saat area dalam diklik
          >
            {/* Tombol Close */}
            <button 
              onClick={() => setSelectedTrainer(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              
              {/* Kiri: Foto Besar */}
              <div className="md:col-span-5 w-full flex justify-center">
                <div className="w-full aspect-[3/4] max-w-[240px] md:max-w-none rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm">
                  {selectedTrainer.photoUrl ? (
                    <img 
                      src={selectedTrainer.photoUrl} 
                      alt={selectedTrainer.name} 
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <Users className="h-16 w-16" />
                    </div>
                  )}
                </div>
              </div>

              {/* Kanan: Info Lengkap */}
              <div className="md:col-span-7 flex flex-col gap-5">
                <div>
                  <h3 className="text-2xl font-extrabold text-[#CB2229]">
                    {selectedTrainer.name}
                  </h3>
                  <p className="text-sm font-semibold text-gray-400 mt-0.5">
                    Trainer Academy Id
                  </p>
                </div>

                {/* Spesialisasi / Keahlian */}
                {selectedTrainer.spesialisasi && (
                  <div className="flex flex-wrap gap-2">
                    {selectedTrainer.spesialisasi.split(",").map((spec, i) => (
                      <span 
                        key={i} 
                        className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-100"
                      >
                        <Award className="h-3.5 w-3.5" />
                        {spec.trim()}
                      </span>
                    ))}
                  </div>
                )}

                {/* Deskripsi Profil */}
                <div className="border-t border-gray-100 pt-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-2">Profil Singkat</h4>
                  <p className="text-sm leading-relaxed text-gray-600 whitespace-pre-line">
                    {selectedTrainer.deskripsi || "Belum ada deskripsi profil untuk trainer ini."}
                  </p>
                </div>

                {/* List Event yang Diikuti */}
                <div className="border-t border-gray-100 pt-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3">Event yang Pernah Diikuti</h4>
                  {selectedTrainer.events.length === 0 ? (
                    <p className="text-xs italic text-gray-400">Belum ada riwayat event terdaftar.</p>
                  ) : (
                    <ul className="flex flex-col gap-2.5">
                      {selectedTrainer.events.map((event) => (
                        <li 
                          key={event.id}
                          className="flex items-start gap-3 text-sm font-medium text-gray-700 group/item"
                        >
                          <Calendar className="h-4 w-4 text-[#10b981] mt-0.5 shrink-0" />
                          <span className="hover:text-[#CB2229] transition-colors">
                            {event.title}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}