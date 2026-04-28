"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';

type PastEvent = {
  category: string;
  dateInfo: string;
  title: string;
  participants: string;
  status: string;
  image: string;
};

const pastEvents: PastEvent[] = [
  {
    category: "Webinar",
    dateInfo: "10 Mei 2025 | Online",
    title: "Strategi Branding Digital untuk UMKM",
    participants: "1000 Peserta",
    status: "selesai",
    image: "/img/assets/img_for_upcomingE.png",
  },
  {
    category: "Webinar",
    dateInfo: "10 Mei 2025 | Online",
    title: "Strategi Branding Digital untuk UMKM",
    participants: "1000 Peserta",
    status: "selesai",
    image: "/img/assets/img_for_upcomingE.png",
  },
  {
    category: "Webinar",
    dateInfo: "10 Mei 2025 | Online",
    title: "Strategi Branding Digital untuk UMKM",
    participants: "1000 Peserta",
    status: "selesai",
    image: "/img/assets/img_for_upcomingE.png",
  },
  {
    category: "Workshop",
    dateInfo: "24 Apr 2025 | Offline",
    title: "Pengenalan Keamanan Siber Dasar",
    participants: "850 Peserta",
    status: "selesai",
    image: "/img/assets/img_for_upcomingE.png",
  },
  {
    category: "Kuliah Umum",
    dateInfo: "12 Mar 2025 | Offline",
    title: "Transformasi Digital di Indonesia",
    participants: "1250 Peserta",
    status: "selesai",
    image: "/img/assets/img_for_upcomingE.png",
  },
  {
    category: "Webinar",
    dateInfo: "05 Feb 2025 | Online",
    title: "Membangun Personal Branding Profesional",
    participants: "940 Peserta",
    status: "selesai",
    image: "/img/assets/img_for_upcomingE.png",
  },
];

const CARDS_PER_PAGE = 3;

export default function PastEvents() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeDot, setActiveDot] = useState(0);

  const totalPages = Math.ceil(pastEvents.length / CARDS_PER_PAGE);

  const handleScroll = () => {
    if (!containerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll <= 0) return;

    const page = Math.round((scrollLeft / maxScroll) * (totalPages - 1));
    setActiveDot(page);
  };

  const goToPage = (page: number) => {
    if (!containerRef.current) return;

    const { scrollWidth, clientWidth } = containerRef.current;
    const maxScroll = scrollWidth - clientWidth;
    const target = totalPages > 1 ? (page / (totalPages - 1)) * maxScroll : 0;

    containerRef.current.scrollTo({ left: target, behavior: "smooth" });
    setActiveDot(page);
  };

  return (
    <section className="past-events-section">
      <div className="past-events-header">
        <div>
          <h2>
            Past <span>Events</span>
          </h2>
          <p>Jangan Lewatkan kesempatan untuk datang pada event yang telah berlangsung</p>
        </div>
        <a href="#" className="past-see-more-link">
          Lihat Selengkapnya <span aria-hidden="true">→</span>
        </a>
      </div>

      <div className="past-carousel-wrapper">
        <div className="past-events-container" ref={containerRef} onScroll={handleScroll}>
          {pastEvents.map((event, index) => (
            <article className="past-event-card" key={index}>
              <div className="past-event-image-wrap">
                <Image
                  src={event.image}
                  alt={event.title}
                  width={220}
                  height={120}
                  className="past-event-image"
                />
              </div>

              <div className="past-event-content">
                <p className="past-event-category">{event.category}</p>
                <p className="past-event-date">{event.dateInfo}</p>
                <h3 className="past-event-title">{event.title}</h3>

                <div className="past-event-footer">
                  <span className="past-event-participants">
                    <span className="past-users-icon" aria-hidden="true"><img src="/img/icon/icon_people.svg" alt="" /></span>
                    {event.participants}
                  </span>
                  <span className="past-event-status">{event.status}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="past-carousel-dots" aria-label="Past events pagination">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            type="button"
            className={i === activeDot ? "past-dot active" : "past-dot"}
            onClick={() => goToPage(i)}
            aria-label={"Go to page " + (i + 1)}
          />
        ))}
      </div>
    </section>
  );
}