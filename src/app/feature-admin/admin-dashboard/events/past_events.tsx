"use client";

import { useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Clock3, ExternalLink, Search, Sparkles } from "lucide-react";

type PastEvent = {
	id: number;
	type: "Webinar" | "Workshop" | "Seminar" | "Training";
	name: string;
	date: string;
	delivery: "Online" | "Face to Face" | "Hybrid";
	link?: string;
};

const PAST_EVENTS: PastEvent[] = [
	{ id: 1, type: "Webinar", name: "Apa itu Domain dan Kenapa Penting?", date: "13 Maret 2026", delivery: "Online", link: "https://example.com/event-1" },
	{ id: 2, type: "Webinar", name: "Mengenal Domain .id sebagai Identitas Digital.", date: "12 Maret 2026", delivery: "Online", link: "https://example.com/event-2" },
	{ id: 3, type: "Workshop", name: "Pembuatan Platform Digital untuk UKM.", date: "12 Maret 2026", delivery: "Face to Face", link: "https://example.com/event-3" },
	{ id: 4, type: "Workshop", name: "Pembuatan Platform Digital untuk UKM.", date: "11 Maret 2026", delivery: "Face to Face", link: "https://example.com/event-4" },
	{ id: 5, type: "Webinar", name: "Perlindungan Data Pribadi", date: "11 Maret 2026", delivery: "Online", link: "https://example.com/event-5" },
	{ id: 6, type: "Webinar", name: "Domain .id sebagai Fondasi Identitas Digital yang Aman", date: "10 Maret 2026", delivery: "Online", link: "https://example.com/event-6" },
	{ id: 7, type: "Webinar", name: "Membangun Ekosistem Digital yang Tangguh, Aman, dan Berkelanjutan.", date: "07 Maret 2026", delivery: "Online", link: "https://example.com/event-7" },
	{ id: 8, type: "Workshop", name: "BIKIN WEB TOKO ONLINE UNTUK UMKM", date: "04 Februari 2026", delivery: "Online", link: "https://example.com/event-8" },
	{ id: 9, type: "Webinar", name: "Literasi Digital di Era Internet Of Things (IoT)", date: "20 November 2025", delivery: "Online", link: "https://example.com/event-9" },
	{ id: 10, type: "Webinar", name: "Kemampuan Literasi Dalam Berbagai Bentuk Media", date: "15 November 2025", delivery: "Online", link: "https://example.com/event-10" },
];

const PAGE_SIZE = 5;

const TYPE_STYLES: Record<PastEvent["type"], string> = {
	Webinar: "bg-sky-50 text-sky-700 ring-1 ring-sky-100",
	Workshop: "bg-amber-50 text-amber-700 ring-1 ring-amber-100",
	Seminar: "bg-violet-50 text-violet-700 ring-1 ring-violet-100",
	Training: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
};

const DELIVERY_STYLES: Record<PastEvent["delivery"], string> = {
	Online: "bg-emerald-50 text-emerald-700",
	"Face to Face": "bg-rose-50 text-rose-700",
	Hybrid: "bg-slate-100 text-slate-700",
};

export default function PastEventsPanel() {
	const [query, setQuery] = useState("");
	const [page, setPage] = useState(1);

	const filtered = useMemo(() => {
		const keyword = query.trim().toLowerCase();
		if (!keyword) return PAST_EVENTS;

		return PAST_EVENTS.filter(
			(item) =>
				item.name.toLowerCase().includes(keyword) ||
				item.type.toLowerCase().includes(keyword) ||
				item.date.toLowerCase().includes(keyword) ||
				item.delivery.toLowerCase().includes(keyword),
		);
	}, [query]);

	const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
	const safePage = Math.min(page, totalPages);
	const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

	const goToPage = (nextPage: number) => {
		const clamped = Math.min(Math.max(nextPage, 1), totalPages);
		setPage(clamped);
	};

	return (
		<section className="mt-8 overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
			<div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-rose-50 px-5 py-5 sm:px-6">
				<div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
					<div className="max-w-2xl">
						<div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#CB2229]/10 px-3 py-1 text-xs font-semibold text-[#CB2229]">
							<Sparkles size={14} /> Riwayat Event
						</div>
						<h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
							Tampilan event yang bersih, informatif, dan mudah dipindai
						</h2>
						<p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-[15px]">
							Daftar berikut dirancang agar mirip referensi yang Anda kirim, namun dengan detail visual yang lebih rapi dan selaras dengan gaya admin `.id Academy`.
						</p>
					</div>

					<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
						<div className="relative w-full sm:w-[340px]">
							<Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
							<input
								value={query}
								onChange={(event) => {
									setQuery(event.target.value);
									setPage(1);
								}}
								placeholder="Cari event, tanggal, atau jenis..."
								className="h-11 w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-700 shadow-sm outline-none transition focus:border-[#CB2229] focus:ring-4 focus:ring-[#CB2229]/10"
							/>
						</div>
						<div className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm">
							<CalendarDays size={16} className="text-white/90" />
							{filtered.length} Event
						</div>
					</div>
				</div>

				<div className="mt-5 grid gap-3 sm:grid-cols-3">
					<div className="rounded-2xl border border-white/60 bg-white/80 p-4 shadow-sm backdrop-blur">
						<p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Total Riwayat</p>
						<p className="mt-2 text-2xl font-black text-slate-900">{PAST_EVENTS.length}</p>
					</div>
					<div className="rounded-2xl border border-white/60 bg-white/80 p-4 shadow-sm backdrop-blur">
						<p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Webinar</p>
						<p className="mt-2 text-2xl font-black text-slate-900">{PAST_EVENTS.filter((item) => item.type === "Webinar").length}</p>
					</div>
					<div className="rounded-2xl border border-white/60 bg-white/80 p-4 shadow-sm backdrop-blur">
						<p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Workshop</p>
						<p className="mt-2 text-2xl font-black text-slate-900">{PAST_EVENTS.filter((item) => item.type === "Workshop").length}</p>
					</div>
				</div>
			</div>

			<div className="overflow-x-auto">
				<table className="min-w-full border-separate border-spacing-0 text-left">
					<thead>
						<tr className="bg-slate-50/90 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
							<th className="border-b border-slate-100 px-5 py-4 sm:px-6">Event Type</th>
							<th className="border-b border-slate-100 px-5 py-4 sm:px-6">Name</th>
							<th className="border-b border-slate-100 px-5 py-4 sm:px-6">Date</th>
							<th className="border-b border-slate-100 px-5 py-4 sm:px-6">Delivery</th>
							<th className="border-b border-slate-100 px-5 py-4 text-right sm:px-6">Action</th>
						</tr>
					</thead>
					<tbody>
						{pageItems.length > 0 ? (
							pageItems.map((item) => (
								<tr key={item.id} className="group transition-colors hover:bg-slate-50/80">
									<td className="border-b border-slate-100 px-5 py-4 align-top sm:px-6">
										<span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${TYPE_STYLES[item.type]}`}>
											{item.type}
										</span>
									</td>
									<td className="border-b border-slate-100 px-5 py-4 align-top sm:px-6">
										<div className="max-w-[480px]">
											<p className="text-sm font-semibold leading-6 text-slate-900 sm:text-[15px]">
												{item.name}
											</p>
											<p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
												<Clock3 size={12} /> Event sudah selesai dan tersimpan sebagai arsip publik.
											</p>
										</div>
									</td>
									<td className="border-b border-slate-100 px-5 py-4 align-top whitespace-nowrap text-sm text-slate-500 sm:px-6">
										{item.date}
									</td>
									<td className="border-b border-slate-100 px-5 py-4 align-top sm:px-6">
										<span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${DELIVERY_STYLES[item.delivery]}`}>
											{item.delivery}
										</span>
									</td>
									<td className="border-b border-slate-100 px-5 py-4 align-top text-right sm:px-6">
										<a
											href={item.link ?? "#"}
											target="_blank"
											rel="noreferrer"
											className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-[#CB2229]/30 hover:text-[#CB2229]"
										>
											Detail
											<ExternalLink size={13} />
										</a>
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan={5} className="px-6 py-16 text-center text-sm text-slate-400">
									Tidak ada event yang cocok dengan pencarian.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			<div className="flex flex-col gap-4 border-t border-slate-100 px-5 py-5 sm:px-6 sm:flex-row sm:items-center sm:justify-between">
				<p className="text-sm text-slate-500">
					Menampilkan <span className="font-semibold text-slate-800">{pageItems.length}</span> dari <span className="font-semibold text-slate-800">{filtered.length}</span> data
				</p>

				<div className="flex items-center gap-2">
					<button
						onClick={() => goToPage(safePage - 1)}
						disabled={safePage === 1}
						className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-600 shadow-sm transition hover:border-[#CB2229]/30 hover:text-[#CB2229] disabled:cursor-not-allowed disabled:opacity-40"
						aria-label="Halaman sebelumnya"
					>
						<ChevronLeft size={16} />
					</button>

					{Array.from({ length: totalPages }).map((_, index) => {
						const current = index + 1;
						const active = current === safePage;
						return (
							<button
								key={current}
								onClick={() => goToPage(current)}
								className={`min-w-10 rounded-xl px-3 py-2 text-sm font-semibold transition ${
									active
										? "bg-slate-900 text-white shadow-sm"
										: "border border-slate-200 bg-white text-slate-600 hover:border-[#CB2229]/30 hover:text-[#CB2229]"
								}`}
							>
								{current}
							</button>
						);
					})}

					<button
						onClick={() => goToPage(safePage + 1)}
						disabled={safePage === totalPages}
						className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-600 shadow-sm transition hover:border-[#CB2229]/30 hover:text-[#CB2229] disabled:cursor-not-allowed disabled:opacity-40"
						aria-label="Halaman berikutnya"
					>
						<ChevronRight size={16} />
					</button>
				</div>
			</div>
		</section>
	);
}
