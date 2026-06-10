/**
 * ============================================================
 * DATABASE SEEDER - academy.id
 * ============================================================
 * Cara menjalankan:
 *   1. Tambahkan script berikut di package.json:
 *        "seed": "tsx src/db/seed.ts"
 *   2. Jalankan perintah:
 *        pnpm seed
 *      atau:
 *        npx tsx src/db/seed.ts
 *
 * Pastikan variabel lingkungan DATABASE_URL sudah diset
 * di file .env.local sebelum menjalankan seeder ini.
 * ============================================================
 */

import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as bcrypt from "bcryptjs";
import * as schema from "./schema";
import {
  admins,
  users,
  partnerships,
  trainers,
  programs,
  events,
  materials,
} from "./schema";

// ============================================================
// Inisialisasi koneksi database
// ============================================================
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

// ============================================================
// Fungsi Utama Seeder
// ============================================================
async function main() {
  console.log("🚀 Memulai proses seeding database...\n");

  // ----------------------------------------------------------
  // TAHAP 1: Insert Admin Utama
  // ----------------------------------------------------------
  console.log("📌 [Tahap 1] Membuat admin utama...");

  const passwordHashAdmin = await bcrypt.hash("admin123", 12);

  const [adminUtama] = await db
    .insert(admins)
    .values({
      fullName: "Administrator Academy",
      email: "admin@academy.id",
      passwordHash: passwordHashAdmin,
      isActive: true,
    })
    .returning();

  console.log(`   ✅ Admin berhasil dibuat: ${adminUtama.email} (ID: ${adminUtama.id})\n`);

  // ----------------------------------------------------------
  // TAHAP 2: Insert 2 User Dummy
  // ----------------------------------------------------------
  console.log("📌 [Tahap 2] Membuat user dummy...");

  const passwordHashUser = await bcrypt.hash("user123", 12);

  const insertedUsers = await db
    .insert(users)
    .values([
      {
        fullName: "Budi Santoso",
        email: "budi.santoso@gmail.com",
        passwordHash: passwordHashUser,
        isActive: true,
        avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=budi",
      },
      {
        fullName: "Siti Rahayu",
        email: "siti.rahayu@gmail.com",
        passwordHash: passwordHashUser,
        isActive: true,
        avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=siti",
      },
    ])
    .returning();

  console.log(`   ✅ ${insertedUsers.length} user berhasil dibuat:`);
  insertedUsers.forEach((u) =>
    console.log(`      - ${u.fullName} (${u.email}) | ID: ${u.id}`)
  );
  console.log();

  // ----------------------------------------------------------
  // TAHAP 3: Insert 3 Data Partnerships
  // ----------------------------------------------------------
  console.log("📌 [Tahap 3] Membuat data partnerships...");

  const insertedPartnerships = await db
    .insert(partnerships)
    .values([
      {
        name: "Kementerian Komunikasi dan Digital RI",
        logoUrl: "https://placehold.co/200x80/1e3a5f/ffffff?text=Kominfo",
        createdBy: adminUtama.id,
      },
      {
        name: "BSSN - Badan Siber dan Sandi Negara",
        logoUrl: "https://placehold.co/200x80/1a472a/ffffff?text=BSSN",
        createdBy: adminUtama.id,
      },
      {
        name: "Dicoding Indonesia",
        logoUrl: "https://placehold.co/200x80/4f46e5/ffffff?text=Dicoding",
        createdBy: adminUtama.id,
      },
    ])
    .returning();

  console.log(`   ✅ ${insertedPartnerships.length} partnership berhasil dibuat:`);
  insertedPartnerships.forEach((p) =>
    console.log(`      - ${p.name} | ID: ${p.id}`)
  );
  console.log();

  // ----------------------------------------------------------
  // TAHAP 4: Insert 3 Data Trainers
  // ----------------------------------------------------------
  console.log("📌 [Tahap 4] Membuat data trainers...");

  const insertedTrainers = await db
    .insert(trainers)
    .values([
      {
        name: "Dr. Ahmad Fauzi, M.Kom",
        roleTitle: "Pakar Keamanan Siber & Ethical Hacker",
        photoUrl: "https://api.dicebear.com/9.x/personas/svg?seed=ahmad",
        bio: "Dr. Ahmad Fauzi adalah seorang pakar keamanan siber dengan pengalaman lebih dari 15 tahun. Beliau merupakan certified ethical hacker (CEH) dan CISSP, serta aktif berkontribusi dalam pengamanan infrastruktur digital nasional bersama BSSN. Telah melatih lebih dari 2.000 profesional IT di bidang penetration testing dan incident response.",
        isActive: true,
        createdBy: adminUtama.id,
      },
      {
        name: "Rizky Amelia, S.T., M.T.",
        roleTitle: "Full-Stack Web Developer & Tech Lead",
        photoUrl: "https://api.dicebear.com/9.x/personas/svg?seed=rizky",
        bio: "Rizky Amelia adalah seorang Full-Stack Developer berpengalaman dengan spesialisasi di ekosistem JavaScript modern (React, Next.js, Node.js). Saat ini menjabat sebagai Tech Lead di sebuah startup fintech terkemuka. Beliau passionate dalam berbagi ilmu tentang arsitektur aplikasi web yang skalabel dan performa tinggi.",
        isActive: true,
        createdBy: adminUtama.id,
      },
      {
        name: "Hendro Wibowo, S.Kom",
        roleTitle: "Cloud Infrastructure Engineer & DevSecOps Practitioner",
        photoUrl: "https://api.dicebear.com/9.x/personas/svg?seed=hendro",
        bio: "Hendro Wibowo adalah seorang Cloud Infrastructure Engineer yang berpengalaman dalam merancang dan mengelola arsitektur cloud di AWS dan Google Cloud Platform. Memiliki sertifikasi AWS Solutions Architect Professional dan berfokus pada implementasi DevSecOps untuk mengintegrasikan keamanan dalam pipeline CI/CD.",
        isActive: true,
        createdBy: adminUtama.id,
      },
    ])
    .returning();

  console.log(`   ✅ ${insertedTrainers.length} trainer berhasil dibuat:`);
  insertedTrainers.forEach((t) =>
    console.log(`      - ${t.name} (${t.roleTitle}) | ID: ${t.id}`)
  );
  console.log();

  // ----------------------------------------------------------
  // TAHAP 5: Insert 3 Data Programs
  // ----------------------------------------------------------
  console.log("📌 [Tahap 5] Membuat data programs...");

  const insertedPrograms = await db
    .insert(programs)
    .values([
      {
        kategori: "training-of-trainer",
        title: "Training of Trainer: Cybersecurity Awareness untuk Fasilitator",
        imageUrl: "https://placehold.co/600x400/1e3a5f/ffffff?text=ToT+Cybersecurity",
        description:
          "Program intensif untuk mencetak fasilitator dan instruktur yang kompeten di bidang Cybersecurity Awareness. Peserta akan dibekali metodologi pengajaran yang efektif, materi teknis keamanan siber terkini, serta keterampilan praktis untuk melatih individu maupun organisasi dalam membangun budaya keamanan digital yang kuat.",
        isActive: true,
        createdBy: adminUtama.id,
      },
      {
        kategori: "seminar",
        title: "Seminar Nasional: Ancaman Siber 2025 & Strategi Perlindungan Data",
        imageUrl: "https://placehold.co/600x400/7c3aed/ffffff?text=Seminar+Siber",
        description:
          "Seminar nasional yang menghadirkan para pakar dan praktisi keamanan siber terkemuka untuk membahas lanskap ancaman siber terkini di tahun 2025, termasuk serangan ransomware, social engineering, dan kebocoran data. Peserta akan mendapatkan wawasan strategis tentang regulasi perlindungan data (UU PDP) dan best practice mitigasi risiko.",
        isActive: true,
        createdBy: adminUtama.id,
      },
      {
        kategori: "workshop",
        title: "Workshop Intensif: Membangun Aplikasi Web Modern dengan Next.js 15",
        imageUrl: "https://placehold.co/600x400/0f766e/ffffff?text=Workshop+Next.js",
        description:
          "Workshop hands-on selama dua hari yang dirancang untuk developer yang ingin menguasai Next.js 15 dan ekosistem React terkini. Materi mencakup App Router, Server Components, Server Actions, optimasi performa, integrasi database dengan Drizzle ORM, autentikasi, serta strategi deployment ke production menggunakan Vercel dan Docker.",
        isActive: true,
        createdBy: adminUtama.id,
      },
    ])
    .returning();

  console.log(`   ✅ ${insertedPrograms.length} program berhasil dibuat:`);
  insertedPrograms.forEach((p) =>
    console.log(`      - [${p.kategori}] ${p.title} | ID: ${p.id}`)
  );
  console.log();

  // ----------------------------------------------------------
  // TAHAP 6: Insert 3 Data Events
  // ----------------------------------------------------------
  console.log("📌 [Tahap 6] Membuat data events...");

  const insertedEvents = await db
    .insert(events)
    .values([
      {
        title: "Webinar: Pengenalan Ethical Hacking & Bug Bounty untuk Pemula",
        description:
          "Webinar gratis yang membahas dunia ethical hacking secara menyeluruh: dari dasar-dasar jaringan, tools populer (Nmap, Metasploit, Burp Suite), hingga cara memulai karir di bug bounty program. Cocok untuk mahasiswa IT, fresh graduate, dan siapa saja yang tertarik terjun ke dunia keamanan siber.",
        eventType: "webinar",
        deliveryMode: "online",
        eventDate: "2025-08-15",
        startTime: "09:00",
        endTime: "11:30",
        quota: 500,
        price: "0",
        thumbnailUrl: "https://placehold.co/800x450/1e3a5f/ffffff?text=Webinar+Ethical+Hacking",
        isPublished: true,
        createdBy: adminUtama.id,
      },
      {
        title: "Workshop: Membangun REST API Aman dengan Node.js & TypeScript",
        description:
          "Workshop intensif sehari penuh yang mengajarkan cara membangun REST API yang tidak hanya fungsional, tetapi juga aman dari ancaman OWASP Top 10. Materi mencakup autentikasi JWT, validasi input dengan Zod, rate limiting, proteksi SQL Injection, dan pengujian keamanan API dengan Postman dan OWASP ZAP.",
        eventType: "workshop",
        deliveryMode: "face_to_face",
        eventDate: "2025-09-06",
        startTime: "08:00",
        endTime: "17:00",
        quota: 40,
        price: "350000",
        thumbnailUrl: "https://placehold.co/800x450/0f766e/ffffff?text=Workshop+Node.js+API",
        isPublished: true,
        createdBy: adminUtama.id,
      },
      {
        title: "Seminar: Masa Depan AI dalam Dunia Keamanan Siber Indonesia",
        description:
          "Seminar hybrid yang mempertemukan para pemimpin industri, akademisi, dan regulator untuk mendiskusikan peran kecerdasan buatan dalam meningkatkan postur keamanan siber nasional. Topik utama meliputi AI untuk deteksi anomali, otomatisasi respons insiden, deepfake threat intelligence, dan implikasi etika penggunaan AI dalam keamanan.",
        eventType: "seminar",
        deliveryMode: "hybrid",
        eventDate: "2025-10-20",
        startTime: "13:00",
        endTime: "17:00",
        quota: 200,
        price: "150000",
        thumbnailUrl: "https://placehold.co/800x450/7c3aed/ffffff?text=Seminar+AI+%26+Cybersecurity",
        isPublished: true,
        createdBy: adminUtama.id,
      },
    ])
    .returning();

  console.log(`   ✅ ${insertedEvents.length} event berhasil dibuat:`);
  insertedEvents.forEach((e) =>
    console.log(`      - [${e.eventType}/${e.deliveryMode}] ${e.title} | ID: ${e.id}`)
  );
  console.log();

  // ----------------------------------------------------------
  // TAHAP 7: Insert 3 Data Materials
  // ----------------------------------------------------------
  console.log("📌 [Tahap 7] Membuat data materials...");

  const insertedMaterials = await db
    .insert(materials)
    .values([
      {
        title: "Panduan Lengkap: OWASP Top 10 2021 - Kerentanan Web Paling Berbahaya",
        description:
          "Dokumen PDF komprehensif yang membahas 10 risiko keamanan aplikasi web teratas versi OWASP 2021. Setiap kerentanan dijelaskan dengan contoh serangan nyata, dampak bisnis, serta rekomendasi mitigasi yang dapat langsung diimplementasikan oleh developer. Dilengkapi dengan checklist keamanan untuk code review.",
        materialType: "pdf",
        linkUrl: "https://owasp.org/www-pdf-archive/OWASP_Top_10-2017_%28en%29.pdf",
        coverUrl: "https://placehold.co/400x300/dc2626/ffffff?text=OWASP+Top+10+PDF",
        isActive: true,
        createdBy: adminUtama.id,
      },
      {
        title: "Kursus Interaktif: JavaScript Modern (ES2024) untuk Web Developer",
        description:
          "Materi kursus online interaktif yang mencakup fitur-fitur JavaScript terbaru: Optional Chaining, Nullish Coalescing, Promise.allSettled, Array grouping, dan fitur ES2024 lainnya. Setiap topik disertai dengan latihan coding langsung di browser dan kuis untuk mengukur pemahaman.",
        materialType: "url",
        linkUrl: "https://javascript.info/",
        coverUrl: "https://placehold.co/400x300/ca8a04/ffffff?text=JS+Modern+Course",
        isActive: true,
        createdBy: adminUtama.id,
      },
      {
        title: "E-Book: Panduan Praktis Penetration Testing dengan Kali Linux",
        description:
          "E-book panduan praktis penetration testing menggunakan distribusi Kali Linux. Membahas tahapan lengkap pentest: reconnaissance, scanning & enumeration, exploitation, post-exploitation, dan pelaporan. Dilengkapi dengan lab virtual menggunakan VirtualBox dan target mesin Metasploitable2 untuk latihan hands-on yang aman.",
        materialType: "pdf",
        linkUrl: "https://placehold.co/1/1/ebook-pentest-kali-linux.pdf",
        coverUrl: "https://placehold.co/400x300/166534/ffffff?text=Pentest+Kali+Linux+PDF",
        isActive: true,
        createdBy: adminUtama.id,
      },
    ])
    .returning();

  console.log(`   ✅ ${insertedMaterials.length} material berhasil dibuat:`);
  insertedMaterials.forEach((m) =>
    console.log(`      - [${m.materialType}] ${m.title} | ID: ${m.id}`)
  );
  console.log();

  // ----------------------------------------------------------
  // SELESAI
  // ----------------------------------------------------------
  console.log("============================================================");
  console.log("🎉 Seeding database berhasil diselesaikan!");
  console.log("============================================================");
  console.log("Ringkasan data yang telah dimasukkan:");
  console.log(`  👤 Admin    : 1 (${adminUtama.email})`);
  console.log(`  👥 Users    : ${insertedUsers.length}`);
  console.log(`  🤝 Partners : ${insertedPartnerships.length}`);
  console.log(`  🎓 Trainers : ${insertedTrainers.length}`);
  console.log(`  📚 Programs : ${insertedPrograms.length}`);
  console.log(`  📅 Events   : ${insertedEvents.length}`);
  console.log(`  📄 Materials: ${insertedMaterials.length}`);
  console.log("============================================================\n");
}

// ============================================================
// Jalankan seeder dan tangani error
// ============================================================
main()
  .then(() => {
    console.log("✅ Koneksi database ditutup dengan baik.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Terjadi error saat seeding:", error);
    process.exit(1);
  })
  .finally(() => {
    pool.end();
  });
