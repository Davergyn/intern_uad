import {
  pgTable,
  serial,
  varchar,
  text,
  boolean,
  timestamp,
  integer,
  decimal,
  date,
  time,
  pgEnum,
  unique,
  jsonb,
} from "drizzle-orm/pg-core";

// ============================================================================
// ENUMS (Tipe Data Khusus)
// ============================================================================
export const eventTypeEnum = pgEnum("event_type", [
  "webinar",
  "workshop",
  "seminar",
  "training",
]);

export const deliveryModeEnum = pgEnum("delivery_mode", [
  "online",
  "face_to_face",
  "hybrid",
]);

export const programKategoriEnum = pgEnum("program_kategori", [
  "training-of-trainer",
  "seminar",
  "workshop",
]);

export const registrationStatusEnum = pgEnum("registration_status", [
  "registered",
  "attended",
  "cancelled",
]);

// ============================================================================
// TABEL: ADMINS
// ============================================================================
export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  isActive: boolean("is_active").default(true),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ============================================================================
// TABEL: USERS
// ============================================================================
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  fullName: varchar("full_name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  isActive: boolean("is_active").default(true),
  avatarUrl: varchar("avatar_url", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ============================================================================
// TABEL: EVENTS
// ============================================================================
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  eventType: eventTypeEnum("event_type").notNull(),
  deliveryMode: deliveryModeEnum("delivery_mode").notNull(),
  eventDate: date("event_date").notNull(),
  startTime: time("start_time"),
  endTime: time("end_time"),
  quota: integer("quota").default(0),
  price: decimal("price", { precision: 12, scale: 2 }).default("0"),
  thumbnailUrl: varchar("thumbnail_url", { length: 500 }),
  isPublished: boolean("is_published").default(true),
  createdBy: integer("created_by").references(() => admins.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ============================================================================
// TABEL: MATERIALS
// ============================================================================
export const materials = pgTable("materials", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  materialType: varchar("material_type", { length: 20 }).default("url"), // 'url' atau 'pdf'
  linkUrl: varchar("link_url", { length: 500 }),
  coverUrl: varchar("cover_url", { length: 500 }),
  isActive: boolean("is_active").default(true),
  attachments: jsonb("attachments").default([]), // Untuk Input Banyak File 
  createdBy: integer("created_by").references(() => admins.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ============================================================================
// TABEL: TRAINERS
// ============================================================================
export const trainers = pgTable("trainers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  roleTitle: varchar("role_title", { length: 255 }),
  photoUrl: varchar("photo_url", { length: 500 }),
  bio: text("bio"),
  isActive: boolean("is_active").default(true),
  createdBy: integer("created_by").references(() => admins.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ============================================================================
// TABEL: PROGRAMS
// ============================================================================
export const programs = pgTable("programs", {
  id: serial("id").primaryKey(),
  kategori: programKategoriEnum("kategori").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  imageUrl: varchar("image_url", { length: 500 }).notNull(),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  createdBy: integer("created_by").references(() => admins.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ============================================================================
// TABEL: PARTNERSHIPS
// ============================================================================
export const partnerships = pgTable("partnerships", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  logoUrl: varchar("logo_url", { length: 500 }).notNull(),
  createdBy: integer("created_by").references(() => admins.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ============================================================================
// TABEL: EVENT REGISTRATIONS
// ============================================================================
export const eventRegistrations = pgTable(
  "event_registrations",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    eventId: integer("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),

    status: registrationStatusEnum("status").default("registered"),

    registeredAt: timestamp("registered_at").defaultNow(),
    attendedAt: timestamp("attended_at"),
    cancelledAt: timestamp("cancelled_at"),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => ({
    unq: unique().on(t.userId, t.eventId),
  }),
);

// ============================================================================
// TABEL: USER SAVED EVENTS
// ============================================================================
export const userSavedEvents = pgTable(
  "user_saved_events",
  {
    id: serial("id").primaryKey(),

    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    eventId: integer("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),

    savedAt: timestamp("saved_at").defaultNow(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => ({
    unq: unique().on(t.userId, t.eventId),
  }),
);

// ============================================================================
// TABEL: USER SAVED MATERIALS
// ============================================================================
export const userSavedMaterials = pgTable(
  "user_saved_materials",
  {
    id: serial("id").primaryKey(),

    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    materialId: integer("material_id")
      .notNull()
      .references(() => materials.id, { onDelete: "cascade" }),

    savedAt: timestamp("saved_at").defaultNow(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => ({
    unq: unique().on(t.userId, t.materialId),
  }),
);

// ============================================================================
// TABEL: EVENT TRAINERS
// ============================================================================
export const eventTrainers = pgTable(
  "event_trainers",
  {
    id: serial("id").primaryKey(),

    eventId: integer("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),

    trainerId: integer("trainer_id")
      .notNull()
      .references(() => trainers.id, { onDelete: "cascade" }),

    roleInEvent: varchar("role_in_event", { length: 100 }).default("Pembicara"),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => ({
    unq: unique().on(t.eventId, t.trainerId),
  }),
);

// ============================================================================
// TYPES
// ============================================================================
export type Admin = typeof admins.$inferSelect;
export type NewAdmin = typeof admins.$inferInsert;

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;

export type Material = typeof materials.$inferSelect;
export type NewMaterial = typeof materials.$inferInsert;

export type Trainer = typeof trainers.$inferSelect;
export type NewTrainer = typeof trainers.$inferInsert;

export type Program = typeof programs.$inferSelect;
export type NewProgram = typeof programs.$inferInsert;

export type Partnership = typeof partnerships.$inferSelect;
export type NewPartnership = typeof partnerships.$inferInsert;

export type EventRegistration = typeof eventRegistrations.$inferSelect;
export type NewEventRegistration = typeof eventRegistrations.$inferInsert;

export type UserSavedEvent = typeof userSavedEvents.$inferSelect;
export type NewUserSavedEvent = typeof userSavedEvents.$inferInsert;

export type UserSavedMaterial = typeof userSavedMaterials.$inferSelect;
export type NewUserSavedMaterial = typeof userSavedMaterials.$inferInsert;

export type EventTrainer = typeof eventTrainers.$inferSelect;
export type NewEventTrainer = typeof eventTrainers.$inferInsert;
