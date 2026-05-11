import type { DeliveryMode, EventRow, EventType } from "@/types/database";

const TYPE_LABEL: Record<EventType, string> = {
  webinar: "Webinar",
  workshop: "Workshop",
  seminar: "Seminar",
  training: "Training",
};

const DELIVERY_LABEL: Record<DeliveryMode, string> = {
  online: "Online",
  face_to_face: "Face to Face",
  hybrid: "Hybrid",
};

const TYPE_BADGE: Record<EventType, string> = {
  webinar: "bg-blue-50 text-blue-600",
  workshop: "bg-amber-50 text-amber-600",
  seminar: "bg-purple-50 text-purple-600",
  training: "bg-green-50 text-green-600",
};

const DELIVERY_BADGE: Record<DeliveryMode, string> = {
  online: "bg-sky-50 text-sky-600",
  face_to_face: "bg-rose-50 text-rose-600",
  hybrid: "bg-indigo-50 text-indigo-600",
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white px-6 py-14 text-center text-sm text-gray-500 shadow-[0_2px_15px_rgba(0,0,0,0.03)]">
      {message}
    </div>
  );
}

export function EventTable({
  events,
  emptyMessage,
  status,
}: {
  events: EventRow[];
  emptyMessage: string;
  status: "ongoing" | "done";
}) {
  if (events.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  const statusLabel = status === "done" ? "Done" : "On going";
  const statusClass = status === "done" ? "bg-emerald-50 text-emerald-600" : "bg-yellow-50 text-yellow-600";

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-[0_2px_15px_rgba(0,0,0,0.03)]">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr>
            {["Event Type", "Name", "Date", "Delivery", "Status"].map((column) => (
              <th
                key={column}
                className="whitespace-nowrap border-b-2 border-gray-100 px-6 py-5 text-[0.9rem] font-semibold text-gray-400"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id} className="border-b border-gray-100 transition-colors last:border-b-0 hover:bg-[#f9fafb]">
              <td className="whitespace-nowrap px-6 py-4">
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${TYPE_BADGE[event.type]}`}>
                  {TYPE_LABEL[event.type]}
                </span>
              </td>
              <td className="max-w-[420px] px-6 py-4 text-[0.95rem] font-semibold leading-7 text-[#1f2937]">
                {event.title}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-[0.95rem] text-[#6b7280]">
                {formatDate(event.event_date)}
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${DELIVERY_BADGE[event.delivery]}`}>
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {DELIVERY_LABEL[event.delivery]}
                </span>
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${statusClass}`}>
                  {statusLabel}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
