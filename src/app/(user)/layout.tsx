"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Bookmark,
  Settings,
  LogOut,
  Home,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/lib/authContext";
import { useProfileName } from "@/lib/hooks/useProfileName";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
};

const NAV_ITEMS: NavItem[] = [
  {
    href: "/dashboard",
    label: "Ringkasan",
    icon: LayoutDashboard,
  },
  {
    href: "/dashboard/events",
    label: "Event Tersimpan",
    icon: Bookmark,
  },
  {
    href: "/dashboard/settings",
    label: "Pengaturan & Profil",
    icon: Settings,
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { currentRole, userEmail, isAdmin, logout } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Shared hook â€” re-read setiap kali pathname berubah (misal: setelah update di settings)
  const profileName = useProfileName(isMounted ? userEmail : null, [pathname]);

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
      router.replace("/admin");
    }
  }, [currentRole, isAdmin, isMounted, router]);

  const handleLogout = () => {
    logout();
    router.replace("/auth/login");
  };

  if (!isMounted || !currentRole || isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(203,34,41,0.10),_transparent_36%),linear-gradient(180deg,_#fff_0%,_#f8fafc_100%)] px-6 text-slate-500 font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#CB2229] border-t-transparent"></div>
          <p className="text-sm font-medium">Memuat halaman dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden w-72 shrink-0 border-r border-slate-200/80 bg-white lg:flex lg:flex-col">
        {/* Brand */}
        <div className="flex h-16 items-center px-6 border-b border-slate-100">
          <Link href="/" className="text-xl font-black tracking-tight">
            <span className="text-[#CB2229]">.id</span>{" "}
            <span className="text-emerald-500">academy</span>
          </Link>
        </div>

        {/* User Card */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#CB2229] text-lg font-black text-white shadow-md shadow-red-500/10">
              {profileName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-slate-800">{profileName}</p>
              <p className="truncate text-xs text-slate-500">{userEmail}</p>
            </div>
          </div>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 space-y-1 px-4 py-6">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-[#CB2229]/5 text-[#CB2229]"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon size={18} className={isActive ? "text-[#CB2229]" : "text-slate-400"} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-100 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-950 transition"
          >
            <Home size={16} />
            Kembali ke Beranda
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-rose-600 hover:bg-rose-50 transition"
          >
            <LogOut size={16} />
            Keluar Akun
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Sidebar */}
      <div
        className={`fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isSidebarOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      >
        <aside
          className={`absolute bottom-0 top-0 left-0 flex w-72 flex-col bg-white transition-transform duration-300 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Brand & Close */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-slate-100">
            <Link href="/" className="text-xl font-black tracking-tight">
              <span className="text-[#CB2229]">.id</span>{" "}
              <span className="text-emerald-500">academy</span>
            </Link>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
            >
              <X size={20} />
            </button>
          </div>

          {/* User Card */}
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#CB2229] text-lg font-black text-white">
                {profileName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-slate-800">{profileName}</p>
                <p className="truncate text-xs text-slate-500">{userEmail}</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-1 px-4 py-6">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-[#CB2229]/5 text-[#CB2229]"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon size={18} className={isActive ? "text-[#CB2229]" : "text-slate-400"} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Footer Navigation */}
          <div className="p-4 border-t border-slate-100 space-y-2">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-950 transition"
            >
              <Home size={16} />
              Kembali ke Beranda
            </Link>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-rose-600 hover:bg-rose-50 transition"
            >
              <LogOut size={16} />
              Keluar Akun
            </button>
          </div>
        </aside>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header navbar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200/80 bg-white px-4 lg:hidden">
          <Link href="/" className="text-lg font-black tracking-tight">
            <span className="text-[#CB2229]">.id</span>{" "}
            <span className="text-emerald-500">academy</span>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
          >
            <Menu size={20} />
          </button>
        </header>

        {/* Scrollable page body */}
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-5xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
