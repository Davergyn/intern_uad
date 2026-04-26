import React from "react";
// Impor setiap halaman sebagai komponen
import Alt1 from "./alt-1/page";
import Alt2 from "./alt-2/page";
import Alt3 from "./alt-3/page";

export default function Home() {
  return (
    <main className="p-8 font-sans">
      <div className="flex gap-4 mb-10">
        <a href="/alt-1" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
          Ke Halaman Design 1
        </a>
        <a href="/alt-2" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">
          Ke Halaman Design 2
        </a>
        <a href="/alt-3" className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">
          Ke Halaman Design 3
        </a>
      </div>
    </main>
  );
}