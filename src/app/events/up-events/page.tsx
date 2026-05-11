"use client";

import React, { useState } from "react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";

// ─────────────────────────────────────────────
//  DATA
// ─────────────────────────────────────────────

type EventRow = {
    id: number;
    type: "Webinar" | "Workshop" | "Seminar" | "Training";
    name: string;
    date: string;
    delivery: "Online" | "Face to Face";
};

const allEvents: EventRow[] = [
    { id: 1, type: "Webinar", name: "Transformasi Digital UMKM dengan Domain .id", date: "12 Januari 2025", delivery: "Online" },
    { id: 2, type: "Workshop", name: "Cara Membuat Website Profesional Menggunakan Domain .id", date: "20 Februari 2025", delivery: "Face to Face" },
    { id: 3, type: "Seminar", name: "Kedaulatan Digital Indonesia di Era Internet 5.0", date: "5 Maret 2025", delivery: "Online" },
    { id: 4, type: "Training", name: "Training of Trainer Batch 3 – Literasi Digital Nasional", date: "18 Maret 2025", delivery: "Face to Face" },
    { id: 5, type: "Webinar", name: "Keamanan Siber: Lindungi Identitas Digital Anda", date: "2 April 2025", delivery: "Online" },
    { id: 6, type: "Workshop", name: "DNS Management & Konfigurasi Domain .id untuk Pemula", date: "14 April 2025", delivery: "Face to Face" },
    { id: 7, type: "Seminar", name: "Peran PANDI dalam Ekosistem Internet Indonesia", date: "28 April 2025", delivery: "Online" },
    { id: 8, type: "Webinar", name: "Personal Branding Digital: Strategi Tampil di Dunia Maya", date: "10 Mei 2025", delivery: "Online" },
    { id: 9, type: "Training", name: "Workshop Digital Marketing Berbasis Nama Domain .id", date: "22 Mei 2025", delivery: "Face to Face" },
    { id: 10, type: "Seminar", name: "Forum Diskusi: Masa Depan Internet dan Identitas Digital", date: "3 Juni 2025", delivery: "Online" },
    { id: 11, type: "Webinar", name: "Cloud Computing untuk Bisnis Digital Indonesia", date: "17 Juni 2025", delivery: "Online" },
    { id: 12, type: "Workshop", name: "Membangun E-Commerce dengan Domain .id yang Terpercaya", date: "1 Juli 2025", delivery: "Face to Face" },
];

const ROWS_PER_PAGE = 8;

// ─────────────────────────────────────────────
//  TYPE BADGE
// ─────────────────────────────────────────────

const typeBadgeClass: Record<EventRow["type"], string> = {
    Webinar: "bg-blue-50 text-blue-600",
    Workshop: "bg-amber-50 text-amber-600",
    Seminar: "bg-purple-50 text-purple-600",
    Training: "bg-green-50 text-green-600",
};

const deliveryBadgeClass: Record<EventRow["delivery"], string> = {
    "Online": "bg-sky-50 text-sky-600",
    "Face to Face": "bg-rose-50 text-rose-600",
};

// ─────────────────────────────────────────────
//  PAGINATION
// ─────────────────────────────────────────────

function Pagination({
    current,
    total,
    onChange,
}: {
    current: number;
    total: number;
    onChange: (p: number) => void;
}) {
    const pages: (number | "...")[] = [];
    if (total <= 5) {
        for (let i = 1; i <= total; i++) pages.push(i);
    } else {
        pages.push(1);
        if (current > 3) pages.push("...");
        for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i);
        if (current < total - 2) pages.push("...");
        pages.push(total);
    }

    const btn = "flex items-center justify-center w-9 h-9 rounded-md text-sm font-semibold transition-all duration-150";

    return (
        <div className="flex justify-center items-center gap-2 mt-10">
            {/* Prev */}
            <button
                onClick={() => onChange(Math.max(1, current - 1))}
                disabled={current === 1}
                aria-label="Halaman sebelumnya"
                className={`${btn} text-[#6b7280] hover:bg-gray-100 disabled:opacity-30`}
            >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
            </button>

            {pages.map((p, i) =>
                p === "..." ? (
                    <span key={`e${i}`} className={`${btn} text-[#9ca3af]`}>...</span>
                ) : (
                    <button
                        key={p}
                        onClick={() => onChange(p as number)}
                        aria-label={`Halaman ${p}`}
                        aria-current={p === current ? "page" : undefined}
                        className={`${btn} ${p === current ? "bg-[#1f2937] text-white" : "text-[#6b7280] hover:bg-gray-100"}`}
                    >
                        {p}
                    </button>
                )
            )}

            {/* Next */}
            <button
                onClick={() => onChange(Math.min(total, current + 1))}
                disabled={current === total}
                aria-label="Halaman berikutnya"
                className={`${btn} text-[#6b7280] hover:bg-gray-100 disabled:opacity-30`}
            >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
            </button>
        </div>
    );
}

// ─────────────────────────────────────────────
//  PAGE
// ─────────────────────────────────────────────

export default function UpcomingEvents() {
    const [page, setPage] = useState(1);

    const totalPages = Math.ceil(allEvents.length / ROWS_PER_PAGE);
    const start = (page - 1) * ROWS_PER_PAGE;
    const visible = allEvents.slice(start, start + ROWS_PER_PAGE);

    const handlePageChange = (p: number) => {
        setPage(p);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <main className="min-h-screen bg-[#f9fafb] text-[#111827]">
            <Navbar />

            <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-10 lg:py-14">

                {/* ── Header Banner ── */}
                <div className="mb-8 flex flex-col sm:flex-row items-start gap-6 rounded-2xl bg-[#e5e7eb] p-6 sm:p-10">
                    {/* Clock icon */}
                    <div className="flex-shrink-0 mt-0.5">
                        <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#1f2937]">
                            <svg className="h-7 w-7 sm:h-8 sm:w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                                <circle cx="12" cy="12" r="9" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 3" />
                            </svg>
                        </div>
                    </div>

                    {/* Text */}
                    <div>
                        <h1 className="text-xl sm:text-2xl font-extrabold text-[#111827]">Up Events</h1>
                        <p className="mt-2 text-[1rem] sm:text-[1.05rem] text-[#4b5563]">
                            Historical record of Up training events.
                        </p>
                        <p className="text-[1rem] sm:text-[1.05rem] text-[#4b5563]">
                            A range of Up events — online webinars, hands-on workshops, and insightful seminars.
                        </p>
                    </div>
                </div>

                {/* ── Mobile View (Cards) ── */}
                <div className="grid grid-cols-1 gap-4 md:hidden">
                    {visible.length > 0 ? (
                        visible.map((row) => (
                            <div
                                key={row.id}
                                className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                            >
                                {/* Badges */}
                                <div className="flex items-center justify-between">
                                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${typeBadgeClass[row.type]}`}>
                                        {row.type}
                                    </span>
                                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${deliveryBadgeClass[row.delivery]}`}>
                                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                        {row.delivery}
                                    </span>
                                </div>

                                {/* Name */}
                                <h3 className="text-[1rem] font-semibold text-[#1f2937] leading-snug">
                                    {row.name}
                                </h3>

                                {/* Date */}
                                <div className="flex items-center gap-2 text-sm text-[#6b7280] mt-1">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {row.date}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-12 text-center text-gray-500 rounded-xl bg-white border border-gray-100">
                            Belum ada data event masa lalu.
                        </div>
                    )}
                </div>

                {/* ── Desktop View (Table) ── */}
                <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-[0_2px_15px_rgba(0,0,0,0.03)]">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr>
                                {["Event Type", "Name", "Date", "Delivery"].map((col) => (
                                    <th
                                        key={col}
                                        className="py-5 px-6 text-[0.9rem] font-semibold text-gray-400 border-b-2 border-gray-100 whitespace-nowrap"
                                    >
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {visible.length > 0 ? (
                                visible.map((row) => (
                                    <tr
                                        key={row.id}
                                        className="border-b border-gray-100 last:border-b-0 transition-colors hover:bg-[#f9fafb]"
                                    >
                                        {/* Type */}
                                        <td className="py-4 px-6 whitespace-nowrap">
                                            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${typeBadgeClass[row.type]}`}>
                                                {row.type}
                                            </span>
                                        </td>

                                        {/* Name */}
                                        <td className="py-4 px-6 text-[0.95rem] text-[#1f2937] font-medium max-w-[320px]">
                                            {row.name}
                                        </td>

                                        {/* Date */}
                                        <td className="py-4 px-6 text-[0.95rem] text-[#6b7280] whitespace-nowrap">
                                            {row.date}
                                        </td>

                                        {/* Delivery */}
                                        <td className="py-4 px-6 whitespace-nowrap">
                                            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${deliveryBadgeClass[row.delivery]}`}>
                                                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                                {row.delivery}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="py-12 text-center text-gray-500">
                                        Belum ada data event masa lalu.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* ── Row count info ── */}
                {allEvents.length > 0 && (
                    <p className="mt-6 text-center text-xs text-[#9ca3af]">
                        Menampilkan {start + 1}–{Math.min(start + ROWS_PER_PAGE, allEvents.length)} dari {allEvents.length} event
                    </p>
                )}

                {/* ── Pagination ── */}
                {totalPages > 1 && (
                    <Pagination current={page} total={totalPages} onChange={handlePageChange} />
                )}
            </div>

            <div className="pb-16" />
            <Footer />
        </main>
    );
}