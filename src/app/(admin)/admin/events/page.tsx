"use client";

import { FormEvent, useEffect, useMemo, useState, useRef } from "react";
import Image from "next/image";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  ImagePlus,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
  MapPin,
  Ticket
} from "lucide-react";
import type {
  DeliveryMode,
  EventFormValues,
  EventRow,
  EventType,
} from "@/types/database";

const TYPE_OPTIONS: EventType[] = [
  "webinar",
  "workshop",
  "seminar",
  "training",
];
const DELIVERY_OPTIONS: DeliveryMode[] = ["online", "face_to_face", "hybrid"];

const TYPE_COLOR: Record<EventType, string> = {
  webinar: "bg-blue-50 text-blue-600 border-blue-200",
  workshop: "bg-amber-50 text-amber-600 border-amber-200",
  seminar: "bg-purple-50 text-purple-600 border-purple-200",
  training: "bg-emerald-50 text-emerald-600 border-emerald-200",
};

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

const EVENT_GRADIENTS = [
  "from-blue-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-purple-500 to-fuchsia-600",
];

const EMPTY_FORM: EventFormValues = {
  title: "",
  description: "",
  eventType: "webinar",
  deliveryMode: "online",
  eventDate: "",
  startTime: "",
  endTime: "",
  quota: 0,
  price: "0",
  thumbnailUrl: "",
  isPublished: true,
};

const ACCEPTED_IMAGE_TYPES = "image/png, image/jpeg, image/webp, image/jpg";
const MAX_FILE_SIZE_MB = 5;

function formatDate(date: string) {
  if (!date) return "-";

  const parsedDate = /^\d{4}-\d{2}-\d{2}$/.test(date)
    ? new Date(`${date}T00:00:00`)
    : new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(parsedDate);
}

function formatPrice(price: string | null) {
  if (!price || price === "0") return "Gratis";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(parseFloat(price));
}

// Determine event status (Past / Upcoming) berdasarkan tanggal
function getEventStatus(eventDate: string | null | undefined): {
  status: "Past" | "Upcoming";
  bgColor: string;
  textColor: string;
  borderColor: string;
  icon: "check" | "clock";
} {
  if (!eventDate) {
    return {
      status: "Upcoming",
      bgColor: "bg-amber-50",
      textColor: "text-amber-600",
      borderColor: "border-amber-200/60",
      icon: "clock",
    };
  }

  try {
    // Get today's date dalam format YYYY-MM-DD
    const today = new Date().toISOString().split("T")[0];
    const eventDateOnly = String(eventDate).split("T")[0];

    if (eventDateOnly < today) {
      return {
        status: "Past",
        bgColor: "bg-slate-50",
        textColor: "text-slate-500",
        borderColor: "border-slate-200",
        icon: "check",
      };
    } else {
      return {
        status: "Upcoming",
        bgColor: "bg-amber-50",
        textColor: "text-amber-600",
        borderColor: "border-amber-200/60",
        icon: "clock",
      };
    }
  } catch {
    return {
      status: "Upcoming",
      bgColor: "bg-amber-50",
      textColor: "text-amber-600",
      borderColor: "border-amber-200/60",
      icon: "clock",
    };
  }
}

export default function ManageEventsPage() {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<EventRow | null>(null);
  const [form, setForm] = useState<EventFormValues>(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState<EventRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  
  // State untuk toggle Grid/Table
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // State untuk file upload & preview
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const keyword = search.toLowerCase();
    return events.filter(
      (event) =>
        event.title.toLowerCase().includes(keyword) ||
        TYPE_LABEL[event.eventType].toLowerCase().includes(keyword) ||
        DELIVERY_LABEL[event.deliveryMode].toLowerCase().includes(keyword),
    );
  }, [events, search]);

  const fetchEvents = async () => {
    setIsLoading(true);
    setError("");

    const response = await fetch("/api/admin/events", { cache: "no-store" });
    const result = (await response.json()) as {
      data?: EventRow[];
      error?: string;
    };

    if (!response.ok) {
      setError(result.error || "Gagal memuat event.");
      setEvents([]);
    } else {
      setEvents(result.data ?? []);
    }

    setIsLoading(false);
  };

  const insertEvent = async (values: EventFormValues, file: File | null) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description ?? "");
    formData.append("eventType", values.eventType);
    formData.append("deliveryMode", values.deliveryMode);
    formData.append("eventDate", values.eventDate);
    formData.append("startTime", values.startTime ?? "");
    formData.append("endTime", values.endTime ?? "");
    formData.append("quota", String(values.quota ?? 0));
    formData.append("price", values.price ?? "0");
    formData.append("isPublished", String(values.isPublished));

    if (file) {
      formData.append("thumbnail", file);
    }

    const response = await fetch("/api/admin/events", {
      method: "POST",
      body: formData,
    });
    const result = (await response.json()) as { error?: string };
    if (!response.ok) throw new Error(result.error || "Gagal menambah event.");
    await fetchEvents();
  };

  const updateEvent = async (
    id: number,
    values: EventFormValues,
    file: File | null,
  ) => {
    const formData = new FormData();
    formData.append("id", String(id));
    formData.append("title", values.title);
    formData.append("description", values.description ?? "");
    formData.append("eventType", values.eventType);
    formData.append("deliveryMode", values.deliveryMode);
    formData.append("eventDate", values.eventDate);
    formData.append("startTime", values.startTime ?? "");
    formData.append("endTime", values.endTime ?? "");
    formData.append("quota", String(values.quota ?? 0));
    formData.append("price", values.price ?? "0");
    formData.append("isPublished", String(values.isPublished));

    if (file) {
      formData.append("thumbnail", file);
    } else if (values.thumbnailUrl) {
      formData.append("existingThumbnailUrl", values.thumbnailUrl);
    }

    const response = await fetch("/api/admin/events", {
      method: "PUT",
      body: formData,
    });
    const result = (await response.json()) as { error?: string };
    if (!response.ok) throw new Error(result.error || "Gagal mengubah event.");
    await fetchEvents();
  };

  const deleteEvent = async (id: number) => {
    const response = await fetch(`/api/admin/events?id=${id}`, {
      method: "DELETE",
    });
    const result = (await response.json()) as { error?: string };
    if (!response.ok) throw new Error(result.error || "Gagal menghapus event.");
    await fetchEvents();
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchEvents();
  }, []);

  useEffect(() => {
    return () => {
      if (thumbnailPreview && thumbnailPreview.startsWith("blob:")) {
        URL.revokeObjectURL(thumbnailPreview);
      }
    };
  }, [thumbnailPreview]);

  const resetThumbnailState = () => {
    if (thumbnailPreview && thumbnailPreview.startsWith("blob:")) {
      URL.revokeObjectURL(thumbnailPreview);
    }
    setThumbnailFile(null);
    setThumbnailPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(
        `Ukuran file melebihi ${MAX_FILE_SIZE_MB}MB. Silakan pilih file yang lebih kecil.`,
      );
      e.target.value = "";
      return;
    }

    const allowedTypes = ["image/png", "image/jpeg", "image/webp", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      setError("Format file tidak didukung. Gunakan PNG, JPEG, atau WebP.");
      e.target.value = "";
      return;
    }

    setError("");

    if (thumbnailPreview && thumbnailPreview.startsWith("blob:")) {
      URL.revokeObjectURL(thumbnailPreview);
    }

    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const openCreate = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    resetThumbnailState();
    setModalOpen(true);
  };

  const openEdit = (row: EventRow) => {
    setEditTarget(row);
    setForm({
      title: row.title,
      description: row.description ?? "",
      eventType: row.eventType,
      deliveryMode: row.deliveryMode,
      eventDate: row.eventDate,
      startTime: row.startTime?.slice(0, 5) ?? "",
      endTime: row.endTime?.slice(0, 5) ?? "",
      quota: row.quota ?? 0,
      price: row.price ?? "0",
      thumbnailUrl: row.thumbnailUrl ?? "",
      isPublished: row.isPublished ?? true,
    });
    setThumbnailFile(null);
    setThumbnailPreview(row.thumbnailUrl ?? null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setModalOpen(true);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.title.trim() || !form.eventDate) return;

    setIsSaving(true);
    setError("");

    try {
      if (editTarget) {
        await updateEvent(editTarget.id, form, thumbnailFile);
      } else {
        await insertEvent(form, thumbnailFile);
      }
      setModalOpen(false);
      setEditTarget(null);
      setForm(EMPTY_FORM);
      resetThumbnailState();
    } catch (saveError) {
      setError(
        saveError instanceof Error ? saveError.message : "Gagal menyimpan event.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsSaving(true);
    setError("");

    try {
      await deleteEvent(deleteTarget.id);
      setDeleteTarget(null);
    } catch (deleteError) {
      setError(
        deleteError instanceof Error ? deleteError.message : "Gagal menghapus event.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari event..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm focus:border-[#CB2229] focus:outline-none focus:ring-2 focus:ring-[#CB2229]/30"
          />
        </div>
        <div className="flex items-center gap-2">
          {/* Toggle Grid/Table */}
          <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden">
            {(["grid", "table"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setViewMode(m)}
                className={`px-3 py-2 text-xs font-medium transition-colors ${viewMode === m ? "bg-slate-800 text-white" : "text-slate-500 hover:bg-slate-50"}`}
              >
                {m === "grid" ? "Grid" : "Tabel"}
              </button>
            ))}
          </div>
          <button
            onClick={openCreate}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#CB2229] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700"
          >
            <Plus size={16} /> Tambah Event
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* View Mode: GRID */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {isLoading ? (
            <div className="col-span-full py-16 flex items-center justify-center text-slate-400">
              <Loader2 size={20} className="animate-spin mr-2" />
              Memuat data event...
            </div>
          ) : filtered.length === 0 ? (
            <div className="col-span-full py-16 text-center text-slate-400 text-sm bg-white rounded-2xl border border-slate-100">
              {search
                ? "Tidak ada event yang cocok dengan pencarian."
                : 'Belum ada data event. Klik "+ Tambah Event" untuk menambahkan.'}
            </div>
          ) : (
            filtered.map((row) => {
              const eventStatus = getEventStatus(row.eventDate);
              
              return (
                <div
                  key={`event-${row.id}`}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all duration-200 group"
                >
                  {/* Thumbnail Area */}
                  <div
                    className={`h-40 relative flex items-center justify-center bg-linear-to-br ${EVENT_GRADIENTS[row.id % EVENT_GRADIENTS.length]}`}
                  >
                    {row.thumbnailUrl ? (
                      <Image
                        src={row.thumbnailUrl}
                        alt={row.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        unoptimized
                      />
                    ) : (
                      <CalendarDays size={40} className="text-white/40" />
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/20" />
                    
                    {/* Top Badges */}
                    <div className="absolute top-3 left-3">
                      <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border backdrop-blur-md shadow-sm ${TYPE_COLOR[row.eventType]}`}>
                        {TYPE_LABEL[row.eventType]}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className={`px-2 py-1 text-[10px] font-bold rounded-md backdrop-blur-md shadow-sm ${row.isPublished ? "bg-emerald-500 text-white" : "bg-slate-800 text-white"}`}>
                        {row.isPublished ? "Published" : "Draft"}
                      </span>
                    </div>

                    {/* Bottom Status Badge (Inside Image) */}
                    <div className="absolute bottom-3 left-3">
                       <span className={`flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg border shadow-sm ${eventStatus.bgColor} ${eventStatus.textColor} ${eventStatus.borderColor}`}>
                          {eventStatus.icon === "check" ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                          {eventStatus.status}
                       </span>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-bold text-slate-800 text-[15px] leading-snug line-clamp-2 mb-4 group-hover:text-[#CB2229] transition-colors">
                      {row.title}
                    </h3>
                    
                    <div className="space-y-2.5 mt-auto">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <CalendarDays size={14} className="text-slate-400 shrink-0" />
                        <span className="font-medium text-slate-600">{formatDate(row.eventDate)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Clock size={14} className="text-slate-400 shrink-0" />
                        <span>{row.startTime?.slice(0, 5) || "--:--"} - {row.endTime?.slice(0, 5) || "--:--"} WIB</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <MapPin size={14} className="text-slate-400 shrink-0" />
                        <span>{DELIVERY_LABEL[row.deliveryMode]} • {row.quota ? `${row.quota} Kuota` : 'Tanpa Batas'}</span>
                      </div>
                      
                      <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-[#CB2229] font-bold text-sm">
                          <Ticket size={16} />
                          {formatPrice(row.price)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50/50">
                    <button
                      onClick={() => openEdit(row)}
                      aria-label={`Edit ${row.title}`}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      <Pencil size={13} /> Edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget(row)}
                      aria-label={`Hapus ${row.title}`}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Trash2 size={13} /> Hapus
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* View Mode: TABLE */}
      {viewMode === "table" && (
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div>
              <h2 className="font-bold text-slate-800">Daftar Events</h2>
              <p className="text-xs text-slate-400">
                Data tersinkron langsung dengan tabel public.events.
              </p>
            </div>
            <span className="text-xs text-slate-400">{filtered.length} data</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-6 py-3">Event</th>
                  <th className="px-6 py-3">Tipe</th>
                  <th className="px-6 py-3">Tanggal</th>
                  <th className="px-6 py-3">Kuota</th>
                  <th className="px-6 py-3">Harga</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Masa</th>
                  <th className="px-6 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-12 text-center text-sm text-slate-400"
                    >
                      <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" />
                      Memuat data event...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-12 text-center text-sm text-slate-400"
                    >
                      Tidak ada data event ditemukan.
                    </td>
                  </tr>
                ) : (
                  filtered.map((row) => (
                    <tr
                      key={row.id}
                      className="transition-colors hover:bg-slate-50"
                    >
                      <td className="max-w-sm px-6 py-4">
                        <p className="truncate text-sm font-semibold text-slate-800">
                          {row.title}
                        </p>
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                          <Clock size={12} />
                          {row.startTime?.slice(0, 5) || "--:--"} -{" "}
                          {row.endTime?.slice(0, 5) || "--:--"} |{" "}
                          {DELIVERY_LABEL[row.deliveryMode]}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${TYPE_COLOR[row.eventType]}`}
                        >
                          {TYPE_LABEL[row.eventType]}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                        {formatDate(row.eventDate)}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {row.quota ?? 0}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-600">
                        {formatPrice(row.price)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold border ${row.isPublished ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-slate-100 text-slate-500 border-slate-200"}`}
                        >
                          {row.isPublished ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {(() => {
                          const eventStatus = getEventStatus(row.eventDate);
                          return (
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold w-fit border ${eventStatus.bgColor} ${eventStatus.textColor} ${eventStatus.borderColor}`}
                            >
                              {eventStatus.icon === "check" ? (
                                <CheckCircle2 size={13} />
                              ) : (
                                <Clock size={13} />
                              )}
                              {eventStatus.status}
                            </span>
                          );
                        })()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEdit(row)}
                            aria-label={`Edit ${row.title}`}
                            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(row)}
                            aria-label={`Hapus ${row.title}`}
                            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE/EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            aria-label="Tutup modal"
            onClick={() => setModalOpen(false)}
          />
          <form
            onSubmit={handleSubmit}
            className="relative max-h-[92vh] w-full max-w-3xl space-y-5 overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  {editTarget ? "Edit Event" : "Tambah Event Baru"}
                </h3>
                <p className="text-xs text-slate-400">
                  Isi sesuai skema tabel public.events.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Judul Event *
                </label>
                <input
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                  required
                  placeholder="Contoh: Keamanan Siber untuk Pemula"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-[#CB2229] focus:outline-none focus:ring-2 focus:ring-[#CB2229]/30"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Deskripsi
                </label>
                <textarea
                  value={form.description ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  rows={4}
                  placeholder="Ringkasan event..."
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-[#CB2229] focus:outline-none focus:ring-2 focus:ring-[#CB2229]/30"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Tipe
                </label>
                <select
                  value={form.eventType}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      eventType: e.target.value as EventType,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-[#CB2229] focus:outline-none focus:ring-2 focus:ring-[#CB2229]/30"
                >
                  {TYPE_OPTIONS.map((type) => (
                    <option key={type} value={type}>
                      {TYPE_LABEL[type]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Delivery
                </label>
                <select
                  value={form.deliveryMode}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      deliveryMode: e.target.value as DeliveryMode,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-[#CB2229] focus:outline-none focus:ring-2 focus:ring-[#CB2229]/30"
                >
                  {DELIVERY_OPTIONS.map((delivery) => (
                    <option key={delivery} value={delivery}>
                      {DELIVERY_LABEL[delivery]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Tanggal Event *
                </label>
                <input
                  type="date"
                  value={form.eventDate}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, eventDate: e.target.value }))
                  }
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-[#CB2229] focus:outline-none focus:ring-2 focus:ring-[#CB2229]/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                    Mulai
                  </label>
                  <input
                    type="time"
                    value={form.startTime ?? ""}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, startTime: e.target.value }))
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-[#CB2229] focus:outline-none focus:ring-2 focus:ring-[#CB2229]/30"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                    Selesai
                  </label>
                  <input
                    type="time"
                    value={form.endTime ?? ""}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, endTime: e.target.value }))
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-[#CB2229] focus:outline-none focus:ring-2 focus:ring-[#CB2229]/30"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Kuota
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.quota ?? 0}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, quota: Number(e.target.value) }))
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-[#CB2229] focus:outline-none focus:ring-2 focus:ring-[#CB2229]/30"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Harga
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.price ?? 0}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, price: e.target.value }))
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-[#CB2229] focus:outline-none focus:ring-2 focus:ring-[#CB2229]/30"
                />
              </div>

              {/* ====== THUMBNAIL UPLOAD SECTION ====== */}
              <div className="md:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Thumbnail Gambar
                </label>

                {thumbnailPreview && (
                  <div className="relative mb-3 group">
                    <div className="relative h-44 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                      <Image
                        src={thumbnailPreview}
                        alt="Preview thumbnail"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        resetThumbnailState();
                        setForm((f) => ({ ...f, thumbnailUrl: "" }));
                      }}
                      className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white shadow-md transition-all hover:bg-red-600 hover:scale-110"
                      title="Hapus gambar"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}

                <div
                  className="relative cursor-pointer rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 px-4 py-6 text-center transition-all hover:border-[#CB2229]/40 hover:bg-red-50/30"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={ACCEPTED_IMAGE_TYPES}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#CB2229]/10">
                      <ImagePlus size={20} className="text-[#CB2229]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600">
                        {thumbnailPreview
                          ? "Klik untuk ganti gambar"
                          : "Klik untuk upload gambar"}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-400">
                        PNG, JPEG, WebP • Maks {MAX_FILE_SIZE_MB}MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* ====== END THUMBNAIL UPLOAD SECTION ====== */}

              <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 md:col-span-2">
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, isPublished: e.target.checked }))
                  }
                  className="h-4 w-4 accent-[#CB2229]"
                />
                <span className="text-sm font-semibold text-slate-700">
                  Publikasikan event di landing page
                </span>
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 rounded-xl bg-[#CB2229] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-70"
              >
                {isSaving && <Loader2 size={15} className="animate-spin" />}
                {isSaving
                  ? "Sedang Menyimpan..."
                  : editTarget
                    ? "Simpan Perubahan"
                    : "Tambah Event"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            aria-label="Tutup modal hapus"
            onClick={() => setDeleteTarget(null)}
          />
          <div className="relative w-full max-w-sm space-y-4 rounded-2xl bg-white p-6 text-center shadow-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
              <Trash2 size={24} className="text-[#CB2229]" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Hapus Event?</h3>
              <p className="mt-1 text-sm text-slate-500">
                {deleteTarget.title}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 rounded-xl border border-slate-200 py-2 text-sm font-medium transition-colors hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={isSaving}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#CB2229] py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-70"
              >
                {isSaving && <Loader2 size={15} className="animate-spin" />}
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}