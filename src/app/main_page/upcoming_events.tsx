import Link from "next/link";
import { getPublishedEvents } from "@/lib/supabase-content";
import UpcomingEventsCarousel from "./upcoming_events_carousel";

export default async function UpcomingEvents() {
  const events = await getPublishedEvents(12);

  return (
    <section className="upcoming-events-section">
      <div className="upcoming-events-header">
        <div>
          <h2>
            Upcoming <span className="highlight">Events</span>
          </h2>
          <p>Jangan lewatkan kesempatan untuk datang pada event yang akan mendatang</p>
        </div>
        <Link href="/events/up-events" className="see-more-link">
          Lihat Selengkapnya &rarr;
        </Link>
      </div>
      <UpcomingEventsCarousel events={events} />
    </section>
  );
}
