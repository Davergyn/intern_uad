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

export type ProgramRow = {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  benefits: string | null;
  image_1_url: string | null;
  image_2_url: string | null;
  is_active: boolean;
  created_at?: string;
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
  thumbnail_url: string | null;
  is_active: boolean;
  created_at?: string;
};
