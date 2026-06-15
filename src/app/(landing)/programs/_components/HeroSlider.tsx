"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function HeroSlider({ images }: { images: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide setiap 4 detik
  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, [images.length]);

  if (!images || images.length === 0) {
    return (
      <div className="flex aspect-[4/3] lg:aspect-square w-full items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50">
        <span className="text-sm font-medium text-gray-400">
          Gambar belum tersedia
        </span>
      </div>
    );
  }

  // Jika hanya 1 gambar, tampilkan statis tanpa panah/slide
  if (images.length === 1) {
    return (
      <img
        src={images[0]}
        alt="Program Hero"
        className="aspect-[4/3] w-full rounded-3xl object-cover shadow-2xl shadow-black/5 lg:aspect-square"
      />
    );
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="group relative w-full aspect-[4/3] lg:aspect-square overflow-hidden rounded-3xl shadow-2xl shadow-black/5">
      {/* Kontainer Gambar */}
      <div
        className="flex h-full w-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt={`Slide ${idx + 1}`}
            className="h-full w-full shrink-0 object-cover"
          />
        ))}
      </div>

      {/* Tombol Kiri */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-full bg-white/70 p-2 text-gray-800 opacity-0 backdrop-blur-sm transition-all hover:bg-white group-hover:opacity-100 active:scale-90"
        aria-label="Previous image"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      {/* Tombol Kanan */}
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-full bg-white/70 p-2 text-gray-800 opacity-0 backdrop-blur-sm transition-all hover:bg-white group-hover:opacity-100 active:scale-90"
        aria-label="Next image"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Indikator Titik (Dots) */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentIndex === idx ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}