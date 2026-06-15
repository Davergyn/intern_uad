/**
 * ============================================================
 * DATABASE SEEDER - academy.id
 * ============================================================
 * Cara menjalankan:
 *   1. Pastikan script berikut ada di package.json:
 *        "seed": "tsx src/db/seed.ts"
 *   2. Jalankan perintah:
 *        pnpm seed
 *      atau:
 *        npx tsx src/db/seed.ts
 *
 * Pastikan variabel lingkungan DATABASE_URL sudah diset
 * di file .env.local sebelum menjalankan seeder ini.
 *
 * ⚠️  PERINGATAN: Script ini akan INSERT data baru ke database.
 *     Pastikan database kosong atau gunakan ON CONFLICT jika
 *     menjalankan ulang untuk menghindari duplikasi.
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
  console.log("🚀 Memulai proses seeding database academy.id...\n");

  // ----------------------------------------------------------
  // TAHAP 1: Insert Admin Utama
  // ----------------------------------------------------------
  console.log("📌 [Tahap 1] Membuat admin utama...");

  const passwordHashAdmin = await bcrypt.hash("AcademyId@2026!", 12);

  const [adminUtama] = await db
    .insert(admins)
    .values({
      fullName: "Super Administrator .id Academy",
      email: "admin@academy.id",
      passwordHash: passwordHashAdmin,
      isActive: true,
    })
    .returning();

  console.log(
    `   ✅ Admin berhasil dibuat: ${adminUtama.email} (ID: ${adminUtama.id})\n`
  );

  // ----------------------------------------------------------
  // TAHAP 2: Insert 3 Demo Users (Peserta Representative)
  // ----------------------------------------------------------
  console.log("📌 [Tahap 2] Membuat akun demo peserta...");

  const passwordHashUser = await bcrypt.hash("Peserta@2026!", 12);

  const insertedUsers = await db
    .insert(users)
    .values([
      {
        fullName: "Fajar Nugroho",
        email: "fajar.nugroho@demo.academy.id",
        passwordHash: passwordHashUser,
        isActive: true,
        avatarUrl:
          "https://api.dicebear.com/9.x/avataaars/svg?seed=fajar&backgroundColor=b6e3f4",
      },
      {
        fullName: "Anisa Pratiwi",
        email: "anisa.pratiwi@demo.academy.id",
        passwordHash: passwordHashUser,
        isActive: true,
        avatarUrl:
          "https://api.dicebear.com/9.x/avataaars/svg?seed=anisa&backgroundColor=ffdfbf",
      },
      {
        fullName: "Dimas Aditya Pratama",
        email: "dimas.aditya@demo.academy.id",
        passwordHash: passwordHashUser,
        isActive: true,
        avatarUrl:
          "https://api.dicebear.com/9.x/avataaars/svg?seed=dimas&backgroundColor=c0aede",
      },
    ])
    .returning();

  console.log(`   ✅ ${insertedUsers.length} akun demo berhasil dibuat:`);
  insertedUsers.forEach((u) =>
    console.log(`      - ${u.fullName} (${u.email}) | ID: ${u.id}`)
  );
  console.log();

  // ----------------------------------------------------------
  // TAHAP 3: Insert 6 Data Partnerships (Semua 4 Kategori)
  // ----------------------------------------------------------
  console.log("📌 [Tahap 3] Membuat data mitra strategis...");

  const insertedPartnerships = await db
    .insert(partnerships)
    .values([
      // ── Kategori: Instansi Pemerintah ──
      {
        name: "Kementerian Komunikasi dan Digital RI",
        kategori: "instansi",
        imageUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Logo_Kemkominfo.svg/240px-Logo_Kemkominfo.svg.png",
        description:
          "Kementerian Komunikasi dan Digital RI (Komdigi) adalah mitra strategis .id Academy dalam mendorong literasi digital nasional dan pengembangan ekosistem internet Indonesia.",
        isActive: true,
        createdBy: adminUtama.id,
      },
      {
        name: "BSSN – Badan Siber dan Sandi Negara",
        kategori: "instansi",
        imageUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Logo_BSSN.svg/240px-Logo_BSSN.svg.png",
        description:
          "Badan Siber dan Sandi Negara (BSSN) berkolaborasi dengan .id Academy untuk memperkuat kapasitas keamanan siber nasional melalui program pelatihan bersertifikat.",
        isActive: true,
        createdBy: adminUtama.id,
      },
      // ── Kategori: Registrar Domain .id ──
      {
        name: "PANDI – Pengelola Nama Domain Internet Indonesia",
        kategori: "registrar",
        imageUrl:
          "https://pandi.id/wp-content/uploads/2021/09/Logo-PANDI-150x150-1.png",
        description:
          "PANDI adalah otoritas pengelola nama domain .id di Indonesia dan induk organisasi dari .id Academy. Kolaborasi ini menjamin kualitas konten dan relevansi program pelatihan dengan kebutuhan industri domain nasional.",
        isActive: true,
        createdBy: adminUtama.id,
      },
      // ── Kategori: Akademisi & Perguruan Tinggi ──
      {
        name: "Universitas Ahmad Dahlan Yogyakarta",
        kategori: "akademisi",
        imageUrl:
          "https://uad.ac.id/wp-content/uploads/logo-uad-biru.png",
        description:
          "Universitas Ahmad Dahlan (UAD) bermitra dengan .id Academy dalam penyelenggaraan program Training of Trainer dan sertifikasi kompetensi digital bagi civitas akademika.",
        isActive: true,
        createdBy: adminUtama.id,
      },
      {
        name: "Institut Teknologi Bandung",
        kategori: "akademisi",
        imageUrl:
          "https://upload.wikimedia.org/wikipedia/id/thumb/5/57/Logo_ITB.svg/240px-Logo_ITB.svg.png",
        description:
          "Institut Teknologi Bandung (ITB) berkolaborasi dalam penyusunan kurikulum berbasis riset untuk program Cybersecurity dan Cloud Computing di .id Academy.",
        isActive: true,
        createdBy: adminUtama.id,
      },
      // ── Kategori: Komunitas Teknologi ──
      {
        name: "GDG (Google Developer Groups) Indonesia",
        kategori: "komunitas",
        imageUrl:
          "https://developers.google.com/static/community/gdg/images/gdg-logo.png",
        description:
          "Google Developer Groups (GDG) Indonesia bermitra dengan .id Academy untuk menyelenggarakan workshop teknologi Google Cloud, Flutter, dan Firebase kepada komunitas developer Indonesia.",
        isActive: true,
        createdBy: adminUtama.id,
      },
    ])
    .returning();

  console.log(
    `   ✅ ${insertedPartnerships.length} mitra strategis berhasil dibuat:`
  );
  insertedPartnerships.forEach((p) =>
    console.log(`      - [${p.kategori}] ${p.name} | ID: ${p.id}`)
  );
  console.log();

  // ----------------------------------------------------------
  // TAHAP 4: Insert 5 Data Trainers (Pakar IT Indonesia)
  // ----------------------------------------------------------
  console.log("📌 [Tahap 4] Membuat data trainer profesional...");

  const insertedTrainers = await db
    .insert(trainers)
    .values([
      {
        name: "Dr. Ir. Pratama Dahlian Persadha, M.Kom",
        photoUrl:
          "https://api.dicebear.com/9.x/personas/svg?seed=pratama&backgroundColor=b6e3f4",
        deskripsi:
          "Dr. Pratama adalah pakar keamanan siber dan kriptografi terkemuka di Indonesia, serta mantan Kepala Laboratorium Sandi di Lembaga Sandi Negara (kini BSSN). Beliau memiliki pengalaman lebih dari 20 tahun di bidang keamanan informasi, pernah menjabat sebagai Kepala Divisi CSIRT di institusi pemerintahan, dan aktif sebagai narasumber di forum keamanan siber internasional seperti APCERT dan FIRST. Doktor di bidang Kriptografi dari Universitas Gadjah Mada ini merupakan penulis buku 'Keamanan Siber untuk Pemangku Kepentingan' yang digunakan sebagai referensi nasional.",
        spesialisasi:
          "Kriptografi, Keamanan Siber Nasional, CSIRT, Kebijakan Siber, Forensik Digital",
        isActive: true,
        createdBy: adminUtama.id,
      },
      {
        name: "Reza Ervani, S.T., M.T., CEH, OSCP",
        photoUrl:
          "https://api.dicebear.com/9.x/personas/svg?seed=reza&backgroundColor=ffdfbf",
        deskripsi:
          "Reza Ervani adalah seorang Penetration Tester dan Bug Hunter berpengalaman dengan sertifikasi internasional CEH (Certified Ethical Hacker) dan OSCP (Offensive Security Certified Professional). Selama lebih dari 12 tahun, beliau telah membantu ratusan perusahaan BUMN, perbankan, dan fintech di Indonesia mengidentifikasi dan menutup celah keamanan kritis. Aktif sebagai kontributor OWASP Indonesia Chapter dan pembicara di acara-acara keamanan seperti Hack in The Box dan CyberSecurity Indonesia.",
        spesialisasi:
          "Penetration Testing, Bug Bounty, Red Team, OWASP, Keamanan Aplikasi Web",
        isActive: true,
        createdBy: adminUtama.id,
      },
      {
        name: "Aulia Rachman, S.Kom., M.T.I.",
        photoUrl:
          "https://api.dicebear.com/9.x/personas/svg?seed=aulia&backgroundColor=c0aede",
        deskripsi:
          "Aulia Rachman adalah seorang Software Architect dan Full-Stack Engineer dengan spesialisasi ekosistem TypeScript modern. Berpengalaman lebih dari 10 tahun membangun sistem berskala besar untuk perusahaan teknologi nasional, beliau pernah menjadi Principal Engineer di salah satu unicorn fintech Indonesia. Saat ini memimpin tim engineering di perusahaan SaaS B2B dan aktif berbagi pengetahuan melalui konten teknis tentang arsitektur microservices, Next.js, dan database design. Dikenal sebagai salah satu kontributor aktif komunitas React Indonesia.",
        spesialisasi:
          "Next.js, TypeScript, System Architecture, PostgreSQL, Microservices, Docker",
        isActive: true,
        createdBy: adminUtama.id,
      },
      {
        name: "Dewi Kusuma Wardani, S.T., M.Sc., AWS-SAP",
        photoUrl:
          "https://api.dicebear.com/9.x/personas/svg?seed=dewi&backgroundColor=d1d4f9",
        deskripsi:
          "Dewi Kusuma adalah Cloud Solutions Architect bersertifikat AWS Solutions Architect – Professional (AWS-SAP) dan Google Cloud Professional Cloud Architect. Sebelumnya menjabat sebagai Head of Cloud Infrastructure di perusahaan telekomunikasi nasional, kini beliau memimpin tim DevOps di sebuah perusahaan multinasional. Memiliki rekam jejak dalam merancang dan memigrasi infrastruktur on-premise ke cloud hybrid di skala enterprise, dengan total kapasitas workload lebih dari 10.000 container yang dikelola secara aktif.",
        spesialisasi:
          "AWS, Google Cloud, Kubernetes, Terraform, DevSecOps, Cloud Migration",
        isActive: true,
        createdBy: adminUtama.id,
      },
      {
        name: "Andi Wahyu Setiawan, S.Kom., M.Kom.",
        photoUrl:
          "https://api.dicebear.com/9.x/personas/svg?seed=andi&backgroundColor=b6e3f4",
        deskripsi:
          "Andi Wahyu adalah praktisi dan edukator Technology Policy dengan fokus pada tata kelola nama domain, regulasi ICANN, dan pengembangan ekosistem internet di Asia Tenggara. Aktif sebagai perwakilan Indonesia di forum-forum ICANN, APNIC, dan ISOC, beliau berpengalaman dalam menyusun kebijakan teknis pengelolaan domain ccTLD .id dan melatih lebih dari 500 registrar serta reseller domain di seluruh Indonesia. Meraih gelar Master di bidang Teknologi Informasi dari Universitas Indonesia dengan tesis fokus pada keamanan infrastruktur DNS.",
        spesialisasi:
          "Domain .id, DNS, Kebijakan Internet, ICANN, Tata Kelola Internet",
        isActive: true,
        createdBy: adminUtama.id,
      },
    ])
    .returning();

  console.log(`   ✅ ${insertedTrainers.length} trainer berhasil dibuat:`);
  insertedTrainers.forEach((t) =>
    console.log(`      - ${t.name} | ID: ${t.id}`)
  );
  console.log();

  // ----------------------------------------------------------
  // TAHAP 5: Insert 3 Data Programs (Premium IT Academy)
  // ----------------------------------------------------------
  console.log("📌 [Tahap 5] Membuat data program pelatihan...");

  const insertedPrograms = await db
    .insert(programs)
    .values([
      {
        kategori: "training-of-trainer",
        title:
          "Training of Trainer: Mencetak Fasilitator Literasi Digital Bersertifikat .id Academy",
        imageUrl:
          "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80",
        description:
          "Program flagship .id Academy yang dirancang untuk mencetak para fasilitator literasi digital profesional yang siap mengajar di instansi pemerintah, perguruan tinggi, dan korporasi. Peserta akan menguasai metodologi andragogi, teknik fasilitasi efektif, modul kurikulum literasi digital berbasis kompetensi SKKNI, serta strategi mengelola komunitas belajar. Lulusan program ini akan mendapatkan sertifikat resmi yang diakui PANDI dan menjadi bagian dari jaringan trainer .id Academy di seluruh Indonesia.",
        isActive: true,
        createdBy: adminUtama.id,
      },
      {
        kategori: "seminar",
        title:
          "Seminar Nasional: Keamanan Domain & Identitas Digital Indonesia di Era AI Generatif",
        imageUrl:
          "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
        description:
          "Forum diskusi tingkat nasional yang menghadirkan pemimpin industri, regulator, akademisi, dan pakar teknologi untuk membahas tantangan dan peluang keamanan domain .id serta identitas digital Indonesia di tengah gelombang AI Generatif. Agenda mencakup paparan riset terbaru tentang ancaman domain spoofing, strategi perlindungan nama domain .id untuk UMKM dan korporasi, dampak deepfake terhadap kepercayaan identitas digital, serta roadmap kebijakan keamanan siber nasional 2026–2030.",
        isActive: true,
        createdBy: adminUtama.id,
      },
      {
        kategori: "workshop",
        title:
          "Workshop Intensif: Membangun Aplikasi Full-Stack Aman dengan Next.js 16 & TypeScript",
        imageUrl:
          "https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=800&q=80",
        description:
          "Workshop hands-on dua hari yang dirancang bagi developer dan software engineer yang ingin menguasai pengembangan aplikasi web modern yang cepat, aman, dan production-ready. Materi mencakup arsitektur App Router Next.js 16, React Server Components & Server Actions, pengelolaan state server dengan TanStack Query, autentikasi berbasis JWT dan OAuth 2.0, proteksi API dari OWASP Top 10, integrasi PostgreSQL dengan Drizzle ORM, serta strategi deployment Zero-Downtime ke Vercel dan VPS menggunakan GitHub Actions CI/CD.",
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
  // TAHAP 6: Insert 5 Data Events (Past + Upcoming 2026)
  // ----------------------------------------------------------
  console.log("📌 [Tahap 6] Membuat data event (past + upcoming)...");

  const insertedEvents = await db
    .insert(events)
    .values([
      // ── Past Events (sudah berlalu) ──
      {
        title:
          "Webinar: Mengenal DNSSEC – Pilar Keamanan Infrastruktur Domain .id",
        description:
          "Webinar teknis yang membahas secara mendalam tentang DNS Security Extensions (DNSSEC) sebagai mekanisme kriptografi untuk melindungi integritas data DNS. Peserta akan memahami bagaimana DNSSEC bekerja, ancaman yang dimitigasi (DNS spoofing, cache poisoning), serta panduan teknis implementasi DNSSEC pada domain .id mulai dari pembuatan key pair hingga proses signing dan validasi. Materi disampaikan oleh tim teknis PANDI dengan studi kasus nyata dari infrastruktur DNS nasional.",
        eventType: "webinar",
        deliveryMode: "online",
        eventDate: "2026-02-19",
        startTime: "09:00",
        endTime: "11:30",
        quota: 750,
        price: "0",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
        isPublished: true,
        createdBy: adminUtama.id,
      },
      {
        title:
          "Seminar: UU Perlindungan Data Pribadi (PDP) – Implikasi Hukum & Teknis bagi Pengelola Domain",
        description:
          "Seminar setengah hari yang mengulas implementasi Undang-Undang Perlindungan Data Pribadi (UU PDP No. 27/2022) dari perspektif hukum dan teknis, khususnya bagi registrar domain, pengelola hosting, dan operator infrastruktur internet. Pembicara dari Komdigi, praktisi hukum teknologi, dan konsultan keamanan siber akan membahas kewajiban data controller, mekanisme consent, prosedur breach notification, serta sanksi hukum yang perlu diantisipasi industri domain .id.",
        eventType: "seminar",
        deliveryMode: "hybrid",
        eventDate: "2026-03-28",
        startTime: "13:00",
        endTime: "17:00",
        quota: 350,
        price: "175000",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80",
        isPublished: true,
        createdBy: adminUtama.id,
      },
      {
        title:
          "Workshop: Ethical Hacking & Penetration Testing – Dari Reconnaissance hingga Reporting",
        description:
          "Workshop intensif dua hari yang membawa peserta melalui siklus penuh penetration testing profesional menggunakan metodologi PTES (Penetration Testing Execution Standard) dan OWASP Testing Guide. Materi hands-on mencakup: OSINT dan reconnaissance, vulnerability scanning dengan Nessus dan OpenVAS, eksploitasi kerentanan web (SQLi, XSS, SSRF, IDOR), privilege escalation, lateral movement, serta teknik menyusun laporan pentest yang komprehensif dan actionable. Setiap peserta akan praktik di lingkungan lab virtual yang disiapkan khusus.",
        eventType: "workshop",
        deliveryMode: "face_to_face",
        eventDate: "2026-04-12",
        startTime: "08:00",
        endTime: "17:00",
        quota: 35,
        price: "850000",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&q=80",
        isPublished: true,
        createdBy: adminUtama.id,
      },
      // ── Upcoming Events (akan datang) ──
      {
        title:
          "Training of Trainer Angkatan VIII: Fasilitator Literasi Digital untuk Instansi Pemerintah",
        description:
          "Program Training of Trainer Angkatan VIII yang dirancang khusus bagi ASN, tenaga pendidik, dan staf teknis instansi pemerintah yang ditunjuk menjadi Champion Digital Literacy di unit kerjanya. Program berlangsung selama 3 hari intensif mencakup: metodologi pengajaran andragogi, desain kurikulum berbasis kompetensi, teknik fasilitasi interaktif, pengembangan modul e-learning, serta micro-teaching dengan umpan balik langsung dari master trainer .id Academy. Peserta yang lulus evaluasi akan mendapatkan Sertifikat Fasilitator Literasi Digital resmi dari PANDI.",
        eventType: "training",
        deliveryMode: "face_to_face",
        eventDate: "2026-08-04",
        startTime: "08:00",
        endTime: "17:00",
        quota: 50,
        price: "1250000",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80",
        isPublished: true,
        createdBy: adminUtama.id,
      },
      {
        title:
          "Webinar: Cloud Security Essentials – Mengamankan Workload di AWS & Google Cloud",
        description:
          "Webinar teknis 3 jam yang membekali developer, DevOps engineer, dan tim IT dengan praktik terbaik keamanan cloud yang langsung dapat diterapkan. Topik meliputi: model shared responsibility cloud, Identity & Access Management (IAM) best practices, enkripsi data at-rest dan in-transit, konfigurasi Security Group dan VPC, pemantauan ancaman dengan AWS GuardDuty dan Google Security Command Center, serta simulasi incident response di lingkungan cloud. Cocok untuk tim yang sedang dalam proses migrasi ke cloud atau sudah beroperasi dan ingin meningkatkan postur keamanannya.",
        eventType: "webinar",
        deliveryMode: "online",
        eventDate: "2026-09-16",
        startTime: "14:00",
        endTime: "17:00",
        quota: 500,
        price: "0",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
        isPublished: true,
        createdBy: adminUtama.id,
      },
    ])
    .returning();

  console.log(`   ✅ ${insertedEvents.length} event berhasil dibuat:`);
  insertedEvents.forEach((e) =>
    console.log(
      `      - [${e.eventType}/${e.deliveryMode}] ${e.eventDate} | ${e.title} | ID: ${e.id}`
    )
  );
  console.log();

  // ----------------------------------------------------------
  // TAHAP 7: Insert 5 Data Materials (Referensi & Dokumentasi)
  // ----------------------------------------------------------
  console.log("📌 [Tahap 7] Membuat data materi pembelajaran...");

  const insertedMaterials = await db
    .insert(materials)
    .values([
      {
        title: "OWASP Top 10 – 2021: Referensi Kerentanan Aplikasi Web Teratas",
        description:
          "Dokumen resmi dari OWASP (Open Web Application Security Project) yang memetakan 10 risiko keamanan aplikasi web paling kritis versi 2021. Setiap item mencakup deskripsi ancaman, contoh skenario serangan nyata, dampak bisnis, serta panduan pencegahan yang terstruktur. Wajib dibaca oleh setiap developer, security engineer, dan arsitek perangkat lunak sebelum membangun atau mengaudit sistem web.",
        materialType: "url",
        linkUrl: "https://owasp.org/Top10/",
        coverUrl:
          "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&q=80",
        isActive: true,
        createdBy: adminUtama.id,
      },
      {
        title:
          "Dokumentasi Resmi Next.js – App Router, Server Components & Actions",
        description:
          "Dokumentasi lengkap dan resmi Next.js untuk memahami arsitektur modern berbasis App Router. Mencakup konsep fundamental React Server Components, pola data fetching dengan async/await, Server Actions untuk mutasi data, optimasi gambar dan font, strategi caching, serta panduan deployment ke Vercel dan platform lain. Menjadi referensi utama peserta workshop Full-Stack Development di .id Academy.",
        materialType: "url",
        linkUrl: "https://nextjs.org/docs",
        coverUrl:
          "https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=600&q=80",
        isActive: true,
        createdBy: adminUtama.id,
      },
      {
        title:
          "NIST Cybersecurity Framework 2.0 – Panduan Tata Kelola Keamanan Siber",
        description:
          "Panduan komprehensif dari National Institute of Standards and Technology (NIST) versi 2.0 yang menyediakan kerangka kerja tata kelola keamanan siber berbasis risiko yang dapat diadaptasi oleh organisasi dari berbagai sektor. Framework ini mencakup 6 fungsi utama: GOVERN, IDENTIFY, PROTECT, DETECT, RESPOND, dan RECOVER. Digunakan sebagai referensi standar dalam program pelatihan Cybersecurity .id Academy.",
        materialType: "pdf",
        linkUrl: "https://nvlpubs.nist.gov/nistpubs/CSWP/NIST.CSWP.29.pdf",
        coverUrl:
          "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=600&q=80",
        isActive: true,
        createdBy: adminUtama.id,
      },
      {
        title:
          "The Modern JavaScript Tutorial – javascript.info (Bahasa Inggris)",
        description:
          "Referensi belajar JavaScript paling komprehensif dan terkini yang tersedia secara gratis. Materi mencakup JavaScript dari dasar (tipe data, fungsi, scope, closures) hingga topik lanjutan (Promise, async/await, Generator, Proxy, Web APIs). Setiap bab dilengkapi dengan penjelasan mendalam, contoh kode yang bisa dijalankan langsung di browser, dan latihan soal untuk mengukur pemahaman. Menjadi buku pegangan wajib peserta program Full-Stack Development.",
        materialType: "url",
        linkUrl: "https://javascript.info/",
        coverUrl:
          "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=600&q=80",
        isActive: true,
        createdBy: adminUtama.id,
      },
      {
        title:
          "AWS Well-Architected Framework – Pilar Keamanan Cloud (Security Pillar)",
        description:
          "Dokumen resmi dari Amazon Web Services yang menjabarkan praktik terbaik dalam merancang sistem cloud yang aman sesuai pilar Security dari AWS Well-Architected Framework. Materi mencakup prinsip desain keamanan cloud, manajemen identitas dan akses (IAM), keamanan lapisan infrastruktur, perlindungan data, deteksi ancaman, dan kesiapan respons insiden. Menjadi referensi inti dalam modul Cloud Security di program pelatihan .id Academy.",
        materialType: "url",
        linkUrl:
          "https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/welcome.html",
        coverUrl:
          "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80",
        isActive: true,
        createdBy: adminUtama.id,
      },
    ])
    .returning();

  console.log(
    `   ✅ ${insertedMaterials.length} materi pembelajaran berhasil dibuat:`
  );
  insertedMaterials.forEach((m) =>
    console.log(`      - [${m.materialType}] ${m.title} | ID: ${m.id}`)
  );
  console.log();

  // ----------------------------------------------------------
  // SELESAI
  // ----------------------------------------------------------
  console.log(
    "============================================================"
  );
  console.log("🎉 Seeding database academy.id berhasil diselesaikan!");
  console.log(
    "============================================================"
  );
  console.log("📊 Ringkasan data master yang telah dimasukkan:");
  console.log(`  👤 Admin      : 1 (${adminUtama.email})`);
  console.log(`  👥 Demo Users : ${insertedUsers.length}`);
  console.log(`  🤝 Partnerships: ${insertedPartnerships.length}`);
  console.log(`  🎓 Trainers   : ${insertedTrainers.length}`);
  console.log(`  📚 Programs   : ${insertedPrograms.length}`);
  console.log(
    `  📅 Events     : ${insertedEvents.length} (3 past, 2 upcoming)`
  );
  console.log(`  📄 Materials  : ${insertedMaterials.length}`);
  console.log(
    "============================================================\n"
  );
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
