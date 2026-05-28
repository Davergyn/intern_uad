import Link from "next/link";
import { db } from "@/db";
import { events } from "@/db/schema";
import { gte, eq } from "drizzle-orm";
import UpcomingEventsCarousel from "./upcoming_events_carousel";
import type { EventRow } from "@/types/database";

export default async function UpcomingEvents() {
  // Ambil tanggal hari ini
  const today = new Date().toISOString().split("T")[0];

  // Fetch upcoming events dari database
  const allEvents: EventRow[] = await db
    .select()
    .from(events)
    .where(gte(events.eventDate, today))
    .orderBy(events.eventDate)
    .limit(10);

  // Filter hanya yang published untuk ditampilkan
  const publishedEvents = allEvents.filter((e) => e.isPublished);

  return (
    <section className="upcoming-events-section">
      <div className="upcoming-events-header">
        <div>
          <h2>
            Upcoming <span className="highlight">Events</span>
          </h2>
          <p>
            Jangan lewatkan kesempatan untuk datang pada event yang akan
            mendatang
          </p>
        </div>
        <Link href="/events/up-events" className="see-more-link">
          Lihat Selengkapnya &rarr;
        </Link>
      </div>
      <UpcomingEventsCarousel events={events} />
    </section>
  );
}
