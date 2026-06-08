"use client";

import React, { useRef } from "react";
import Link from "next/link";
import {
  formatShortDate,
  formatEventPrice,
} from "../_lib/formatters";
import type { EventRow } from "@/types/database";

type UpcomingCarouselProps = {
  upcomingEvents: EventRow[];
};

export default function UpcomingCarousel({ upcomingEvents }: UpcomingCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);

  function scroll(direction: "left" | "right") {
    if (!carouselRef.current) return;
    const amount = carouselRef.current.clientWidth / 1.5;
    carouselRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }

  // Sorting: urutkan berdasarkan eventDate dari yang paling dekat dengan hari ini
  const sortedEvents = [...upcomingEvents].sort(
    (a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime(),
  );

  return (
    <section
      id="upcoming-events"
      className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-[#111827]">
            Upcoming <span className="text-[#CB2229]">Events</span>
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Jangan lewatkan kesempatan untuk datang pada event yang akan
            mendorong karirmu.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/events/up-events"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-[#CB2229] px-5 py-2 text-sm font-semibold text-[#CB2229] transition hover:bg-red-50"
          >
            Lihat Selengkapnya →
          </Link>

          {upcomingEvents.length > 3 && (
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => scroll("left")}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:bg-gray-50 hover:text-[#CB2229]"
                aria-label="Geser ke Kiri"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
              <button
                onClick={() => scroll("right")}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:bg-gray-50 hover:text-[#CB2229]"
                aria-label="Geser ke Kanan"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      <div
        ref={carouselRef}
        className="mt-8 flex flex-nowrap w-full snap-x snap-mandatory gap-6 overflow-x-auto pb-4 pt-2 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {sortedEvents.length === 0 ? (
          <div className="w-full flex-none rounded-2xl border border-dashed py-12 text-center text-sm text-gray-400">
            Belum ada event terjadwal di masa depan.
          </div>
        ) : (
          sortedEvents.map((event) => {
            const { day, monthYear } = formatShortDate(event.eventDate);
            return (
              <div
                key={event.id}
                className="flex-none w-[85%] sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] snap-start flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="relative h-48 w-full bg-slate-100">
                  <img
                    src={
                      event.thumbnailUrl ||
                      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80"
                    }
                    alt={event.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute bottom-2 left-3 flex flex-col items-center rounded-xl bg-white px-3 py-1.5 shadow-md">
                    <span className="text-xl font-black leading-none text-[#CB2229]">
                      {day}
                    </span>
                    <span className="mt-0.5 text-[0.65rem] font-bold uppercase text-gray-500">
                      {monthYear}
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
                    <span className="rounded bg-red-50 px-2 py-0.5 uppercase tracking-wider text-[#CB2229]">
                      {event.eventType}
                    </span>
                    <span>•</span>
                    <span>{event.startTime?.slice(0, 5) || "08:00"} WIB</span>
                    <span>•</span>
                    <span className="capitalize">
                      {event.deliveryMode?.replace("_", " ")}
                    </span>
                  </div>

                  <h3 className="mt-3 line-clamp-2 text-base font-bold text-gray-800">
                    {event.title}
                  </h3>

                  <p className="mt-2 line-clamp-2 flex-1 text-xs leading-relaxed text-gray-500">
                    {event.description ||
                      "Bergabunglah dalam sesi interaktif ini untuk meningkatkan wawasan digital Anda bersama expert."}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-gray-50 pt-4">
                    <div>
                      <span className="block text-[0.65rem] font-bold uppercase text-gray-400">
                        Biaya / Kuota
                      </span>
                      <span className="text-xs font-bold text-gray-800">
                        {formatEventPrice(
                          event.price ? parseFloat(event.price) : null,
                        )}{" "}
                        <span className="font-normal text-gray-400">
                          ({event.quota || 0} seat)
                        </span>
                      </span>
                    </div>
                    <Link
                      href={`/events/${event.id}`}
                      className="rounded-lg bg-[#CB2229] px-4 py-2 text-xs font-bold text-white transition hover:bg-red-700"
                    >
                      Daftar Sekarang →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
