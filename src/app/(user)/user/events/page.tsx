"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/authContext";
// TODO: Import types from new database schema when ready
type EventType = "webinar" | "workshop" | "seminar" | "training";
type DeliveryMode = "online" | "face_to_face" | "hybrid";
type EventRow = {
  id: number;
  title: string;
  event_type: EventType;
  delivery_mode: DeliveryMode;
  event_date?: string | null;
  is_published: boolean;
};
import {
  Bookmark,
  Search,
  Calendar,
  MapPin,
  Clock,
  Trash2,
  ExternalLink,
  SlidersHorizontal,
} from "lucide-react";

const TYPE_LABEL: Record<EventType, string> = {
  webinar: "Webinar",
  workshop: "Workshop",
  seminar: "Seminar",
  training: "Training",
};

const DELIVERY_LABEL: Record<DeliveryMode, string> = {
  online: "Online",
  face_to_face: "Tatap Muka",
  hybrid: "Hybrid",
};

const TYPE_BADGE: Record<EventType, string> = {
  webinar: "bg-blue-50 text-blue-600 border border-blue-100",
  workshop: "bg-amber-50 text-amber-600 border border-amber-100",
  seminar: "bg-purple-50 text-purple-600 border border-purple-100",
  training: "bg-green-50 text-green-600 border border-green-100",
};

const DELIVERY_BADGE: Record<DeliveryMode, string> = {
  online: "bg-sky-50 text-sky-600",
  face_to_face: "bg-rose-50 text-rose-600",
  hybrid: "bg-indigo-50 text-indigo-600",
};

export default function SavedEventsPage() {
  const { userEmail } = useAuth();

  // State
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [allEvents, setAllEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");

  // Load Saved IDs from LocalStorage
  const loadSavedIds = () => {
    if (!userEmail) return [];
    const stored = localStorage.getItem(`saved_events_${userEmail}`);
    if (stored) {
      try {
        return JSON.parse(stored) as number[];
      } catch (e) {
        console.error("Error parsing saved events:", e);
      }
    }
    return [];
  };

  useEffect(() => {
    if (userEmail) {
      setSavedIds(loadSavedIds());
    }
  }, [userEmail]);

  // TODO: Implement with server route when ready
  useEffect(() => {
    const initializeEvents = () => {
      setLoading(false);
      setAllEvents([]); // Placeholder - awaiting server route
    };
    initializeEvents();
  }, []);

  const handleUnsave = (id: number) => {
    if (!userEmail) return;
    const currentSaved = loadSavedIds();
    const updated = currentSaved.filter((savedId) => savedId !== id);
    localStorage.setItem(`saved_events_${userEmail}`, JSON.stringify(updated));
    setSavedIds(updated);
  };

  // Filter & Search Logic
  const savedEvents = allEvents.filter((event) => savedIds.includes(event.id));

  const filteredEvents = savedEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.description &&
        event.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = selectedType === "all" || event.type === selectedType;

    return matchesSearch && matchesType;
  });

  function formatDate(dateString?: string | null) {
    if (!dateString) return "-";
    try {
      const cleanDate = dateString.split("T")[0];
      const date = new Date(`${cleanDate}T00:00:00`);
      if (isNaN(date.getTime())) return "-";
      return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(date);
    } catch (e) {
      return "-";
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-2.5">
            <Bookmark
              className="text-[#CB2229] shrink-0"
              fill="currentColor"
              size={28}
            />
            Event Tersimpan
          </h1>
          <p className="mt-1 text-slate-500">
            Daftar webinar, workshop, atau seminar yang telah Anda
            simpan/bookmark.
          </p>
        </div>
        <Link
          href="/events/up-events"
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Cari Event Baru
          <ExternalLink size={14} />
        </Link>
      </div>

      {/* Filter and Search Section */}
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Cari event berdasarkan judul atau deskripsi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-3.5 pl-11 pr-4 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#CB2229]"
          />
        </div>

        {/* Filter Type Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 hidden lg:inline">
            Tipe:
          </span>
          {["all", "webinar", "workshop", "seminar", "training"].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold capitalize transition-all ${
                selectedType === type
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {type === "all" ? "Semua" : TYPE_LABEL[type as EventType]}
            </button>
          ))}
        </div>
      </div>

      {/* Events Display */}
      {loading ? (
        <div className="flex min-h-[250px] items-center justify-center rounded-[2rem] border border-slate-200 bg-white p-8">
          <div className="flex flex-col items-center gap-3 text-slate-500">
            <div className="h-7 w-7 animate-spin rounded-full border-4 border-[#CB2229] border-t-transparent"></div>
            <p className="text-sm font-medium">Memuat event tersimpan...</p>
          </div>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="flex min-h-[350px] flex-col items-center justify-center rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-slate-50 text-slate-450 mb-4">
            <Calendar size={32} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">
            {searchQuery || selectedType !== "all"
              ? "Tidak ada event yang cocok"
              : "Belum ada event tersimpan"}
          </h3>
          <p className="mt-1.5 max-w-sm text-sm text-slate-500">
            {searchQuery || selectedType !== "all"
              ? "Coba ubah kata kunci pencarian atau filter tipe event Anda."
              : "Simpan event yang menarik minat Anda dari katalog untuk dibaca atau diikuti nanti."}
          </p>
          {!(searchQuery || selectedType !== "all") && (
            <Link
              href="/events/up-events"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#CB2229] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-red-500/20 transition hover:bg-red-700"
            >
              Jelajahi Event Sekarang
            </Link>
          )}
        </div>
      ) : (
        /* Event Grid */
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              {/* Event Badge Details */}
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <span
                    className={`rounded-xl px-2.5 py-1 text-xs font-bold ${TYPE_BADGE[event.type]}`}
                  >
                    {TYPE_LABEL[event.type]}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-xl px-2.5 py-1 text-xs font-bold ${DELIVERY_BADGE[event.delivery]}`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {DELIVERY_LABEL[event.delivery]}
                  </span>
                </div>

                {/* Event Title */}
                <div>
                  <h3 className="line-clamp-2 text-lg font-black text-slate-900 group-hover:text-[#CB2229] transition-colors leading-6">
                    {event.title}
                  </h3>
                  {event.description && (
                    <p className="mt-2 line-clamp-2 text-sm text-slate-500 leading-relaxed">
                      {event.description}
                    </p>
                  )}
                </div>

                {/* Date & Details */}
                <div className="space-y-2 rounded-2xl bg-slate-50 p-3 text-xs text-slate-600 font-medium">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-[#CB2229]" />
                    <span>{formatDate(event.event_date)}</span>
                  </div>
                  {event.start_time && (
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-[#CB2229]" />
                      <span>
                        {event.start_time.substring(0, 5)} -{" "}
                        {event.end_time?.substring(0, 5) ?? "Selesai"} WIB
                      </span>
                    </div>
                  )}
                  {event.quota !== null && (
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-[#CB2229]" />
                      <span>Sisa kuota: {event.quota} kursi</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 flex gap-3 border-t border-slate-100 pt-4">
                <button
                  onClick={() => handleUnsave(event.id)}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-rose-500 transition hover:bg-rose-50 hover:border-rose-100"
                  title="Hapus dari daftar tersimpan"
                >
                  <Trash2 size={16} />
                </button>
                <Link
                  href="/events/up-events"
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Daftar Sekarang
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
