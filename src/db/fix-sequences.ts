/**
 * Fix: Reset semua sequence serial ID di database
 * agar tidak terjadi "duplicate key" saat INSERT baru.
 */
import { Pool } from "pg";

const tables = [
  "events",
  "admins",
  "users",
  "materials",
  "trainers",
  "programs",
  "partnerships",
  "event_registrations",
  "user_saved_materials",
  "user_saved_events",
  "event_trainers",
];

async function fixSequences() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  console.log("🔧 Memperbaiki sequence untuk semua tabel...\n");

  for (const table of tables) {
    try {
      const res = await pool.query(
        "SELECT setval(pg_get_serial_sequence($1, 'id'), COALESCE((SELECT MAX(id) FROM " + table + "), 0) + 1, false)",
        [table]
      );
      console.log("✅ " + table + ": sequence reset to " + res.rows[0].setval);
    } catch (e: any) {
      console.log("⚠️  " + table + ": skipped - " + e.message);
    }
  }

  await pool.end();
  console.log("\n🎉 Selesai! Sekarang INSERT seharusnya berhasil.");
}

fixSequences();
