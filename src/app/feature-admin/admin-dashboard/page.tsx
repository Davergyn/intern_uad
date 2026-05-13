"use client";

import React, { useEffect, useState } from "react";
import {
  CalendarDays,
  Rocket,
  Users,
  BookOpen,
  TrendingUp,
  Star,
  Loader2,
  CheckCircle2,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/utils/supabase/client";

interface EventData {
  id: number;
  title: string;
  event_type?: string | null;
  event_date?: string | null;
  format?: string | null;
}

interface CountData {
  count: number;
}

const STAT_CONFIGS = [
  {
    label: "Total Events",
    icon: CalendarDays,
    color: "bg-blue-500",
    light: "bg-blue-50 text-blue-600",
    table: "events",
  },
  {
    label: "Total Programs",
    icon: Rocket,
    color: "bg-purple-500",
    light: "bg-purple-50 text-purple-600",
    table: "programs",
  },
  {
    label: "Total Trainers",
    icon: Users,
    color: "bg-emerald-500",
    light: "bg-emerald-50 text-emerald-600",
    table: "trainers",
  },
  {
    label: "Total Materi",
    icon: BookOpen,
    color: "bg-orange-500",
    light: "bg-orange-50 text-orange-600",
    table: "materials",
  },
];

const TYPE_COLOR: Record<string, string> = {
  Webinar: "bg-blue-50 text-blue-600",
  Workshop: "bg-amber-50 text-amber-600",
  Seminar: "bg-purple-50 text-purple-600",
  Training: "bg-green-50 text-green-600",
};

const QUICK_LINKS = [
  {
    href: "/feature-admin/admin-dashboard/events",
    label: "Kelola Events",
    icon: CalendarDays,
    desc: "Tambah & kelola event",
  },
  {
    href: "/feature-admin/admin-dashboard/programs",
    label: "Kelola Programs",
    icon: Rocket,
    desc: "Kelola program konten",
  },
  {
    href: "/feature-admin/admin-dashboard/trainers",
    label: "Kelola Trainers",
    icon: Users,
    desc: "Data trainer & profil",
  },
  {
    href: "/feature-admin/admin-dashboard/materi",
    label: "Kelola Materi",
    icon: BookOpen,
    desc: "Modul & buku digital",
  },
];

// Safe date formatter dengan guard terhadap null/undefined/invalid dates
function formatDateSafe(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "—";
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  } catch {
    return "—";
  }
}

// Determine event status (Past / Upcoming) berdasarkan tanggal
function getEventStatus(eventDate: string | null | undefined): {
  status: "Past" | "Upcoming";
  bgColor: string;
  textColor: string;
  borderColor: string;
  icon: "check" | "clock";
} {
  if (!eventDate) {
    return {
      status: "Upcoming",
      bgColor: "bg-amber-50",
      textColor: "text-amber-600",
      borderColor: "border-amber-200/60",
      icon: "clock",
    };
  }

  try {
    // Get today's date tanpa waktu (YYYY-MM-DD format)
    const today = new Date().toISOString().split("T")[0];
    const eventDateOnly = eventDate.split("T")[0]; // Extract YYYY-MM-DD

    // Bandingkan tanggal
    if (eventDateOnly < today) {
      // Past event
      return {
        status: "Past",
        bgColor: "bg-emerald-50",
        textColor: "text-emerald-600",
        borderColor: "border-emerald-200/60",
        icon: "check",
      };
    } else {
      // Upcoming event (termasuk hari ini)
      return {
        status: "Upcoming",
        bgColor: "bg-amber-50",
        textColor: "text-amber-600",
        borderColor: "border-amber-200/60",
        icon: "clock",
      };
    }
  } catch {
    return {
      status: "Upcoming",
      bgColor: "bg-amber-50",
      textColor: "text-amber-600",
      borderColor: "border-amber-200/60",
      icon: "clock",
    };
  }
}

// Skeleton loader untuk stats card
function StatSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="h-3 w-20 bg-slate-200 rounded animate-pulse" />
          <div className="h-8 w-16 bg-slate-300 rounded mt-3 animate-pulse" />
          <div className="h-5 w-24 bg-slate-200 rounded mt-2 animate-pulse" />
        </div>
        <div className="w-11 h-11 bg-slate-200 rounded-xl animate-pulse" />
      </div>
    </div>
  );
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<Record<string, number> | null>(null);
  const [recentEvents, setRecentEvents] = useState<EventData[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [error, setError] = useState("");

  // Fetch metrik total dari 4 tabel
  useEffect(() => {
    const fetchStats = async () => {
      setIsLoadingStats(true);
      setError("");
      try {
        const [eventsRes, programsRes, trainersRes, materialsRes] =
          await Promise.all([
            supabase.from("events").select("*", { count: "exact" }),
            supabase.from("programs").select("*", { count: "exact" }),
            supabase.from("trainers").select("*", { count: "exact" }),
            supabase.from("materials").select("*", { count: "exact" }),
          ]);

        const statsData = {
          "Total Events": eventsRes.count ?? 0,
          "Total Programs": programsRes.count ?? 0,
          "Total Trainers": trainersRes.count ?? 0,
          "Total Materi": materialsRes.count ?? 0,
        };

        setStats(statsData);
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError("Gagal memuat data metrik.");
      } finally {
        setIsLoadingStats(false);
      }
    };

    void fetchStats();
  }, []);

  // Fetch event terbaru
  useEffect(() => {
    const fetchRecentEvents = async () => {
      setIsLoadingEvents(true);
      try {
        const { data, error: fetchError } = await supabase
          .from("events")
          .select("id, title, event_type, event_date, format")
          .order("event_date", { ascending: false })
          .limit(4);

        if (fetchError) {
          console.error("Error fetching recent events:", fetchError);
          setRecentEvents([]);
        } else {
          setRecentEvents((data as EventData[]) ?? []);
        }
      } catch (err) {
        console.error("Error fetching recent events:", err);
        setRecentEvents([]);
      } finally {
        setIsLoadingEvents(false);
      }
    };

    void fetchRecentEvents();
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-linear-to-r from-slate-800 to-slate-700 rounded-2xl p-6 text-white flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Selamat Datang, Admin! 👋</h2>
          <p className="text-slate-300 text-sm mt-1">
            Kelola konten .id Academy dari panel ini.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2">
          <Star size={16} className="text-yellow-400" />
          <span className="text-sm font-medium">Admin Aktif</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {isLoadingStats ? (
          <>
            {[...Array(4)].map((_, i) => (
              <StatSkeleton key={i} />
            ))}
          </>
        ) : (
          STAT_CONFIGS.map(({ label, icon: Icon, color, light, table }) => (
            <div
              key={label}
              className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    {label}
                  </p>
                  <p className="text-3xl font-extrabold text-slate-800 mt-1">
                    {stats?.[label] ?? 0}
                  </p>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-medium mt-2 px-2 py-0.5 rounded-full ${light}`}
                  >
                    <TrendingUp size={10} /> Data real-time
                  </span>
                </div>
                <div
                  className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center shadow-md`}
                >
                  <Icon size={20} className="text-white" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Two columns: Recent Events + Quick Access */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Events */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800">Event Terbaru</h3>
            <Link
              href="/feature-admin/admin-dashboard/events"
              className="text-xs text-[#CB2229] font-semibold hover:underline"
            >
              Lihat Semua →
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {isLoadingEvents ? (
              <div className="px-6 py-12 flex items-center justify-center">
                <Loader2
                  size={20}
                  className="animate-spin text-slate-400 mr-2"
                />
                <span className="text-sm text-slate-400">
                  Memuat event terbaru...
                </span>
              </div>
            ) : recentEvents.length === 0 ? (
              <div className="px-6 py-12 text-center text-slate-400 text-sm">
                Belum ada data event.
              </div>
            ) : (
              recentEvents.map((ev) => {
                const eventType = ev.event_type ?? "Event";
                const eventFormat = ev.format ?? "Online";
                const isOnline = eventFormat === "Online";
                const eventStatus = getEventStatus(ev.event_date);

                return (
                  <div
                    key={ev.id}
                    className="px-6 py-4 flex items-start gap-4 hover:bg-slate-50 transition-colors"
                  >
                    <span
                      className={`shrink-0 px-2 py-0.5 rounded-full text-[11px] font-semibold mt-0.5 ${TYPE_COLOR[eventType] ?? "bg-slate-50 text-slate-600"}`}
                    >
                      {eventType}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">
                        {ev.title}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {formatDateSafe(ev.event_date)}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 flex items-center gap-1 text-[11px] font-medium ${isOnline ? "text-sky-600" : "text-rose-500"}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${isOnline ? "bg-sky-500" : "bg-rose-500"}`}
                      />
                      {eventFormat}
                    </span>
                    <span
                      className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold w-fit border ${eventStatus.bgColor} ${eventStatus.textColor} ${eventStatus.borderColor}`}
                    >
                      {eventStatus.icon === "check" ? (
                        <CheckCircle2 size={13} />
                      ) : (
                        <Clock size={13} />
                      )}
                      {eventStatus.status}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Quick Access */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="font-bold text-slate-800 mb-4">Akses Cepat</h3>
          <div className="space-y-2">
            {QUICK_LINKS.map(({ href, label, icon: Icon, desc }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all group"
              >
                <div className="w-9 h-9 rounded-lg bg-[#CB2229]/10 flex items-center justify-center shrink-0 group-hover:bg-[#CB2229]/20 transition-colors">
                  <Icon size={16} className="text-[#CB2229]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    {label}
                  </p>
                  <p className="text-[11px] text-slate-400">{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
