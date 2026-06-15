/**
 * AdminTable — Komponen tabel universal reusable untuk semua halaman admin.
 *
 * Props:
 *  - title        : Judul section tabel
 *  - description  : Sub-keterangan di bawah judul
 *  - headers      : Array string nama kolom (header row)
 *  - data         : Array data generik (T[])
 *  - isLoading    : Status loading data dari API
 *  - renderRow    : Fungsi render setiap baris <tr> beserta <td>
 *  - emptyMessage : (opsional) Pesan saat data kosong
 *  - colSpan      : (opsional) Jumlah kolom untuk state loading/empty
 */

import { Loader2 } from "lucide-react";

type AdminTableProps<T> = {
  title: string;
  description?: string;
  headers: string[];
  data: T[];
  isLoading: boolean;
  renderRow: (item: T, index: number) => React.ReactNode;
  emptyMessage?: string;
  colSpan?: number;
};

export default function AdminTable<T>({
  title,
  description,
  headers,
  data,
  isLoading,
  renderRow,
  emptyMessage = "Tidak ada data ditemukan.",
  colSpan,
}: AdminTableProps<T>) {
  const effectiveColSpan = colSpan ?? headers.length;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
        <div>
          <h2 className="font-bold text-slate-800">{title}</h2>
          {description && (
            <p className="mt-0.5 text-xs text-slate-400">{description}</p>
          )}
        </div>
        <span className="text-xs text-slate-400">
          {isLoading ? "..." : `${data.length} data`}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              {headers.map((header) => (
                <th
                  key={header}
                  className={`px-6 py-3 ${header.toLowerCase() === "aksi" ? "text-right" : ""}`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            {isLoading ? (
              <tr>
                <td
                  colSpan={effectiveColSpan}
                  className="py-12 text-center text-sm text-slate-400"
                >
                  <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" />
                  Memuat data...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={effectiveColSpan}
                  className="py-12 text-center text-sm text-slate-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, index) => renderRow(item, index))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
