/**
 * Script untuk membuat akun admin pertama.
 *
 * Jalankan dengan:
 *   npx tsx src/db/seed-admin.ts
 *
 * Pastikan DATABASE_URL sudah di-set di .env.local atau environment.
 */

import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import * as schema from "./schema";

// ====== KONFIGURASI ADMIN ======
// Silahkan ubah data ini sesuai kebutuhan
const ADMIN_EMAIL = "admin@academy.id";
const ADMIN_PASSWORD = "Admin123!";
const ADMIN_FULL_NAME = "Super Admin";
// ================================

async function seedAdmin() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error("❌ DATABASE_URL tidak ditemukan di environment.");
    console.error("   Pastikan file .env.local berisi DATABASE_URL yang valid.");
    process.exit(1);
  }

  const pool = new Pool({ connectionString });
  const db = drizzle(pool, { schema });

  try {
    console.log("🔍 Mengecek apakah admin sudah ada...");

    const existing = await db
      .select()
      .from(schema.admins)
      .where(eq(schema.admins.email, ADMIN_EMAIL))
      .limit(1);

    if (existing.length > 0) {
      console.log(`⚠️  Admin dengan email "${ADMIN_EMAIL}" sudah ada (id: ${existing[0].id}).`);
      console.log("   Tidak ada perubahan yang dilakukan.");
    } else {
      console.log("🔐 Hashing password...");
      const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

      console.log("💾 Menyimpan admin ke database...");
      const result = await db
        .insert(schema.admins)
        .values({
          fullName: ADMIN_FULL_NAME,
          email: ADMIN_EMAIL,
          passwordHash,
          isActive: true,
        })
        .returning({ id: schema.admins.id, email: schema.admins.email });

      console.log("✅ Admin berhasil dibuat!");
      console.log(`   ID    : ${result[0].id}`);
      console.log(`   Email : ${result[0].email}`);
      console.log(`   Pass  : ${ADMIN_PASSWORD}`);
    }
  } catch (error) {
    console.error("❌ Gagal membuat admin:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seedAdmin();
