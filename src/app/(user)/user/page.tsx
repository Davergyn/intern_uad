"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  CalendarDays,
  ChevronRight,
  GraduationCap,
  MessageCircleMore,
  ShieldCheck,
  Sparkles,
  Users,
  Bookmark,
} from "lucide-react";
import { useAuth } from "@/lib/authContext";
import { useProfileName } from "@/lib/hooks/useProfileName";

const QUICK_LINKS = [
  {
    href: "/events/up-events",
    label: "Upcoming Events",
    desc: "Lihat event yang akan datang.",
    icon: CalendarDays,
  },
  {
    href: "/materi",
    label: "Materi Belajar",
    desc: "Buka modul dan referensi.",
    icon: BookOpen,
  },
  {
    href: "/programs/seminar",
    label: "Program Seminar",
    desc: "Jelajahi program unggulan.",
    icon: GraduationCap,
  },
  {
    href: "/contact-us",
    label: "Hubungi Tim",
    desc: "Minta bantuan atau info lanjutan.",
    icon: MessageCircleMore,
  },
];

export default function UserDashboardPage() {
  const { userEmail } = useAuth();
  const [savedEventsCount, setSavedEventsCount] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  // Shared hook â€” membaca nama profil dari localStorage
  const profileName = useProfileName(isMounted ? userEmail : null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Load saved events count from localStorage
  useEffect(() => {
    if (isMounted && userEmail) {
      const storedSaved = localStorage.getItem(`saved_events_${userEmail}`);
      if (storedSaved) {
        try {
          const parsed = JSON.parse(storedSaved);
          if (Array.isArray(parsed)) {
            setSavedEventsCount(parsed.length);
          }
        } catch (e) {
          console.error("Failed to parse saved events", e);
        }
      }
    }
  }, [isMounted, userEmail]);

  const STAT_CARDS = [
    {
      label: "Event diikuti",
      value: "3",
      note: "+1 bulan ini",
      icon: CalendarDays,
    },
    {
      label: "Event Tersimpan",
      value: savedEventsCount.toString(),
      note: "Siap dibaca kapan saja",
      icon: Bookmark,
      href: "/dashboard/events",
    },
    {
      label: "Sertifikat",
      value: "1",
      note: "Sudah diterbitkan",
      icon: ShieldCheck,
    },
    {
      label: "Komunitas aktif",
      value: "1.2K",
      note: "Peserta terhubung",
      icon: Users,
    },
  ];

  if (!isMounted) return null;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white/90 p-6 shadow-[0_20px_80px_rgba(15,23,42,0.04)] backdrop-blur sm:p-8">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[#CB2229]/10 blur-3xl" />
        <div className="absolute -bottom-8 left-24 h-32 w-32 rounded-full bg-sky-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-250 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
              <Sparkles size={14} />
              User dashboard aktif
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                Selamat datang, {profileName}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-655 sm:text-base">
                Ini adalah ruang personal Anda untuk memantau event, materi, dan program yang dapat Anda akses di .id Academy.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/events/up-events"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#CB2229] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-500/20 transition hover:bg-red-700"
            >
              Jelajahi Event
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Cards Grid */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {STAT_CARDS.map((card) => {
          const Icon = card.icon;
          const content = (
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-500">{card.label}</p>
                <p className="mt-2 text-3xl font-black text-slate-900">{card.value}</p>
                <p className="mt-2 text-xs font-semibold text-slate-400">{card.note}</p>
              </div>
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-[#CB2229]">
                <Icon size={22} />
              </div>
            </div>
          );

          if (card.href) {
            return (
              <Link
                key={card.label}
                href={card.href}
                className="block rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md hover:border-[#CB2229]/20"
              >
                {content}
              </Link>
            );
          }

          return (
            <div
              key={card.label}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              {content}
            </div>
          );
        })}
      </section>

      {/* Quick Links & Info */}
      <section className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Akses Cepat</h2>
              <p className="mt-1 text-sm text-slate-500">Langsung ke fitur yang paling sering dipakai.</p>
            </div>
            <div className="rounded-2xl bg-[#CB2229]/10 p-3 text-[#CB2229]">
              <ShieldCheck size={22} />
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {QUICK_LINKS.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group rounded-2xl border border-slate-200 bg-slate-50/80 p-4 transition hover:border-[#CB2229]/30 hover:bg-[#CB2229]/5"
                >
                  <div className="flex items-start gap-4">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-[#CB2229] shadow-sm">
                      <Icon size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="font-semibold text-slate-900">{item.label}</h3>
                        <ChevronRight
                          size={16}
                          className="text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-[#CB2229]"
                        />
                      </div>
                      <p className="mt-1 text-sm leading-6 text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
