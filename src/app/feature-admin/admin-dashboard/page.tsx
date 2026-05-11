"use client";

import React from "react";
import { CalendarDays, Rocket, Users, BookOpen, TrendingUp, Star } from "lucide-react";
import Link from "next/link";

const STATS = [
  { label: "Total Events", value: "12", change: "+3 bulan ini", icon: CalendarDays, color: "bg-blue-500", light: "bg-blue-50 text-blue-600" },
  { label: "Total Programs", value: "4", change: "+1 bulan ini", icon: Rocket, color: "bg-purple-500", light: "bg-purple-50 text-purple-600" },
  { label: "Total Trainers", value: "8", change: "Aktif semua", icon: Users, color: "bg-emerald-500", light: "bg-emerald-50 text-emerald-600" },
  { label: "Total Materi", value: "6", change: "+2 bulan ini", icon: BookOpen, color: "bg-orange-500", light: "bg-orange-50 text-orange-600" },
];

const RECENT_EVENTS = [
  { name: "Transformasi Digital UMKM dengan Domain .id", type: "Webinar", date: "12 Jan 2025", status: "Online" },
  { name: "Workshop DNS Management untuk Pemula", type: "Workshop", date: "14 Apr 2025", status: "Face to Face" },
  { name: "Kedaulatan Digital Indonesia di Era Internet 5.0", type: "Seminar", date: "5 Mar 2025", status: "Online" },
  { name: "Training of Trainer Batch 3", type: "Training", date: "18 Mar 2025", status: "Face to Face" },
];

const TYPE_COLOR: Record<string, string> = {
  Webinar: "bg-blue-50 text-blue-600",
  Workshop: "bg-amber-50 text-amber-600",
  Seminar: "bg-purple-50 text-purple-600",
  Training: "bg-green-50 text-green-600",
};

const QUICK_LINKS = [
  { href: "/feature-admin/admin-dashboard/events", label: "Kelola Events", icon: CalendarDays, desc: "Tambah & kelola event" },
  { href: "/feature-admin/admin-dashboard/programs", label: "Kelola Programs", icon: Rocket, desc: "Kelola program konten" },
  { href: "/feature-admin/admin-dashboard/trainers", label: "Kelola Trainers", icon: Users, desc: "Data trainer & profil" },
  { href: "/feature-admin/admin-dashboard/materi", label: "Kelola Materi", icon: BookOpen, desc: "Modul & buku digital" },
];

export default function AdminOverviewPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-6 text-white flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Selamat Datang, Admin! 👋</h2>
          <p className="text-slate-300 text-sm mt-1">Kelola konten .id Academy dari panel ini.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2">
          <Star size={16} className="text-yellow-400" />
          <span className="text-sm font-medium">Admin Aktif</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map(({ label, value, change, icon: Icon, color, light }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
                <p className="text-3xl font-extrabold text-slate-800 mt-1">{value}</p>
                <span className={`inline-flex items-center gap-1 text-xs font-medium mt-2 px-2 py-0.5 rounded-full ${light}`}>
                  <TrendingUp size={10} /> {change}
                </span>
              </div>
              <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center shadow-md`}>
                <Icon size={20} className="text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Two columns: Recent Events + Quick Access */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Events */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800">Event Terbaru</h3>
            <Link href="/feature-admin/admin-dashboard/events" className="text-xs text-[#CB2229] font-semibold hover:underline">
              Lihat Semua →
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {RECENT_EVENTS.map((ev) => (
              <div key={ev.name} className="px-6 py-4 flex items-start gap-4 hover:bg-slate-50 transition-colors">
                <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-[11px] font-semibold mt-0.5 ${TYPE_COLOR[ev.type]}`}>
                  {ev.type}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{ev.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{ev.date}</p>
                </div>
                <span className={`flex-shrink-0 flex items-center gap-1 text-[11px] font-medium ${ev.status === "Online" ? "text-sky-600" : "text-rose-500"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${ev.status === "Online" ? "bg-sky-500" : "bg-rose-500"}`} />
                  {ev.status}
                </span>
              </div>
            ))}
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
                <div className="w-9 h-9 rounded-lg bg-[#CB2229]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#CB2229]/20 transition-colors">
                  <Icon size={16} className="text-[#CB2229]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">{label}</p>
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
