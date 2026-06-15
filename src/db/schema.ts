import { 
  pgTable, serial, varchar, text, boolean, timestamp, 
  integer, decimal, date, time, pgEnum, unique, 
} from 'drizzle-orm/pg-core';

// ============================================================================
// 1. ENUMS (Tipe Data Khusus)
// ============================================================================
export const eventTypeEnum = pgEnum('event_type', ['webinar', 'workshop', 'seminar', 'training']);
export const deliveryModeEnum = pgEnum('delivery_mode', ['online', 'face_to_face', 'hybrid']);
export const programKategoriEnum = pgEnum('program_kategori', ['training-of-trainer', 'seminar', 'workshop']);
export const registrationStatusEnum = pgEnum('registration_status', ['registered', 'attended', 'cancelled']);
export const materialTypeEnum = pgEnum('material_type_enum', ['pdf', 'link']);
export const partnershipKategoriEnum = pgEnum('partnership_kategori', ['instansi', 'registrar', 'akademisi', 'komunitas']);

// ============================================================================
// 2. TABEL ADMIN DAN USER
// ============================================================================
export const admins = pgTable('admins', {
  id: serial('id').primaryKey(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  adminLevel: varchar('admin_level', { length: 50 }).default('super_admin'),
  isActive: boolean('is_active').default(true),
  lastLogin: timestamp('last_login'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  fullName: varchar('full_name', { length: 255 }),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  isActive: boolean('is_active').default(true),
  avatarUrl: varchar('avatar_url', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ============================================================================
// 3. TABEL PROGRAM, TRAINER, MATERI, DAN PARTNERSHIP
// ============================================================================
export const programs = pgTable('programs', {
  id: serial('id').primaryKey(),
  kategori: programKategoriEnum('kategori').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  imageUrl: varchar('image_url', { length: 500 }).notNull(),
  description: text('description'),
  isActive: boolean('is_active').default(true),
  createdBy: integer('created_by').references(() => admins.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const trainers = pgTable('trainers', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  roleTitle: varchar('role_title', { length: 255 }), 
  photoUrl: varchar('photo_url', { length: 500 }),
  deskripsi: text('deskripsi'),
  isActive: boolean('is_active').default(true),
  spesialisasi: text('spesialisasi'), 
  createdBy: integer('created_by').references(() => admins.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const materials = pgTable('materials', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  linkUrl: varchar('link_url', { length: 500 }), 
  coverUrl: varchar('cover_url', { length: 500 }),
  isActive: boolean('is_active').default(true),
  materialType: text("material_type").default("multipack"), 
  attachments: text("attachments"),
  createdBy: integer('created_by').references(() => admins.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const partnerships = pgTable('partnerships', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(), 
  kategori: partnershipKategoriEnum('kategori').notNull(), // <-- KOLOM BARU YANG DIALOKASIKAN
  imageUrl: varchar('image_url', { length: 500 }),     
  description: text('description'),                   
  isActive: boolean('is_active').default(true),
  createdBy: integer('created_by').references(() => admins.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ============================================================================
// 4. TABEL TURUNAN (Bergantung pada 'programs', 'materials', dll)
// ============================================================================
export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  eventType: eventTypeEnum('event_type').notNull(),
  deliveryMode: deliveryModeEnum('delivery_mode').notNull(),
  eventDate: date('event_date').notNull(),
  startTime: time('start_time'),
  endTime: time('end_time'),
  quota: integer('quota').default(0),
  price: decimal('price', { precision: 12, scale: 2 }).default('0'),
  thumbnailUrl: varchar('thumbnail_url', { length: 500 }),
  isPublished: boolean('is_published').default(true),
  
  // Relasi aman karena 'programs' sudah dibuat di atasnya
  programId: integer('program_id').references(() => programs.id, { onDelete: 'cascade' }),
  createdBy: integer('created_by').references(() => admins.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const materialLinks = pgTable('material_links', {
  id: serial('id').primaryKey(),
  materialId: integer('material_id').notNull().references(() => materials.id, { onDelete: 'cascade' }),
  type: materialTypeEnum('type').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  url: text('url').notNull(),
});

// ============================================================================
// 5. TABEL PENGHUBUNG
// ============================================================================
export const eventRegistrations = pgTable('event_registrations', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  eventId: integer('event_id').notNull().references(() => events.id, { onDelete: 'cascade' }),
  status: registrationStatusEnum('status').default('registered'),
  registeredAt: timestamp('registered_at').defaultNow(),
  attendedAt: timestamp('attended_at'),
  cancelledAt: timestamp('cancelled_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (t) => ({
  unq: unique().on(t.userId, t.eventId),
}));

export const userSavedMaterials = pgTable('user_saved_materials', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  materialId: integer('material_id').notNull().references(() => materials.id, { onDelete: 'cascade' }),
  savedAt: timestamp('saved_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
}, (t) => ({
  unq: unique().on(t.userId, t.materialId),
}));

export const eventTrainers = pgTable('event_trainers', {
  id: serial('id').primaryKey(),
  eventId: integer('event_id').notNull().references(() => events.id, { onDelete: 'cascade' }),
  trainerId: integer('trainer_id').notNull().references(() => trainers.id, { onDelete: 'cascade' }), 
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (t) => ({
  unq: unique().on(t.eventId, t.trainerId),
}));

// >>> TAMBAHAN BARU: 1. Tabel untuk fitur Simpan/Bookmark Event <<<
export const userSavedEvents = pgTable('user_saved_events', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  eventId: integer('event_id').notNull().references(() => events.id, { onDelete: 'cascade' }),
  savedAt: timestamp('saved_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
}, (t) => ({
  unq: unique().on(t.userId, t.eventId), // Mencegah user klik simpan 2x di event yang sama
}));

// >>> TAMBAHAN BARU: 3. Tabel untuk menghubungkan Materi ke dalam Event tertentu <<<
export const eventMaterials = pgTable('event_materials', {
  id: serial('id').primaryKey(),
  eventId: integer('event_id').notNull().references(() => events.id, { onDelete: 'cascade' }),
  materialId: integer('material_id').notNull().references(() => materials.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow(),
}, (t) => ({
  unq: unique().on(t.eventId, t.materialId), // Mencegah materi yang sama dimasukkan 2x ke event yang sama
}));