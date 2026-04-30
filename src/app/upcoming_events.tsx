"use client";

import React, { useState } from "react";
import Navbar from "./components/navbar";

const stats = [
	{
		label: "Total arsip",
		value: "120+",
		caption: "Event terdokumentasi",
	},
	{
		label: "Format",
		value: "3",
		caption: "Online, hybrid, offline",
	},
	{
		label: "Topik teratas",
		value: "AI",
		caption: "Paling banyak diminati",
	},
	{
		label: "Update terakhir",
		value: "2026",
		caption: "Arsip terbaru tersedia",
	},
];

const filterTabs = ["Semua", "Webinar", "Workshop"];

const featuredEvents = [
	{
		category: "Webinar",
		subtitle: "Digital ecosystem",
		title: "Membangun Ekosistem Digital yang Tangguh, Aman, dan Berkelanjutan.",
		tags: ["Keamanan digital", "Transformasi"],
		dateLabel: "Tanggal",
		date: "07 Maret 2026",
		deliveryLabel: "Delivery",
		delivery: "Online",
	},
	{
		category: "Webinar",
		subtitle: "Digital ecosystem",
		title: "Membangun Ekosistem Digital yang Tangguh, Aman, dan Berkelanjutan.",
		tags: ["Keamanan digital", "Transformasi"],
		dateLabel: "Tanggal",
		date: "07 Maret 2026",
		deliveryLabel: "Delivery",
		delivery: "Online",
	},
	{
		category: "Webinar",
		subtitle: "Digital ecosystem",
		title: "Membangun Ekosistem Digital yang Tangguh, Aman, dan Berkelanjutan.",
		tags: ["Keamanan digital", "Transformasi"],
		dateLabel: "Tanggal",
		date: "07 Maret 2026",
		deliveryLabel: "Delivery",
		delivery: "Online",
	},
	{
		category: "Webinar",
		subtitle: "Digital ecosystem",
		title: "Membangun Ekosistem Digital yang Tangguh, Aman, dan Berkelanjutan.",
		tags: ["Keamanan digital", "Transformasi"],
		dateLabel: "Tanggal",
		date: "07 Maret 2026",
		deliveryLabel: "Delivery",
		delivery: "Online",
	},
	{
		category: "Webinar",
		subtitle: "Digital ecosystem",
		title: "Membangun Ekosistem Digital yang Tangguh, Aman, dan Berkelanjutan.",
		tags: ["Keamanan digital", "Transformasi"],
		dateLabel: "Tanggal",
		date: "07 Maret 2026",
		deliveryLabel: "Delivery",
		delivery: "Online",
	},
];



function EventListSection() {
	const [query, setQuery] = useState("");
	const [activeTab, setActiveTab] = useState("Semua");

	const filteredEvents = featuredEvents.filter((event) => {
		const matchesQuery = event.title.toLowerCase().includes(query.toLowerCase()) ||
			event.category.toLowerCase().includes(query.toLowerCase());
		const matchesTab = activeTab === "Semua" || event.category === activeTab;
		return matchesQuery && matchesTab;
	});

	return (
			<section className="bg-white py-8 text-[#111827] sm:py-12">
			<div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
				<div className="max-w-3xl space-y-2">
					<h2 className="text-2xl font-black tracking-tight sm:text-[2rem]">
						Daftar event yang akan datang
					</h2>
					<p className="mt-3 text-sm leading-6 text-[#6b7280] sm:text-base">
						Lorem Ipsum dolar sitmet, consecratum adipiscing elit, sed da sat eiusmod
					</p>
				</div>

				<div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
					<form onSubmit={(e) => e.preventDefault()} className="flex h-12 w-full items-center gap-3 rounded-full bg-[#faf1f2] px-4 text-[#6b7280] shadow-[0_1px_0_rgba(17,24,39,0.04)] md:max-w-[15rem]">
						<span className="text-lg leading-none">⌕</span>
						<input
							type="search"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder="Cari nama event"
							aria-label="Cari nama event"
							className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-[#9ca3af]"
						/>
					</form>

					<div className="flex flex-wrap items-center gap-2.5">
						{filterTabs.map((tab) => (
							<button
								key={tab}
								type="button"
								onClick={() => setActiveTab(tab)}
								className={
								tab === activeTab
										? "rounded-full bg-[#d32626] px-5 py-2.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(211,38,38,0.26)]"
										: "rounded-full bg-[#fff0f1] px-5 py-2.5 text-sm font-bold text-[#c72d28]"
								}
							>
								{tab}
							</button>
						))}
					</div>
				</div>

				<div className="mt-6 space-y-5">
					{filteredEvents.length > 0 ? (
						filteredEvents.map((event, index) => (
							<article
								key={`${event.title}-${index}`}
								className="relative overflow-hidden rounded-[14px] bg-[#d32626] text-white shadow-[0_10px_24px_rgba(211,38,38,0.22)]"
							>
								<div className="absolute inset-y-0 left-0 w-3 bg-white/10" />
								<div className="absolute left-28 top-0 h-28 w-28 rounded-full bg-white/10" />
								<div className="absolute bottom-[-1.5rem] left-1/2 h-20 w-20 -translate-x-1/2 rounded-full border-[10px] border-white/8" />
								<div className="absolute right-0 top-0 h-full w-20 bg-white/10" style={{ clipPath: "polygon(100% 0, 100% 100%, 0 0)" }} />

								<div className="relative grid min-h-[122px] grid-cols-1 gap-4 px-4 py-4 sm:min-h-[132px] sm:grid-cols-[1.1fr_2.3fr_1fr_0.9fr_auto] sm:items-center sm:px-5 sm:py-5">
									<div>
										<p className="text-lg font-bold leading-none sm:text-xl">{event.category}</p>
										<p className="mt-1 text-sm font-medium text-white/85">{event.subtitle}</p>
									</div>

									<div className="max-w-[28rem]">
										<p className="text-[0.95rem] font-medium leading-6 text-white/95 sm:text-base">
											{event.title}
										</p>
										<div className="mt-3 flex flex-wrap gap-2">
											{event.tags.map((tag) => (
												<span key={tag} className="rounded-full bg-white px-3.5 py-1.5 text-sm font-semibold text-[#222222] shadow-[0_2px_0_rgba(0,0,0,0.06)]">
													{tag}
												</span>
											))}
										</div>
									</div>

									<div className="sm:text-center">
										<p className="text-sm font-semibold text-white/90">{event.dateLabel}</p>
										<p className="mt-1 text-2xl font-black tracking-tight sm:text-[1.55rem]">{event.date}</p>
									</div>

									<div className="sm:text-left">
										<p className="text-sm font-semibold text-white/90">{event.deliveryLabel}</p>
										<div className="mt-2 inline-flex rounded-full bg-white px-3.5 py-1.5 text-sm font-bold text-[#d32626]">
											{event.delivery}
										</div>
									</div>

									<div className="flex justify-end">
										<button
											type="button"
											className="grid h-10 w-10 place-items-center rounded-full bg-white text-[#d32626] shadow-[0_6px_14px_rgba(0,0,0,0.12)] transition hover:scale-105"
											aria-label="Lihat detail event"
										>
											<span className="text-lg leading-none">↗</span>
										</button>
									</div>
								</div>
							</article>
						))
					) : (
						<div className="text-center py-8">
							<p className="text-[#6b7280]">Tidak ada event yang sesuai dengan pencarian Anda.</p>
						</div>
					)}

					<div className="mt-6 flex flex-col gap-5 text-sm text-[#6b7280] sm:flex-row sm:items-center sm:justify-between">
						<p>Menampilkan {filteredEvents.length} event pilihan dari arsip terbaru.</p>
						<div className="flex items-center justify-center gap-2 sm:justify-end">
							<button className="grid h-10 w-10 place-items-center rounded-full bg-[#fff0f1] text-[#1f2937] transition hover:bg-[#f8e0e2]" type="button" aria-label="Halaman sebelumnya">
								←
							</button>
							<button className="grid h-10 w-10 place-items-center rounded-full bg-[#d32626] text-white font-bold" type="button">
								1
							</button>
							<button className="grid h-10 w-10 place-items-center rounded-full bg-[#fff0f1] text-[#1f2937] font-bold" type="button">
								2
							</button>
							<button className="grid h-10 w-10 place-items-center rounded-full bg-[#fff0f1] text-[#1f2937] transition hover:bg-[#f8e0e2]" type="button" aria-label="Halaman berikutnya">
								→
							</button>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

export default function UpcomingEvents() {
	return (
		<main className="min-h-screen bg-[#d32626] text-white">
			<Navbar />
			<section className="relative overflow-hidden bg-[#d32626] text-white">
			

			<div className="relative mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:gap-20 lg:px-8 lg:py-12">
				<div className="flex-1">
					<div className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-bold text-[#c72d28] shadow-[0_6px_0_rgba(0,0,0,0.08)]">
						<span className="text-base leading-none">✦</span>
						Arsip pembelajaran .id Academy
					</div>

					<div className="mt-7 flex flex-col gap-8 sm:flex-row sm:items-center sm:gap-10 lg:gap-12">
						<div className="shrink-0">
							<img src="/img/assets/clock_icon.svg" alt="Illustrasi Upcoming Events" className="h-auto w-[180px] sm:w-[220px] lg:w-[200px]" />
                           
						</div>

						<div className="max-w-2xl">
							<h1 className="text-4xl font-black leading-[0.95] tracking-tight sm:text-5xl lg:text-[4rem]">
								Upcoming Events
							</h1>
							<p className="mt-5 max-w-xl text-lg leading-8 text-white/95 sm:text-xl">
								Jelajahi rekam jejak webinar, workshop, dan sesi pelatihan yang telah diselenggarakan.
							</p>
						</div>
					</div>
				</div>

				<div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2 lg:max-w-[31rem] lg:grid-cols-2 lg:gap-4">
					{stats.map((stat) => (
						<article
							key={stat.label}
							className="rounded-[14px] bg-white px-5 py-5 text-[#1f2937] shadow-[0_10px_20px_rgba(0,0,0,0.16)] ring-1 ring-black/5 space-y-2"
						>
							<p className="text-sm text-[#8a8f98]">{stat.label}</p>
							<p className="text-[1.85rem] font-black leading-none tracking-tight text-[#1f2937]">
								{stat.value}
							</p>
							<p className="text-sm font-semibold text-[#c4372d]">{stat.caption}</p>
						</article>
					))}
				</div>
			</div>

			<EventListSection />
			</section>
		</main>
	);
}
