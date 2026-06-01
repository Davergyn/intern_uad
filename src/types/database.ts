// Database Type Definitions
// ===========================
// Definisi tipe untuk semua entitas dari Drizzle Schema

// ============================================================================
// ENUMS
// ============================================================================
export type EventType = "webinar" | "workshop" | "seminar" | "training";
export type DeliveryMode = "online" | "face_to_face" | "hybrid";
export type ProgramKategori = "training-of-trainer" | "seminar" | "workshop" | "partnership";
export type RegistrationStatus = "registered" | "attended" | "cancelled";
export type AdminLevel = "super_admin" | "admin";

// ============================================================================
// MAIN ENTITIES
// ============================================================================

export type EventRow = {
  id: number;
  title: string;
  description: string | null;
  eventType: EventType;
  deliveryMode: DeliveryMode;
  eventDate: string; // ISO date format: YYYY-MM-DD
  startTime: string | null; // HH:MM:SS format
  endTime: string | null; // HH:MM:SS format
  quota: number | null;
  price: string | null; // decimal from database
  thumbnailUrl: string | null;
  isPublished: boolean | null;
  createdBy: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type EventFormValues = {
  title: string;
  description: string | null;
  eventType: EventType;
  deliveryMode: DeliveryMode;
  eventDate: string;
  startTime: string | null;
  endTime: string | null;
  quota: number | null;
  price: string | null;
  thumbnailUrl: string | null;
  isPublished: boolean;
};


export type MaterialRow = {
  id: number;
  title: string;
  description: string | null;
  linkUrl: string | null;
  coverUrl: string | null;
  isActive: boolean | null;
  createdBy: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type TrainerRow = {
  id: number;
  name: string;
  roleTitle: string | null;
  photoUrl: string | null;
  bio: string | null;
  isActive: boolean | null;
  createdBy: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type ProgramRow = {
  id: number;
  kategori: ProgramKategori;
  title: string;
  imageUrl: string;
  description: string | null;
  isActive: boolean | null;
  createdBy: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type UserRow = {
  id: number;
  fullName: string | null;
  email: string;
  passwordHash: string;
  isActive: boolean | null;
  avatarUrl: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type AdminRow = {
  id: number;
  fullName: string;
  email: string;
  passwordHash: string;
  adminLevel: string | null;
  isActive: boolean | null;
  lastLogin: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

// ============================================================================
// RELATIONSHIP/JUNCTION TABLES
// ============================================================================

export type EventRegistrationRow = {
  id: number;
  userId: number;
  eventId: number;
  status: RegistrationStatus | null;
  registeredAt: Date | null;
  attendedAt: Date | null;
  cancelledAt: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type UserSavedMaterialRow = {
  id: number;
  userId: number;
  materialId: number;
  savedAt: Date | null;
  createdAt: Date | null;
};

export type EventTrainerRow = {
  id: number;
  eventId: number;
  trainerId: number;
  roleInEvent: string | null; // e.g. "Pembicara", "Moderator"
  createdAt: Date | null;
  updatedAt: Date | null;
};

// ============================================================================
// COMPOSITE/VIEW TYPES (untuk joined queries)
// ============================================================================

export type EventWithTrainers = EventRow & {
  trainers?: Array<{
    id: number;
    name: string;
    role_in_event: string;
  }>;
};

export type EventRegistrationWithUser = EventRegistrationRow & {
  user?: UserRow;
};

export type EventRegistrationWithEvent = EventRegistrationRow & {
  event?: EventRow;
};
