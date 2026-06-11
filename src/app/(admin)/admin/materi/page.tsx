"use client";

import React, { FormEvent, useEffect, useMemo, useState, useRef } from "react";
import Image from "next/image";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  BookOpen,
  Loader2,
  Eye,
  EyeOff,
  ImagePlus,
  FileText,
  Link2,
  Paperclip,
  ArrowUpRight
} from "lucide-react";
import type { MaterialRow } from "@/types/database";

type MaterialWithLinks = MaterialRow & {
  links?: AttachmentItem[];
};

type AttachmentItem = {
  type: "link" | "pdf"; // SINKRON dengan struktur Enum database
  name: string;
  url: string;
};

type StagingPdf = {
  id: string;
  file: File;
  name: string;
};

type MaterialFormData = {
  title: string;
  description: string;
  attachments: AttachmentItem[];
  coverUrl: string;
  isActive: boolean;
};

const COVER_GRADIENTS = [
  "from-blue-400 to-blue-600",
  "from-purple-400 to-purple-600",
  "from-emerald-400 to-emerald-600",
  "from-amber-400 to-orange-500",
  "from-rose-400 to-red-600",
  "from-indigo-400 to-indigo-600",
];

const EMPTY_FORM: MaterialFormData = {
  title: "",
  description: "",
  attachments: [],
  coverUrl: "",
  isActive: true,
};

const ACCEPTED_IMAGE_TYPES = "image/png, image/jpeg, image/webp, image/jpg";
const MAX_FILE_SIZE_MB = 5;
const MAX_PDF_SIZE_MB = 20;

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) return error.message;
  return fallback;
}

function isValidUrl(url: string): boolean {
  if (!url || !url.trim()) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export default function ManageMaterialPage() {
  const [materials, setMaterials] = useState<MaterialWithLinks[]>([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<MaterialRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MaterialRow | null>(null);
  const [form, setForm] = useState<MaterialFormData>(EMPTY_FORM);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [stagingPdfs, setStagingPdfs] = useState<StagingPdf[]>([]);
  const [inputLinkUrl, setInputLinkUrl] = useState("");
  const [inputLinkLabel, setInputLinkLabel] = useState("");
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const filteredMaterials = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return materials.filter(
      (material) => !keyword || material.title.toLowerCase().includes(keyword),
    );
  }, [materials, search]);

  const fetchMaterials = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/materi", { method: "GET" });
      const result = (await response.json()) as {
        data?: MaterialWithLinks[];
        error?: string;
      };
      if (!response.ok) throw new Error(result.error || "Gagal memuat data materi.");
      setMaterials(result.data ?? []);
    } catch (err) {
      setMaterials([]);
      setError(getErrorMessage(err, "Gagal memuat data materi."));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchMaterials();
  }, []);

  const resetCoverState = () => {
    if (coverPreview && coverPreview.startsWith("blob:")) {
      URL.revokeObjectURL(coverPreview);
    }
    setCoverFile(null);
    setCoverPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`Ukuran cover melebihi ${MAX_FILE_SIZE_MB}MB.`);
      e.target.value = "";
      return;
    }

    setError("");
    resetCoverState();
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleAddLinkAttachment = () => {
    setError("");
    if (!inputLinkLabel.trim() || !inputLinkUrl.trim()) {
      setError("Nama Link dan URL wajib diisi.");
      return;
    }

    if (!isValidUrl(inputLinkUrl)) {
      setError("Format URL Link tidak valid. Gunakan format penuh (https://...)");
      return;
    }

    const newItem: AttachmentItem = {
      type: "link",
      name: inputLinkLabel.trim(),
      url: inputLinkUrl.trim(),
    };

    setForm((prev) => ({
      ...prev,
      attachments: [...prev.attachments, newItem],
    }));

    setInputLinkLabel("");
    setInputLinkUrl("");
  };

  const handleAddPdfAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const validPdfs: StagingPdf[] = [];
    for (const file of files) {
      if (file.type !== "application/pdf") {
        setError("Hanya file berformat PDF dokumen yang diperbolehkan.");
        continue;
      }
      if (file.size > MAX_PDF_SIZE_MB * 1024 * 1024) {
        setError(`Ukuran file PDF tidak boleh melebihi ${MAX_PDF_SIZE_MB}MB.`);
        continue;
      }

      validPdfs.push({
        id: Math.random().toString(36).substring(2, 9),
        file,
        name: file.name,
      });
    }

    setStagingPdfs((prev) => [...prev, ...validPdfs]);
    if (pdfInputRef.current) pdfInputRef.current.value = "";
  };

  const removeServerAttachment = (indexToRemove: number) => {
    setForm((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const removeStagingPdf = (idToRemove: string) => {
    setStagingPdfs((prev) => prev.filter((item) => item.id !== idToRemove));
  };

  const showSuccess = (message: string) => {
    setSuccess(message);
    window.setTimeout(() => setSuccess(""), 2500);
  };

  const openCreate = () => {
    setError("");
    setSuccess("");
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setStagingPdfs([]);
    setInputLinkLabel("");
    setInputLinkUrl("");
    resetCoverState();
    setModalOpen(true);
  };

  const openEdit = (material: MaterialWithLinks) => {
    setError("");
    setSuccess("");
    setEditTarget(material);
    setStagingPdfs([]);
    setInputLinkLabel("");
    setInputLinkUrl("");

    const existingAttachments: AttachmentItem[] = (material.links ?? []).map(
      (link) => ({ type: link.type as "link" | "pdf", name: link.name, url: link.url }),
    );

    setForm({
      title: material.title,
      description: material.description ?? "",
      attachments: existingAttachments,
      coverUrl: material.coverUrl ?? "",
      isActive: material.isActive ?? true,
    });

    setCoverFile(null);
    setCoverPreview(material.coverUrl ?? null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setModalOpen(true);
  };

  const serializeAndAppendForm = (formData: FormData, values: MaterialFormData) => {
    formData.append("title", values.title.trim());
    formData.append("description", values.description.trim());
    formData.append("isActive", String(values.isActive));
    formData.append("attachments", JSON.stringify(values.attachments));

    if (coverFile) {
      formData.append("cover", coverFile);
    } else {
      formData.append("existingCoverUrl", values.coverUrl || "");
    }

    stagingPdfs.forEach((item) => {
      formData.append("pdf_attachments", item.file, item.name);
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.title.trim()) {
      setError("Judul Materi wajib diisi.");
      return;
    }

    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      if (editTarget) {
        formData.append("id", String(editTarget.id));
        serializeAndAppendForm(formData, form);
        const response = await fetch("/api/admin/materi", { method: "PUT", body: formData });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Gagal mengubah materi.");
        showSuccess("Materi berhasil diperbarui.");
      } else {
        serializeAndAppendForm(formData, form);
        const response = await fetch("/api/admin/materi", { method: "POST", body: formData });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Gagal menambah materi.");
        showSuccess("Materi berhasil ditambahkan.");
      }

      setModalOpen(false);
      await fetchMaterials();
    } catch (err) {
      setError(getErrorMessage(err, "Gagal menyimpan data ke server."));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsSaving(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/materi?id=${deleteTarget.id}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Gagal menghapus materi.");

      setDeleteTarget(null);
      showSuccess("Materi berhasil dihapus dari database & bucket.");
      await fetchMaterials();
    } catch (err) {
      setError(getErrorMessage(err, "Gagal menghapus data."));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Search Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari judul materi..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#CB2229]/30 focus:border-[#CB2229]"
          />
        </div>
        <div className="flex items-center gap-2">
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
            className="flex items-center gap-2 px-4 py-2.5 bg-[#CB2229] hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
          >
            <Plus size={16} /> Tambah Materi
          </button>
        </div>
      </div>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      {success && <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div>}

      {/* View Mode: GRID */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {isLoading ? (
            <div className="col-span-full py-16 flex items-center justify-center text-slate-400">
              <Loader2 size={20} className="animate-spin mr-2" /> Memuat data materi...
            </div>
          ) : filteredMaterials.length === 0 ? (
            <div className="col-span-full py-16 text-center text-slate-400 text-sm bg-white rounded-2xl border border-slate-100">
              Belum ada data materi.
            </div>
          ) : (
            filteredMaterials.map((mat) => {
              const listAttachments: AttachmentItem[] = mat.links ?? [];
              const totalPdf = listAttachments.filter((a) => a.type === "pdf").length;
              const totalUrl = listAttachments.filter((a) => a.type === "link").length;

              return (
                <div key={`material-${mat.id}`} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                  <div className={`h-32 bg-gradient-to-br ${COVER_GRADIENTS[mat.id % COVER_GRADIENTS.length]} flex items-center justify-center relative overflow-hidden`}>
                    {mat.coverUrl ? (
                      <Image src={mat.coverUrl} alt={mat.title} fill className="object-cover" unoptimized />
                    ) : (
                      <BookOpen size={36} className="text-white/50" />
                    )}
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="absolute top-3 left-3 flex gap-1">
                      {totalPdf > 0 && <span className="px-2 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded-md">{totalPdf} PDF</span>}
                      {totalUrl > 0 && <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-500 text-white rounded-md">{totalUrl} LINK</span>}
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="font-bold text-slate-800 text-base line-clamp-1">{mat.title}</h3>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">{mat.description || <span className="italic text-slate-400">Tidak ada deskripsi</span>}</p>
                    </div>

                    {listAttachments.length > 0 && (
                      <div className="bg-slate-50 rounded-xl p-2 max-h-24 overflow-y-auto space-y-1 border border-slate-100">
                        {listAttachments.map((file, fileIdx) => (
                          <a
                            key={fileIdx}
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between text-[11px] text-slate-600 hover:text-[#CB2229] bg-white px-2 py-1 rounded-md border border-slate-200/60 transition-colors"
                          >
                            <div className="flex items-center gap-1.5 truncate max-w-[85%]">
                              {file.type === "pdf" ? <FileText size={12} className="text-red-500 shrink-0" /> : <Link2 size={12} className="text-blue-500 shrink-0" />}
                              <span className="truncate">{file.name}</span>
                            </div>
                            <ArrowUpRight size={10} className="text-slate-400 shrink-0" />
                          </a>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="text-[10px] text-slate-400">ID: #{mat.id}</span>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full ${mat.isActive ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>
                        {mat.isActive ? "Aktif" : "Nonaktif"}
                      </span>
                    </div>
                  </div>

                  <div className="px-4 py-2.5 border-t border-slate-50 flex items-center justify-end gap-1 bg-slate-50/50">
                    <button onClick={() => openEdit(mat)} className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Pencil size={12} /> Edit
                    </button>
                    <button onClick={() => setDeleteTarget(mat)} className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={12} /> Hapus
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* View Mode: TABLE (SINKRON DENGAN STYLE REFERENSI PROGRAM) */}
      {viewMode === "table" && (
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div>
              <h2 className="font-bold text-slate-800">Manajemen Konten Materi</h2>
              <p className="text-xs text-slate-400">
                Kelola paket bundling materi belajar dengan media dokumen berkas PDF maupun tautan eksternal.
              </p>
            </div>
            <span className="text-xs text-slate-400">
              {filteredMaterials.length} data
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-6 py-3">Cover</th>
                  <th className="px-6 py-3">Judul Materi</th>
                  <th className="px-6 py-3">Bundling Lampiran</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-sm text-slate-400">
                      <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" />
                      Memuat data materi...
                    </td>
                  </tr>
                ) : filteredMaterials.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-sm text-slate-400">
                      Tidak ada data materi ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredMaterials.map((mat) => {
                    const attachments: AttachmentItem[] = mat.links ?? [];
                    const countPdf = attachments.filter(a => a.type === 'pdf').length;
                    const countLink = attachments.filter(a => a.type === 'link').length;

                    return (
                      <tr key={`material-table-row-${mat.id}`} className="transition-colors hover:bg-slate-50">
                        {/* Column Cover */}
                        <td className="max-w-sm px-6 py-4">
                          <div className="flex h-10 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 border border-slate-200 relative">
                            {mat.coverUrl ? (
                              <Image
                                src={mat.coverUrl}
                                alt={mat.title}
                                width={64}
                                height={40}
                                className="h-full w-full object-cover"
                                unoptimized
                              />
                            ) : (
                              <BookOpen size={18} className="text-slate-400" />
                            )}
                          </div>
                        </td>

                        {/* Column Judul & Deskripsi */}
                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold text-slate-800 max-w-xs truncate">
                            {mat.title}
                          </p>
                          <p className="text-xs text-slate-400 max-w-xs truncate mt-0.5">
                            {mat.description?.trim() ? mat.description : "Tidak ada deskripsi"}
                          </p>
                        </td>

                        {/* Column Total Lampiran */}
                        <td className="whitespace-nowrap px-6 py-4">
                          <span className="text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full">
                            {attachments.length} Item ({countPdf} PDF, {countLink} Link)
                          </span>
                        </td>

                        {/* Column Status */}
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold border ${mat.isActive ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-slate-100 text-slate-500 border-slate-200"}`}
                          >
                            {mat.isActive ? <Eye size={12} /> : <EyeOff size={12} />}
                            {mat.isActive ? "Aktif" : "Nonaktif"}
                          </span>
                        </td>

                        {/* Column Aksi Buttons */}
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEdit(mat)}
                              aria-label={`Edit ${mat.title}`}
                              className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(mat)}
                              aria-label={`Hapus ${mat.title}`}
                              className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Edit/Create */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button className="absolute inset-0 bg-black/50 backdrop-blur-sm" type="button" onClick={() => setModalOpen(false)} />
          <form onSubmit={handleSubmit} className="relative max-h-[94vh] w-full max-w-3xl space-y-5 overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-800">{editTarget ? "Edit Konten Materi" : "Tambah Materi Baru"}</h3>
                <p className="text-xs text-slate-400">Unggah PDF ke Bucket Supabase atau Sematkan Link URL Luar.</p>
              </div>
              <button type="button" onClick={() => setModalOpen(false)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"><X size={18} /></button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Judul Pokok Materi *</label>
                  <input value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CB2229]/30 focus:border-[#CB2229]" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Deskripsi Materi</label>
                  <textarea value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} rows={4} className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CB2229]/30 focus:border-[#CB2229] resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Cover Thumbnail Materi</label>
                  {coverPreview ? (
                    <div className="relative mb-3 w-full h-32 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                      <Image src={coverPreview} alt="Preview" fill className="object-cover" unoptimized />
                      <button type="button" onClick={() => { resetCoverState(); setForm(f => ({ ...f, coverUrl: "" })); }} className="absolute right-2 top-2 h-6 w-6 flex items-center justify-center rounded-full bg-red-500 text-white shadow hover:bg-red-600">
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <div className="cursor-pointer rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 px-4 py-5 text-center hover:bg-red-50/20 transition-all" onClick={() => fileInputRef.current?.click()}>
                      <input ref={fileInputRef} type="file" accept={ACCEPTED_IMAGE_TYPES} onChange={handleCoverChange} className="hidden" />
                      <div className="flex items-center justify-center gap-2 text-slate-500 text-xs font-medium">
                        <ImagePlus size={16} className="text-[#CB2229]" />
                        <span>Upload Cover Image (Max 5MB)</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-4">
                <span className="block text-xs font-bold text-slate-700 tracking-wide uppercase">Manajemen Link dan File Materi</span>
                
                <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-200/80 space-y-2.5">
                  <span className="flex items-center gap-1 text-[11px] font-bold text-blue-600"><Link2 size={12}/> Opsi Tautan Luar (Video/Web/Drive)</span>
                  <div className="grid grid-cols-1 gap-2">
                    <input value={inputLinkLabel} onChange={e => setInputLinkLabel(e.target.value)} placeholder="Masukan Judul Link" className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none" />
                    <div className="flex gap-2">
                      <input value={inputLinkUrl} onChange={e => setInputLinkUrl(e.target.value)} placeholder="https://..." className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none" />
                      <button type="button" onClick={handleAddLinkAttachment} className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg">Sematkan</button>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-200/80 space-y-2">
                  <span className="flex items-center gap-1 text-[11px] font-bold text-red-600"><FileText size={12}/> Opsi Upload File Dokumen (.pdf)</span>
                  <button type="button" onClick={() => pdfInputRef.current?.click()} className="w-full py-3 bg-white border border-slate-200 rounded-lg flex items-center justify-center gap-2 text-xs text-slate-600 shadow-sm">
                    <Paperclip size={13} className="text-red-500" /> Pilih File PDF (Bisa Banyak)
                  </button>
                  <input ref={pdfInputRef} type="file" accept="application/pdf" multiple onChange={handleAddPdfAttachment} className="hidden" />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Daftar Bundling Lampiran ({form.attachments.length + stagingPdfs.length} Item)</label>
                  <div className="space-y-1.5 max-h-44 overflow-y-auto">
                    {form.attachments.length === 0 && stagingPdfs.length === 0 && (
                      <p className="text-xs italic text-slate-400 p-3 text-center bg-slate-50/30 border border-dashed rounded-xl">Belum ada lampiran.</p>
                    )}
                    {form.attachments.map((file, idx) => (
                      <div key={`server-file-${idx}`} className="flex items-center justify-between p-2 rounded-lg border text-xs bg-emerald-50/70 border-emerald-100">
                        <div className="flex items-center gap-2 truncate max-w-[85%]">
                          {file.type === "pdf" ? <FileText size={13} className="text-red-500" /> : <Link2 size={13} className="text-blue-500" />}
                          <span className="font-semibold text-slate-700 truncate">{file.name}</span>
                        </div>
                        <button type="button" onClick={() => removeServerAttachment(idx)} className="text-slate-400 hover:text-red-500"><X size={14} /></button>
                      </div>
                    ))}
                    {stagingPdfs.map((item) => (
                      <div key={`staging-file-${item.id}`} className="flex items-center justify-between p-2 rounded-lg border text-xs bg-blue-50/70 border-blue-100">
                        <div className="flex items-center gap-2 truncate max-w-[85%]">
                          <FileText size={13} className="text-orange-500" />
                          <span className="font-semibold text-blue-900 truncate">{item.name}</span>
                          <span className="text-[10px] text-blue-400">(Antrean Upload)</span>
                        </div>
                        <button type="button" onClick={() => removeStagingPdf(item.id)} className="text-slate-400 hover:text-red-500"><X size={14} /></button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))} className="h-4 w-4 accent-[#CB2229]" />
                <span className="text-sm font-semibold text-slate-700">Publikasikan Materi</span>
              </label>
              <div className="flex gap-2">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl">Batal</button>
                <button type="submit" disabled={isSaving} className="px-5 py-2 text-sm font-semibold bg-[#CB2229] text-white rounded-xl">
                  {isSaving ? "Menyimpan..." : editTarget ? "Simpan Perubahan" : "Simpan Materi"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button className="absolute inset-0 bg-black/50 backdrop-blur-sm" type="button" onClick={() => setDeleteTarget(null)} />
          <div className="relative w-full max-w-sm space-y-4 rounded-2xl bg-white p-6 text-center shadow-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
              <Trash2 size={24} className="text-[#CB2229]" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Hapus Materi?</h3>
              <p className="mt-1 text-sm text-slate-500 truncate">{deleteTarget.title}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 rounded-xl border border-slate-200 py-2 text-sm hover:bg-slate-50">Batal</button>
              <button onClick={handleDelete} disabled={isSaving} className="flex-1 bg-[#CB2229] text-white py-2 text-sm font-semibold rounded-xl">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}