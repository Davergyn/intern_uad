"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import {
  LayoutDashboard,
  CalendarDays,
  Rocket,
  Users,
  BookOpen,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/feature-admin/admin-dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/feature-admin/admin-dashboard/events", label: "Kelola Events", icon: CalendarDays },
  { href: "/feature-admin/admin-dashboard/programs", label: "Kelola Programs", icon: Rocket },
  { href: "/feature-admin/admin-dashboard/trainers", label: "Kelola Trainers", icon: Users },
  { href: "/feature-admin/admin-dashboard/materi", label: "Kelola Materi", icon: BookOpen },
];

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { adminEmail, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const activeLabel = NAV_ITEMS.find((n) =>
    pathname === n.href || (n.href !== "/feature-admin/admin-dashboard" && pathname.startsWith(n.href))
  )?.label ?? "Dashboard";

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-700">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-extrabold text-[#CB2229]">.id</span>
          <span className="text-xl font-extrabold text-white">academy</span>
        </Link>
        <p className="text-xs text-slate-400 mt-1">Admin Panel</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive =
            pathname === href ||
            (href !== "/feature-admin/admin-dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                isActive
                  ? "bg-[#CB2229] text-white shadow-lg shadow-red-900/30"
                  : "text-slate-300 hover:bg-slate-700/60 hover:text-white"
              }`}
            >
              <Icon size={18} className="flex-shrink-0" />
              <span>{label}</span>
              {isActive && <ChevronRight size={14} className="ml-auto" />}
            </Link>
          );
        })}
      </nav>

      {/* Admin Info + Logout */}
      <div className="px-4 py-4 border-t border-slate-700 space-y-3">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-[#CB2229] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {adminEmail?.[0]?.toUpperCase() ?? "A"}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-white truncate">{adminEmail ?? "Admin"}</p>
            <p className="text-[10px] text-slate-400">Administrator</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-300 hover:bg-red-900/40 hover:text-red-400 transition-all duration-150"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-800 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* ── Mobile Sidebar Overlay ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-slate-800 z-50">
            <button
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={20} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4 flex items-center justify-between flex-shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-lg font-bold text-slate-800">{activeLabel}</h1>
              <p className="text-xs text-slate-400 hidden sm:block">
                .id Academy Admin Panel
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
              <div className="w-6 h-6 rounded-full bg-[#CB2229] flex items-center justify-center text-white text-[10px] font-bold">
                {adminEmail?.[0]?.toUpperCase() ?? "A"}
              </div>
              <span className="text-xs text-slate-700 font-medium max-w-[120px] truncate">
                {adminEmail ?? "Admin"}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#CB2229] hover:bg-red-700 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
