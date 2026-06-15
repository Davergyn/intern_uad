/**
 * AdminGrid — Komponen grid card universal reusable untuk semua halaman admin.
 *
 * Props:
 *  - data         : Array data generik (T[])
 *  - isLoading    : Status loading data dari API
 *  - renderCard   : Fungsi render setiap card (div) — harus menyertakan key
 *  - emptyMessage : (opsional) Pesan saat data kosong
 *  - cols         : (opsional) Jumlah kolom grid: "2" | "3" | "4" (default "3")
 *  - loadingLabel : (opsional) Label teks saat loading (default "Memuat data...")
 */

import { Loader2 } from "lucide-react";

type GridCols = "2" | "3" | "4";

type AdminGridProps<T> = {
  data: T[];
  isLoading: boolean;
  renderCard: (item: T, index: number) => React.ReactNode;
  emptyMessage?: string;
  cols?: GridCols;
  loadingLabel?: string;
};

const COLS_CLASS: Record<GridCols, string> = {
  "2": "grid-cols-1 sm:grid-cols-2",
  "3": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  "4": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
};

export default function AdminGrid<T>({
  data,
  isLoading,
  renderCard,
  emptyMessage = "Belum ada data.",
  cols = "3",
  loadingLabel = "Memuat data...",
}: AdminGridProps<T>) {
  const colsClass = COLS_CLASS[cols];

  if (isLoading) {
    return (
      <div className="col-span-full flex items-center justify-center py-16 text-slate-400">
        <Loader2 size={20} className="mr-2 animate-spin" />
        {loadingLabel}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white py-16 text-center text-sm text-slate-400">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={`grid gap-5 ${colsClass}`}>
      {data.map((item, index) => renderCard(item, index))}
    </div>
  );
}
