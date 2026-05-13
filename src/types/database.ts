export type EventType = "webinar" | "workshop" | "seminar" | "training";
export type DeliveryMode = "online" | "face_to_face" | "hybrid";

export type EventRow = {
  id: number;
  title: string;
  description: string | null;
  type: EventType;
  delivery: DeliveryMode;
  event_date: string;
  start_time: string | null;
  end_time: string | null;
  quota: number | null;
  price: number | null;
  thumbnail_url: string | null;
  is_published: boolean;
  created_at?: string;
};

export type EventFormValues = Omit<EventRow, "id" | "created_at">;

export type ProgramKategori =
  | "training-of-trainer"
  | "seminar"
  | "workshop"
  | "partnership";

export type ProgramRow = {
  id: number;
  title: string;
  kategori: ProgramKategori;
  image_url: string | null;
  is_active: boolean;
};

export type TrainerRow = {
  id: number;
  name: string;
  role_title: string | null;
  photo_url: string | null;
  is_active: boolean;
  created_at?: string;
};

export type MaterialRow = {
  id: number;
  title: string;
  description: string | null;
  link_url: string | null;
  cover_url: string | null;
  is_active: boolean;
  created_at?: string;
};

export type PartnerRow = {
  id: number;
  name: string;
  category: string;
  logo_url: string | null;
  is_active: boolean;
  created_at?: string;
};
