"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  CalendarDays,
  ChevronRight,
  GraduationCap,
  LogOut,
  MessageCircleMore,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { useAuth } from "@/lib/authContext";

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

const STAT_CARDS = [
  {
    label: "Event diikuti",
    value: "12",
    note: "+3 bulan ini",
    icon: CalendarDays,
  },
  {
    label: "Materi tersimpan",
    value: "8",
    note: "Siap dibaca kapan saja",
    icon: BookOpen,
  },
  {
    label: "Sertifikat",
    value: "3",
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

function getDisplayName(email: string | null) {
  if (!email) return "User";
  return email.split("@")[0];
}

export default function UserDashboardPage() {
  const router = useRouter();
  const { currentRole, userEmail, isAdmin, logout } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    if (!currentRole) {
      router.replace("/auth/login");
      return;
    }

    if (isAdmin) {
      router.replace("/feature-admin/admin-dashboard");
    }
  }, [currentRole, isAdmin, isMounted, router]);

  const handleLogout = () => {
    logout();
    router.replace("/auth/login");
  };

  if (!isMounted || !currentRole || isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(203,34,41,0.10),_transparent_36%),linear-gradient(180deg,_#fff_0%,_#f8fafc_100%)] px-6 text-slate-500">
        Memuat dashboard user...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(203,34,41,0.10),_transparent_34%),linear-gradient(180deg,_#fff_0%,_#f8fafc_100%)] text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white/90 p-6 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[#CB2229]/10 blur-3xl" />
          <div className="absolute -bottom-8 left-24 h-32 w-32 rounded-full bg-sky-500/10 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                <Sparkles size={14} />
                User dashboard aktif
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                  Selamat datang, {getDisplayName(userEmail)}
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                  Ini adalah ruang personal untuk memantau event, materi, dan program yang bisa
                  kamu akses di .id Academy.
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
              <button
                onClick={handleLogout}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {STAT_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500">{card.label}</p>
                    <p className="mt-2 text-3xl font-black text-slate-900">{card.value}</p>
                    <p className="mt-2 text-xs font-medium text-slate-400">{card.note}</p>
                  </div>
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-[#CB2229]">
                    <Icon size={22} />
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
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
                          <ChevronRight size={16} className="text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-[#CB2229]" />
                        </div>
                        <p className="mt-1 text-sm leading-6 text-slate-500">{item.desc}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <aside className="rounded-[2rem] border border-slate-200 bg-slate-900 p-6 text-white shadow-sm sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              Akun Anda
            </p>
            <div className="mt-5 flex items-center gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/10 text-xl font-black text-white">
                {userEmail?.[0]?.toUpperCase() ?? "U"}
              </div>
              <div>
                <p className="text-lg font-bold">{userEmail ?? "user@gmail.com"}</p>
                <p className="text-sm text-slate-400">Akun user terhubung</p>
              </div>
            </div>

            <div className="mt-6 space-y-3 rounded-3xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Status</span>
                <span className="font-semibold text-emerald-300">Aktif</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Role</span>
                <span className="font-semibold">User</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Akses cepat</span>
                <span className="font-semibold">Event, Materi, Program</span>
              </div>
            </div>

            <div className="mt-6 rounded-3xl bg-[#CB2229] p-5 shadow-lg shadow-red-950/20">
              <p className="text-sm font-semibold text-white/90">Saran berikutnya</p>
              <p className="mt-2 text-sm leading-6 text-white/80">
                Mulai dari event terdekat, lalu buka materi yang relevan untuk mempercepat progres belajar.
              </p>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
