"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { DeliveryMode, EventRow, EventType } from "@/types/database";
import { Bookmark, X } from "lucide-react";
import { useAuth } from "@/lib/authContext";

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

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white px-6 py-14 text-center text-sm text-gray-500 shadow-[0_2px_15px_rgba(0,0,0,0.03)]">
      {message}
    </div>
  );
}

function LoginRequiredModal({
  isOpen,
  onClose,
  onLogin,
  onRegister,
}: {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
  onRegister: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1 text-gray-400 hover:text-gray-600 transition"
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-[#CB2229]/10 p-3">
              <Bookmark size={28} className="text-[#CB2229]" />
            </div>
          </div>

          <h2 className="mb-2 text-2xl font-bold text-slate-900">
            Masuk untuk Melanjutkan
          </h2>
          <p className="mb-8 text-slate-600">
            Anda harus login terlebih dahulu untuk menyimpan event. Silakan
            masuk dengan akun Anda atau daftar jika belum memiliki akun.
          </p>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={onLogin}
              className="w-full rounded-xl bg-[#CB2229] px-4 py-3 font-semibold text-white transition hover:bg-red-700"
            >
              Masuk
            </button>
            <button
              onClick={onRegister}
              className="w-full rounded-xl border-2 border-[#CB2229] px-4 py-3 font-semibold text-[#CB2229] transition hover:bg-[#CB2229]/5"
            >
              Daftar Akun Baru
            </button>
          </div>
        </div>
      </div>
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
  const router = useRouter();
  const { userEmail } = useAuth();
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoadingSavedEvents, setIsLoadingSavedEvents] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch saved event IDs from API
  useEffect(() => {
    if (isMounted && userEmail) {
      const fetchSavedEvents = async () => {
        try {
          setIsLoadingSavedEvents(true);
          const response = await fetch(
            `/api/user/saved-events?email=${encodeURIComponent(userEmail)}`,
          );
          if (response.ok) {
            const result = await response.json();
            if (result.data) {
              const ids = result.data.map((item: { eventId: number }) => item.eventId);
              setSavedIds(ids);
            }
          }
        } catch (error) {
          console.error("Failed to fetch saved events:", error);
        } finally {
          setIsLoadingSavedEvents(false);
        }
      };
      void fetchSavedEvents();
    }
  }, [isMounted, userEmail]);

  if (events.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  const statusLabel = status === "done" ? "Done" : "On going";
  const statusClass =
    status === "done"
      ? "bg-emerald-50 text-emerald-600"
      : "bg-yellow-50 text-yellow-600";

  const handleToggleSave = async (id: number) => {
    if (!userEmail) {
      setShowLoginModal(true);
      return;
    }

    try {
      if (savedIds.includes(id)) {
        // Remove from saved
        const response = await fetch("/api/user/saved-events", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: userEmail, eventId: id }),
        });

        if (response.ok) {
          setSavedIds(savedIds.filter((savedId) => savedId !== id));
        } else {
          console.error("Failed to remove saved event");
        }
      } else {
        // Add to saved
        const response = await fetch("/api/user/saved-events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: userEmail, eventId: id }),
        });

        if (response.ok) {
          setSavedIds([...savedIds, id]);
        } else {
          const error = await response.json();
          console.error("Failed to save event:", error.error);
        }
      }
    } catch (error) {
      console.error("Error toggling save:", error);
    }
  };

  const handleLoginClick = () => {
    setShowLoginModal(false);
    router.push("/login");
  };

  const handleRegisterClick = () => {
    setShowLoginModal(false);
    router.push("/registrasi");
  };

  return (
    <>
      <LoginRequiredModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLoginClick}
        onRegister={handleRegisterClick}
      />
      <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-[0_2px_15px_rgba(0,0,0,0.03)]">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr>
              {[
                "Event Type",
                "Name",
                "Date",
                "Delivery",
                "Status",
                "Simpan",
              ].map((column) => (
                <th
                  key={column}
                  className={`whitespace-nowrap border-b-2 border-gray-100 px-6 py-5 text-[0.9rem] font-semibold text-gray-400 ${column === "Simpan" ? "text-center" : ""
                    }`}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {events.map((event) => {
              const isSaved = savedIds.includes(event.id);
              return (
                <tr
                  key={event.id}
                  className="border-b border-gray-100 transition-colors last:border-b-0 hover:bg-[#f9fafb]"
                >
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${TYPE_BADGE[event.eventType]
                        }`}
                    >
                      {TYPE_LABEL[event.eventType]}
                    </span>
                  </td>
                  <td className="max-w-[420px] px-6 py-4 text-[0.95rem] font-semibold leading-7 text-[#1f2937]">
                    {event.title}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-[0.95rem] text-[#6b7280]">
                    {formatDate(event.eventDate)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${DELIVERY_BADGE[event.deliveryMode]
                        }`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {DELIVERY_LABEL[event.deliveryMode]}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${statusClass}`}
                    >
                      {statusLabel}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-center">
                    <button
                      onClick={() => handleToggleSave(event.id)}
                      className="inline-flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-[#CB2229] hover:bg-red-50/50 transition duration-150"
                      title={isSaved ? "Hapus dari Tersimpan" : "Simpan Event"}
                    >
                      <Bookmark
                        size={18}
                        className={
                          isSaved
                            ? "text-[#CB2229] fill-[#CB2229]"
                            : "text-slate-400"
                        }
                      />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
