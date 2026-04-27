import React from "react";
import Navbar from "./navbar";

const stats = [
	{ label: "Total arsip", value: "120+", note: "Event terdokumentasi" },
	{ label: "Format", value: "3", note: "Online, hybrid, offline" },
	{ label: "Topik teratas", value: "AI", note: "Paling banyak diminati" },
	{ label: "Update terakhir", value: "2026", note: "Arsip terbaru tersedia" },
];

export default function PassEventsPage() {
	return (
		<main className="min-h-screen bg-[#f7f8fa] text-[#111827]">
			<Navbar />

			<section className="relative overflow-hidden border-b border-[#e5e7eb] bg-gradient-to-r from-[#c91d27] via-[#da1f2b] to-[#ec1d2f]">
				<div className="pointer-events-none absolute -left-20 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full border-[24px] border-white/10" />
				<div className="pointer-events-none absolute right-[-80px] top-[-70px] h-52 w-52 rounded-full border-[30px] border-white/10" />
				<div className="pointer-events-none absolute bottom-[-120px] right-[-60px] h-64 w-64 rounded-full border-[42px] border-white/10" />

				<div className="relative mx-auto grid w-full max-w-6xl gap-7 px-4 py-10 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-10 lg:px-8 lg:py-14">
					<div className="text-white">
						<div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#b93030] shadow-sm">
							<span aria-hidden="true">*</span>
							Arsip pembelajaran .id Academy
						</div>

						<div className="mb-4 flex items-start gap-4">
							<div className="grid h-24 w-24 place-items-center">
								<img
									src="/img/assets/clock%20icon.svg"
									alt="Clock icon"
									className="h-20 w-20 object-contain"
								/>
							</div>

							<div>
								<h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
									Past Events
								</h1>
								<p className="mt-2 max-w-xl text-[1.08rem] font-medium leading-8 text-white/95 sm:text-[1.12rem]">
									Jelajahi rekam jejak webinar, workshop, dan sesi pelatihan yang telah diselenggarakan.
								</p>
							</div>
						</div>

						<p className="max-w-2xl text-base leading-8 text-white/90">
							Disusun agar pengunjung lebih mudah memindai topik, format acara, dan periode pelaksanaan tanpa terasa seperti tabel data yang kaku.
						</p>
					</div>

					<div className="grid grid-cols-2 gap-3">
						{stats.map((item) => (
							<article
								key={item.label}
								className="rounded-xl border border-black/5 bg-[#f5f5f5] p-3 shadow-md"
								style={{
									backgroundImage:
										"repeating-linear-gradient(90deg, rgba(216,40,47,0.1) 0px, rgba(216,40,47,0.1) 8px, rgba(245,245,245,0.85) 8px, rgba(245,245,245,0.85) 22px)",
								}}
							>
								<p className="text-[0.95rem] text-[#6b7280]">{item.label}</p>
								<p className="mt-1 text-[2.1rem] font-extrabold leading-none text-[#1f2937]">{item.value}</p>
								<p className="mt-2 text-sm font-semibold text-[#b63a3a]">{item.note}</p>
							</article>
						))}
					</div>
				</div>
			</section>
		</main>
	);
}
