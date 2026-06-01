-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.admins (
  id integer NOT NULL DEFAULT nextval('admins_id_seq'::regclass),
  full_name character varying NOT NULL,
  email character varying NOT NULL UNIQUE,
  password_hash character varying NOT NULL,
  is_active boolean DEFAULT true,
  last_login timestamp without time zone,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT admins_pkey PRIMARY KEY (id)
);
CREATE TABLE public.event_registrations (
  id integer NOT NULL DEFAULT nextval('event_registrations_id_seq'::regclass),
  user_id integer NOT NULL,
  event_id integer NOT NULL,
  status USER-DEFINED DEFAULT 'registered'::registration_status,
  registered_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  attended_at timestamp without time zone,
  cancelled_at timestamp without time zone,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT event_registrations_pkey PRIMARY KEY (id),
  CONSTRAINT event_registrations_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT event_registrations_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id)
);
CREATE TABLE public.event_trainers (
  id integer NOT NULL DEFAULT nextval('event_trainers_id_seq'::regclass),
  event_id integer NOT NULL,
  trainer_id integer NOT NULL,
  role_in_event character varying DEFAULT 'Pembicara'::character varying,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT event_trainers_pkey PRIMARY KEY (id),
  CONSTRAINT event_trainers_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id),
  CONSTRAINT event_trainers_trainer_id_fkey FOREIGN KEY (trainer_id) REFERENCES public.trainers(id)
);
CREATE TABLE public.events (
  id integer NOT NULL DEFAULT nextval('events_id_seq'::regclass),
  title character varying NOT NULL,
  description text,
  event_type USER-DEFINED NOT NULL,
  delivery_mode USER-DEFINED NOT NULL,
  event_date date NOT NULL,
  start_time time without time zone,
  end_time time without time zone,
  quota integer DEFAULT 0,
  price numeric DEFAULT 0,
  thumbnail_url character varying,
  is_published boolean DEFAULT true,
  created_by integer,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT events_pkey PRIMARY KEY (id),
  CONSTRAINT events_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.admins(id)
);
CREATE TABLE public.materials (
  id integer NOT NULL DEFAULT nextval('materials_id_seq'::regclass),
  title character varying NOT NULL,
  description text,
  link_url character varying,
  cover_url character varying,
  is_active boolean DEFAULT true,
  created_by integer,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT materials_pkey PRIMARY KEY (id),
  CONSTRAINT materials_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.admins(id)
);
CREATE TABLE public.programs (
  id integer NOT NULL DEFAULT nextval('programs_id_seq'::regclass),
  kategori USER-DEFINED NOT NULL,
  title character varying NOT NULL,
  image_url character varying NOT NULL,
  description text,
  is_active boolean DEFAULT true,
  created_by integer,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT programs_pkey PRIMARY KEY (id),
  CONSTRAINT programs_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.admins(id)
);
CREATE TABLE public.trainers (
  id integer NOT NULL DEFAULT nextval('trainers_id_seq'::regclass),
  name character varying NOT NULL,
  role_title character varying,
  photo_url character varying,
  bio text,
  is_active boolean DEFAULT true,
  created_by integer,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT trainers_pkey PRIMARY KEY (id),
  CONSTRAINT trainers_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.admins(id)
);
CREATE TABLE public.user_saved_materials (
  id integer NOT NULL DEFAULT nextval('user_saved_materials_id_seq'::regclass),
  user_id integer NOT NULL,
  material_id integer NOT NULL,
  saved_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT user_saved_materials_pkey PRIMARY KEY (id),
  CONSTRAINT user_saved_materials_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT user_saved_materials_material_id_fkey FOREIGN KEY (material_id) REFERENCES public.materials(id)
);
CREATE TABLE public.users (
  id integer NOT NULL DEFAULT nextval('users_id_seq'::regclass),
  full_name character varying,
  email character varying NOT NULL UNIQUE,
  password_hash character varying NOT NULL,
  is_active boolean DEFAULT true,
  avatar_url character varying,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT users_pkey PRIMARY KEY (id)
);