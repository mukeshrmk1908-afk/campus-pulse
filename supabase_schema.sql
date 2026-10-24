-- CampusPulse: Supabase Schema for Campus Helpdesk
-- Run this in your Supabase SQL Editor if connecting a live Supabase project

-- 1. Create table for campus helpdesk requests
CREATE TABLE IF NOT EXISTS public.requests (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_info TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'Medium',
  status TEXT NOT NULL DEFAULT 'Open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  timeline JSONB DEFAULT '[]'::jsonb,
  staff_notes TEXT,
  assigned_staff TEXT
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;

-- 3. Allow anonymous/public read and write for helpdesk submissions & updates (demo mode)
CREATE POLICY "Allow public read access"
  ON public.requests
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert access"
  ON public.requests
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update access"
  ON public.requests
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- 4. Create index on status, category, and created_at for fast queries
CREATE INDEX IF NOT EXISTS idx_requests_status ON public.requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_category ON public.requests(category);
CREATE INDEX IF NOT EXISTS idx_requests_created_at ON public.requests(created_at DESC);
