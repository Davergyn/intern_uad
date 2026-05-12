/**
 * ============================================================================
 * MANAGE PROGRAM - Exported for potential future use
 * ============================================================================
 * File ini adalah placeholder untuk logika program management terpusat.
 * Saat ini, logika CRUD aktif berada di:
 *   - src/app/feature-admin/admin-dashboard/programs/page.tsx
 *
 * Fitur di dalamnya:
 * 1. Pemisahan otomatis data ke 2 tabel berdasarkan kategori:
 *    - Tabel 'programs': Training of Trainer, Seminar, Workshop
 *    - Tabel 'partners': Partnership
 *
 * 2. Generate slug unik dengan timestamp untuk menghindari Unique Constraint
 *    - Format: {category}-{timestamp-ms}
 *    - Contoh: seminar-1715000000123
 *
 * 3. Tidak mengirim 'created_at' di payload (biarkan DB auto-generate)
 *
 * 4. Fetch paralel dari kedua tabel saat filter "Semua Program"
 *    - Promise.all([programs, partners])
 *    - Merge hasil ke format array terpadu
 *
 * ============================================================================
 */

// Re-export dapat dilakukan jika diperlukan di masa depan
export { default as ManageProgramsPage } from "./admin-dashboard/programs/page";
