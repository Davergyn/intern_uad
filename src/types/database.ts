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
  isPublished: boolean;
  createdBy?: number | null;
  createdAt?: string;
  updatedAt?: string;
};

export type EventFormValues = Omit<EventRow, "id" | "createdAt" | "updatedAt" | "createdBy">;

export type MaterialRow = {
  id: number;
  title: string;
  description: string | null;
  linkUrl: string | null;
  coverUrl: string | null;
  isActive: boolean;
  createdBy?: number | null;
  createdAt?: string;
  updatedAt?: string;
};

export type TrainerRow = {
  id: number;
  name: string;
  roleTitle: string | null;
  photoUrl: string | null;
  bio: string | null;
  isActive: boolean;
  createdBy?: number | null;
  createdAt?: string;
  updatedAt?: string;
};

export type ProgramRow = {
  id: number;
  kategori: ProgramKategori;
  title: string;
  imageUrl: string | null;
  description: string | null;
  isActive: boolean;
  createdBy?: number | null;
  createdAt?: string;
  updatedAt?: string;
};

export type UserRow = {
  id: number;
  fullName: string | null;
  email: string;
  passwordHash: string;
  isActive: boolean;
  avatarUrl: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type AdminRow = {
  id: number;
  fullName: string;
  email: string;
  passwordHash: string;
  adminLevel: AdminLevel;
  isActive: boolean;
  lastLogin?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

// ============================================================================
// RELATIONSHIP/JUNCTION TABLES
// ============================================================================

export type EventRegistrationRow = {
  id: number;
  userId: number;
  eventId: number;
  status: RegistrationStatus;
  registeredAt?: string;
  attendedAt?: string | null;
  cancelledAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type UserSavedMaterialRow = {
  id: number;
  userId: number;
  materialId: number;
  savedAt?: string;
  createdAt?: string;
};

export type EventTrainerRow = {
  id: number;
  eventId: number;
  trainerId: number;
  roleInEvent: string; // e.g. "Pembicara", "Moderator"
  createdAt?: string;
  updatedAt?: string;
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
