"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";

export type ProgramSliderImage = {
  id: number;
  imageUrl: string;
  title: string;
};

type ProgramImageSliderProps = {
  images: ProgramSliderImage[];
};

function PlaceholderImage({ label }: { label: string }) {
  return (
    <div className="flex aspect-[4/3] w-full items-center justify-center rounded-2xl border-2 border-dashed border-[#d1d5db] bg-[#f9fafb]">
      <div className="px-6 text-center">
        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[#CB2229]/10">
          <ImageIcon className="h-8 w-8 text-[#CB2229]/50" />
        </div>
        <p className="whitespace-pre-line text-xs font-medium leading-relaxed text-[#9ca3af]">{label}</p>
      </div>
    </div>
  );
}

export default function ProgramImageSlider({ images }: ProgramImageSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const hasSlider = images.length > 2;
  const visibleIndex = Math.min(activeIndex, Math.max(images.length - 1, 0));

  const goToPrevious = () => {
    setActiveIndex((current) => (current === 0 ? images.length - 1 : current - 1));
  };

  const goToNext = () => {
    setActiveIndex((current) => (current === images.length - 1 ? 0 : current + 1));
  };

  useEffect(() => {
    if (!hasSlider) return;

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current === images.length - 1 ? 0 : current + 1));
    }, 4500);
    return () => window.clearInterval(intervalId);
  }, [hasSlider, images.length]);

  if (images.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <PlaceholderImage label="Gambar 1 akan ditambahkan" />
        <PlaceholderImage label="Gambar 2 akan ditambahkan" />
      </div>
    );
  }

  if (!hasSlider) {
    return (
      <div className="flex flex-col gap-4">
        {images.map((image) => (
          <img key={image.id} src={image.imageUrl} alt={image.title} className="aspect-[4/3] w-full rounded-2xl object-cover" />
        ))}
        {images.length === 1 && <PlaceholderImage label="Gambar 2 akan ditambahkan" />}
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl">
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${visibleIndex * 100}%)` }}
      >
        {images.map((image) => (
          <div key={image.id} className="w-full flex-shrink-0">
            <img src={image.imageUrl} alt={image.title} className="aspect-[4/3] w-full object-cover" />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={goToPrevious}
        aria-label="Foto sebelumnya"
        className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#CB2229] shadow-lg ring-1 ring-black/5 transition hover:bg-[#CB2229] hover:text-white"
      >
        <ChevronLeft size={22} />
      </button>

      <button
        type="button"
        onClick={goToNext}
        aria-label="Foto berikutnya"
        className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#CB2229] shadow-lg ring-1 ring-black/5 transition hover:bg-[#CB2229] hover:text-white"
      >
        <ChevronRight size={22} />
      </button>

      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
        {images.map((image, index) => (
          <button
            key={image.id}
            type="button"
            aria-label={`Tampilkan foto ${index + 1}`}
            onClick={() => setActiveIndex(index)}
            className={`h-1.5 rounded-full transition-all ${visibleIndex === index ? "w-6 bg-[#CB2229]" : "w-1.5 bg-white/80"}`}
          />
        ))}
      </div>
    </div>
  );
}
