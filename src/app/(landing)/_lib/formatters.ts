/**
 * Fungsi: formatShortDate
 * Kegunaan: Mengambil string tanggal dari database dan mengubahnya menjadi format pendek.
 * Contoh Output: { day: "12", monthYear: "Okt 2026" }
 * Error Handling: Mengembalikan strip "-" jika data tanggal tidak valid atau kosong.
 */
export function formatShortDate(dateStr?: string | null) {
  if (!dateStr) return { day: "-", monthYear: "-" };
  try {
    const cleanDate = dateStr.split("T")[0];
    const date = new Date(`${cleanDate}T00:00:00`);
    if (isNaN(date.getTime())) return { day: "-", monthYear: "-" };

    const day = new Intl.DateTimeFormat("id-ID", { day: "2-digit" }).format(
      date,
    );
    const monthYear = new Intl.DateTimeFormat("id-ID", {
      month: "short",
      year: "numeric",
    }).format(date);
    return { day, monthYear };
  } catch (e) {
    return { day: "-", monthYear: "-" };
  }
}

/**
 * Fungsi: formatLongDate
 * Kegunaan: Mengubah string tanggal menjadi format panjang dan formal berbahasa Indonesia.
 * Contoh Output: "12 Oktober 2026"
 */
export function formatLongDate(dateStr?: string | null) {
  if (!dateStr) return "-";
  try {
    const cleanDate = dateStr.split("T")[0];
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

/**
 * Fungsi: formatEventPrice
 * Kegunaan: Mengubah angka numerik menjadi format mata uang Rupiah (IDR).
 * Contoh Output: "Rp 150.000" atau "Gratis" jika harga 0/null.
 */
export function formatEventPrice(price?: number | null) {
  if (!price) return "Gratis";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
}
