"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import '../style/style.css';

const events = [
  {
    date: { day: '07', month: 'Mei', year: '2025' },
    type: 'Workshop',
    time: '11.00-15.00 | Offline',
    title: 'Keamanan Siber Untuk Pemula',
    description: 'Tingkatkan kesadaran dan keterampilan dasar keamanan digital untuk keamanan data anda.',
    participants: '1200 Peserta',
    price: 'Gratis',
    image: '/img/assets/img_for_upcomingE.png',
  },
  {
    date: { day: '07', month: 'Mei', year: '2025' },
    type: 'Workshop',
    time: '11.00-15.00 | Offline',
    title: 'Keamanan Siber Untuk Pemula',
    description: 'Tingkatkan kesadaran dan keterampilan dasar keamanan digital untuk keamanan data anda.',
    participants: '1200 Peserta',
    price: 'Gratis',
    image: '/img/assets/img_for_upcomingE.png',
  },
  {
    date: { day: '07', month: 'Mei', year: '2025' },
    type: 'Workshop',
    time: '11.00-15.00 | Offline',
    title: 'Keamanan Siber Untuk Pemula',
    description: 'Tingkatkan kesadaran dan keterampilan dasar keamanan digital untuk keamanan data anda.',
    participants: '1200 Peserta',
    price: 'Gratis',
    image: '/img/assets/img_for_upcomingE.png',
  },
  {
    date: { day: '08', month: 'Jun', year: '2025' },
    type: 'Webinar',
    time: '10.00-12.00 | Online',
    title: 'Digital Marketing 101',
    description: 'Pelajari dasar-dasar pemasaran digital untuk meningkatkan jangkauan bisnis Anda.',
    participants: '800 Peserta',
    price: 'Gratis',
    image: '/img/assets/img_for_upcomingE.png',
  },
  {
    date: { day: '15', month: 'Jul', year: '2025' },
    type: 'Kuliah Umum',
    time: '13.00-15.00 | Offline',
    title: 'Transformasi Digital di Indonesia',
    description: 'Wawasan tentang bagaimana transformasi digital membentuk masa depan Indonesia.',
    participants: '1500 Peserta',
    price: 'Gratis',
    image: '/img/assets/img_for_upcomingE.png',
  },
  {
    date: { day: '20', month: 'Agu', year: '2025' },
    type: 'Workshop',
    time: '09.00-16.00 | Offline',
    title: 'Pengembangan Web Modern',
    description: 'Pelatihan intensif tentang teknologi pengembangan web terbaru.',
    participants: '500 Peserta',
    price: 'Gratis',
    image: '/img/assets/img_for_upcomingE.png',
  },
];

const CARDS_PER_PAGE = 2;

const UpcomingEvents = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalPages = Math.ceil(events.length / CARDS_PER_PAGE);
// ...
<div className="carousel-dots">
  {Array.from({ length: totalPages }).map((_, index) => (
    <span
      key={index}
      className={`dot ${currentPage === index ? 'active' : ''}`}
      onClick={() => scrollToPage(index)}
    ></span>
  ))}
</div>

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      // Calculate the total scrollable width
      const totalScrollableWidth = scrollWidth - clientWidth;
      // Calculate the current page based on the scroll position
      const newPage = Math.round((scrollLeft / totalScrollableWidth) * (totalPages - 1));
      
      if (newPage !== currentPage) {
        setCurrentPage(newPage);
      }
    }
  };

  const scrollToPage = (page: number) => {
  if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      containerRef.current.scrollTo({
          left: containerWidth * page,
          behavior: 'smooth',
      });
      setCurrentPage(page);
  }
};
  

  return (
    <section className="upcoming-events-section">
      <div className="upcoming-events-header">
        <div>
          <h2>Upcoming <span className="highlight">Events</span></h2>
          <p>Jangan Lewatkan kesempatan untuk datang pada event yang akan mendatang</p>
        </div>
        <a href="#" className="see-more-link">Lihat Selengkapnya &rarr;</a>
      </div>
      <div className="carousel-wrapper">
        <div className="events-container" ref={containerRef} onScroll={handleScroll}>
          {events.map((event, index) => (
            <div key={index} className="event-card">
              <div className="event-image-container">
                  <Image src={event.image} alt={event.title} width={400} height={200} className="event-image" />
              </div>
              <div className="event-content">
                <div className="event-details-top">
                  <div className="event-date">
                    <div className="day">{event.date.day}</div>
                    <div className="month-year">{event.date.month} {event.date.year}</div>
                  </div>
                  <div className="event-info">
                    <p className="event-type">{event.type}</p>
                    <p className="event-time">{event.time}</p>
                    <h3 className="event-title">{event.title}</h3>
                  </div>
                </div>
                <p className="event-description">{event.description}</p>
                <div className="event-footer">
                  <div className="event-meta">
                    <span><i className="icon-users"></i> {event.participants}</span>
                    <span><i className="icon-ticket"></i> {event.price}</span>
                  </div>
                  <a href="#" className="register-button">Daftar Sekarang &rarr;</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
       <div className="carousel-dots">
        {/* Always render 2 dots */}
        {[0, 1, 2].map((index) => (
          <span
            key={index}
            className={`dot ${currentPage === index ? 'active' : ''}`}
            onClick={() => scrollToPage(index)}
          ></span>
        ))}
      </div>
    </section>
  );
};

export default UpcomingEvents;