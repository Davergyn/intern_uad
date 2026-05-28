/**
 * ============================================================================
 * MANAGE PROGRAM — Section placeholder
 * ============================================================================
 * Logika CRUD aktif untuk program management kini berada di:
 *   - src/app/admin/programs/page.tsx  (setelah restrukturisasi)
 *
 * Fitur di dalamnya:
 * 1. Pemisahan otomatis data ke 2 tabel berdasarkan kategori:
 *    - Tabel 'programs': Training of Trainer, Seminar, Workshop
 *    - Tabel 'partners': Partnership
 *
 * 2. Kolom 'kategori' menggunakan ENUM: training-of-trainer | seminar | workshop | partnership
 *
 * 3. Fetch paralel dari kedua tabel saat filter "Semua Program"
 *    - Promise.all([programs, partners])
 *    - Merge hasil ke format array terpadu
 *
 * ============================================================================
 */

// File ini hanya komentar dokumentasi.
// Komponen program management ada di src/app/admin/programs/page.tsx
export {};
