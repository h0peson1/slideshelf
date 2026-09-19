-- =========================================================
-- SlideShelf — Supabase Database & Storage Setup
-- =========================================================
-- Run this script in the Supabase Dashboard -> SQL Editor

-- 1. Create Users Table
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY DEFAULT ('usr_' || substr(md5(random()::text), 1, 16)),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'STUDENT' CHECK (role IN ('STUDENT', 'COURSE_REP')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Create Courses Table
CREATE TABLE IF NOT EXISTS public.courses (
  id TEXT PRIMARY KEY DEFAULT ('c_' || substr(md5(random()::text), 1, 16)),
  code TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  level INT NOT NULL CHECK (level IN (100, 200, 300, 400)),
  semester INT NOT NULL CHECK (semester IN (1, 2)),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_courses_level_sem ON public.courses (level, semester);

-- 3. Create Slides Table
CREATE TABLE IF NOT EXISTS public.slides (
  id TEXT PRIMARY KEY DEFAULT ('s_' || substr(md5(random()::text), 1, 16)),
  course_id TEXT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  week INT NOT NULL CHECK (week >= 1 AND week <= 16),
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('PDF', 'PPT', 'PPTX')),
  file_size TEXT NOT NULL,
  file_size_bytes BIGINT NOT NULL,
  storage_path TEXT NOT NULL,
  uploaded_by_id TEXT NOT NULL REFERENCES public.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_slides_course_week ON public.slides (course_id, week);
CREATE INDEX IF NOT EXISTS idx_slides_uploaded_by ON public.slides (uploaded_by_id);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slides ENABLE ROW LEVEL SECURITY;

-- Allow service-role (backend) full access
CREATE POLICY "Service Role Full Access Users" ON public.users FOR ALL USING (true);
CREATE POLICY "Service Role Full Access Courses" ON public.courses FOR ALL USING (true);
CREATE POLICY "Service Role Full Access Slides" ON public.slides FOR ALL USING (true);

-- 5. Storage Bucket Creation (Private Bucket: lecture-slides)
-- You can create this through the Supabase Dashboard -> Storage -> New Bucket ('lecture-slides', Private),
-- or run the following:
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'lecture-slides',
  'lecture-slides',
  false, -- private bucket
  52428800, -- 50MB
  ARRAY['application/pdf', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/octet-stream']
)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: Restrict direct client access so signed URLs must be used
CREATE POLICY "Service Role Storage Access" ON storage.objects
FOR ALL USING (bucket_id = 'lecture-slides');

-- 6. Initial Seed Data (Users & Courses)
-- Default passwords are: password123 (bcrypt hashed)
INSERT INTO public.users (id, name, email, password_hash, role)
VALUES
  ('usr_rep_1', 'Alex Vance (Course Rep)', 'rep@university.edu', '$2b$10$tZ2zVqZkH3c1eG8gP0yVb.Jm8w/4QpUfxz5lX5I0uK0h5JzQ7/9i.', 'COURSE_REP'),
  ('usr_stu_1', 'Sam Jordan', 'student@university.edu', '$2b$10$tZ2zVqZkH3c1eG8gP0yVb.Jm8w/4QpUfxz5lX5I0uK0h5JzQ7/9i.', 'STUDENT')
ON CONFLICT (email) DO NOTHING;

INSERT INTO public.courses (id, code, title, level, semester)
VALUES
  ('c_cs201', 'CS 201', 'Data Structures', 200, 1),
  ('c_cs205', 'CS 205', 'Database Systems', 200, 1),
  ('c_cs214', 'CS 214', 'Computer Networks', 200, 2),
  ('c_cs101', 'CS 101', 'Introduction to Computing', 100, 1),
  ('c_cs110', 'CS 110', 'Programming Fundamentals', 100, 2),
  ('c_cs301', 'CS 301', 'Operating Systems', 300, 1),
  ('c_cs320', 'CS 320', 'Software Engineering', 300, 2),
  ('c_cs410', 'CS 410', 'Distributed Systems', 400, 1)
ON CONFLICT (code) DO NOTHING;
