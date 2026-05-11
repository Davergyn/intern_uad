import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import { EventTable } from "../_components/event-table";
import { getUpcomingEvents } from "@/lib/supabase-content";

export const dynamic = "force-dynamic";

export default async function UpcomingEventsPage() {
  const upcomingEvents = await getUpcomingEvents();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="mb-8 flex flex-col items-start gap-6 rounded-2xl bg-[#e5e7eb] p-6 sm:flex-row sm:p-10">
          <div className="mt-0.5 flex-shrink-0">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1f2937] sm:h-16 sm:w-16">
              <svg className="h-7 w-7 text-white sm:h-8 sm:w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 3" />
              </svg>
            </div>
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-[#111827] sm:text-2xl">Upcoming Events</h1>
            <p className="mt-2 text-[1rem] text-[#4b5563] sm:text-[1.05rem]">
              Historical record of upcoming training events.
            </p>
            <p className="text-[1rem] text-[#4b5563] sm:text-[1.05rem]">
              A range of upcoming events, online webinars, hands-on workshops, and insightful seminars.
            </p>
          </div>
        </div>

        <EventTable events={upcomingEvents} emptyMessage="Belum ada event yang dijadwalkan." status="ongoing" />
      </section>

      <div className="pb-16" />
      <Footer />
    </main>
  );
}
