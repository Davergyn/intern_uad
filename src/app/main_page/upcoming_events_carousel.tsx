"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import type { EventRow } from "@/types/database";

const CARDS_PER_PAGE = 3;
const TYPE_LABEL = {
  webinar: "Webinar",
  workshop: "Workshop",
  seminar: "Seminar",
  training: "Training",
} as const;
const DELIVERY_LABEL = {
  online: "Online",
  face_to_face: "Face to Face",
  hybrid: "Hybrid",
} as const;

function formatEventDate(date: string) {
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return { day: "--", month: "---", year: "----" };
  }

  return {
    day: parsed.toLocaleDateString("id-ID", { day: "2-digit" }),
    month: parsed.toLocaleDateString("id-ID", { month: "short" }),
    year: parsed.toLocaleDateString("id-ID", { year: "numeric" }),
  };
}

function formatTimeRange(start: string | null, end: string | null, delivery: EventRow["delivery"]) {
  const normalize = (time: string | null) => (time ? time.slice(0, 5).replace(":", ".") : null);
  const startText = normalize(start);
  const endText = normalize(end);
  const range = startText && endText ? `${startText}-${endText}` : startText ?? "Waktu menyusul";
  return `${range} | ${DELIVERY_LABEL[delivery]}`;
}

function formatPrice(price: number | null) {
  if (!price) return "Gratis";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function UpcomingEventsCarousel({ events }: { events: EventRow[] }) {
  const [currentPage, setCurrentPage] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const totalPages = Math.max(1, Math.ceil(events.length / CARDS_PER_PAGE));

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    const totalScrollableWidth = scrollWidth - clientWidth;
    if (totalScrollableWidth <= 0) return;
    const ratio = scrollLeft / totalScrollableWidth;
    const newPage = Math.round(ratio * (totalPages - 1));
    setCurrentPage(Math.max(0, Math.min(newPage, totalPages - 1)));
  };

  const scrollToPage = (page: number) => {
    if (!containerRef.current) return;
    const { scrollWidth, clientWidth } = containerRef.current;
    const totalScrollableWidth = scrollWidth - clientWidth;
    const target = totalPages > 1 ? (page / (totalPages - 1)) * totalScrollableWidth : 0;
    containerRef.current.scrollTo({ left: target, behavior: "smooth" });
    setCurrentPage(page);
  };

  if (events.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
        Belum ada event yang dipublikasikan.
      </div>
    );
  }

  return (
    <>
      <div className="carousel-wrapper">
        <div className="events-container" ref={containerRef} onScroll={handleScroll}>
          {events.map((event) => {
            const date = formatEventDate(event.event_date);
            return (
              <div key={event.id} className="event-card">
                <div className="event-image-container">
                  <img
                    src={event.thumbnail_url || "/img/assets/img_for_upcomingE.png"}
                    alt={event.title}
                    className="event-image"
                  />
                </div>
                <div className="event-content">
                  <div className="event-details-top">
                    <div className="event-date">
                      <div className="day">{date.day}</div>
                      <div className="month-year">
                        {date.month} {date.year}
                      </div>
                    </div>
                    <div className="event-info">
                      <div className="mb-1 flex flex-wrap gap-2">
                        <span className="rounded-full bg-[#CB2229]/10 px-2.5 py-1 text-[11px] font-bold text-[#CB2229]">
                          {TYPE_LABEL[event.type]}
                        </span>
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">
                          {DELIVERY_LABEL[event.delivery]}
                        </span>
                      </div>
                      <p className="event-time">{formatTimeRange(event.start_time, event.end_time, event.delivery)}</p>
                      <h3 className="event-title">{event.title}</h3>
                    </div>
                  </div>
                  <p className="event-description">{event.description || "Detail event akan segera diperbarui."}</p>
                  <div className="event-footer">
                    <div className="event-meta">
                      <span>{event.quota ?? 0} Kuota</span>
                      <span>{formatPrice(event.price)}</span>
                    </div>
                    <Link href="/auth/registrasi" className="register-button">
                      Daftar Sekarang &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="carousel-dots">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            aria-label={`Halaman event ${index + 1}`}
            className={`dot ${currentPage === index ? "active" : ""}`}
            onClick={() => scrollToPage(index)}
          />
        ))}
      </div>
    </>
  );
}
