import React from "react";

const navItems = ["About Us", "Events", "Programs", "Trainers", "Materi", "Contact Us"];

export default function Navbar() {
  return (
    <header className="border-b border-black/5 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
       
        {/* =========== logo ID ACADEMY =========== */}
        <div className="text-2xl font-extrabold tracking-tight">
          <span className="text-[#d6362f]">.id</span>{" "}
          <span className="text-[#10b981]">academy</span>
        </div>

        {/* =========== NAVBAR =========== */}
        <nav className="hidden items-center gap-7 text-sm font-medium text-[#1f2937] lg:flex">
  {navItems.map((item) =>
    item === "Events" || item === "Programs" ? (
      <details key={item} className="group relative">
        <summary className="flex cursor-pointer list-none items-center gap-1 transition hover:text-[#d6362f] [&::-webkit-details-marker]:hidden">
          {item}
          <span className="text-xs transition group-open:rotate-180">
            <img src="/img/arrow_down.png" alt="Arrow" className="h-3 w-3" />
          </span>
        </summary>
            {/* ========= navbar dropdown  =========  */}
        <div className="absolute left-0 top-8 z-20 min-w-max rounded-lg border border-black/10 bg-white p-2 shadow-lg">
          {item === "Events" ? (
            <>
            {/* ========= navbar dropdown "event" =========  */}
              <a href="#" className="block whitespace-nowrap rounded-md px-3 py-2 text-sm transition hover:bg-[#f3f4f6] hover:text-[#d6362f]">Upcoming Events</a>
              <a href="/alt-1?view=pass_events" className="block whitespace-nowrap rounded-md px-3 py-2 text-sm transition hover:bg-[#f3f4f6] hover:text-[#d6362f]">Pass Events</a>
            </>
          ) : (
            <>
            {/* ========= navbar dropdown "program" =========  */}
              <a href="#" className="block whitespace-nowrap rounded-md px-3 py-2 text-sm transition hover:bg-[#f3f4f6] hover:text-[#d6362f]">Program 1</a>
              <a href="#" className="block whitespace-nowrap rounded-md px-3 py-2 text-sm transition hover:bg-[#f3f4f6] hover:text-[#d6362f]">Program 2</a>
              <a href="#" className="block whitespace-nowrap rounded-md px-3 py-2 text-sm transition hover:bg-[#f3f4f6] hover:text-[#d6362f]">Program 3</a>
            </>
          )}
        </div>
      </details>
    ) : (
      <a key={item} href="#" className="transition hover:text-[#d6362f]">
        {item}
      </a>
    ),
  )}
</nav>
        

        <button className="rounded-md bg-[#cf2f2a] px-5 py-2.5 text-xs font-bold tracking-wide text-white transition hover:bg-[#b92924]">
          LOG IN
        </button>
      </div>
    </header>
  );
}