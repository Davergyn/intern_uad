import React from "react";
import "../style/style.css";

const testimonials = [
  {
    quote: "Sertifikat dari .id Academy sangat membantu pekerjaan di bidang IT",
    name: "Siti Aisyah",
    role: "Peserta seminar",
    avatar: "SA",
    tone: "tone-a",
  },
  {
    quote: "Sertifikat dari .id Academy sangat membantu pekerjaan di bidang IT",
    name: "Putri Maharani",
    role: "Peserta seminar",
    avatar: "PM",
    tone: "tone-b",
  },
  {
    quote: "Sertifikat dari .id Academy sangat membantu pekerjaan di bidang IT",
    name: "Nadia Shafira",
    role: "Peserta seminar",
    avatar: "NS",
    tone: "tone-c",
  },
];

export default function WhatTheySay() {
  return (
    <section className="testimonials-section">
      <div className="testimonials-container">
        <h2>Apa Kata Mereka?</h2>
        <p>Mereka yang telah bergabung, kini merasakan manfaat</p>

        <div className="testimonials-grid">
          {testimonials.map((item, index) => (
            <article className="testimonial-card" key={index}>
              <span className="testimonial-quote-icon" aria-hidden="true">
                <img src="/img/icon/kutip2_icon.svg" alt="kutip" />
              </span>

              <p className="testimonial-text">{item.quote}</p>

              <div className="testimonial-divider" />

              <div className="testimonial-user">
                <div className={`testimonial-avatar ${item.tone}`}>{item.avatar}</div>
                <div>
                  <h3>{item.name}</h3>
                  <p>{item.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="testimonials-dots" aria-label="testimonials pagination">
          <span className="testimonials-dot active" />
          <span className="testimonials-dot" />
          <span className="testimonials-dot" />
        </div>
      </div>
    </section>
  );
}