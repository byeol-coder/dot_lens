-- Deaf Spirit FC Attendance Hub - Supabase SQL draft
-- MVP currently uses localStorage. These tables mirror the current TypeScript types
-- so repositories can later swap localStorage helpers for Supabase queries.

create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  nickname text default '',
  jersey_number text default '',
  position text not null default 'MF',
  profile_image text default '',
  phone text default '',
  join_date date not null default current_date,
  status text not null default 'active' check (status in ('active', 'new', 'resting', 'left')),
  memo text default '',
  first_attendance_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.attendance_sessions (
  id uuid primary key default gen_random_uuid(),
  session_date date not null,
  location text not null check (location in ('동작구 노들구장', '신사 풋살장', '광명 풋살장', '기타', '대회', '연습')),
  memo text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (session_date, location)
);

create table if not exists public.attendance_records (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.attendance_sessions(id) on delete cascade,
  member_id uuid not null references public.members(id) on delete cascade,
  status text not null check (status in ('present', 'late', 'absent', 'excused', 'trial')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (session_id, member_id)
);

create index if not exists idx_members_status on public.members(status);
create index if not exists idx_members_position on public.members(position);
create index if not exists idx_attendance_sessions_date on public.attendance_sessions(session_date);
create index if not exists idx_attendance_records_member on public.attendance_records(member_id);

-- Suggested RLS later:
-- alter table public.members enable row level security;
-- alter table public.attendance_sessions enable row level security;
-- alter table public.attendance_records enable row level security;
-- Add team_id and role-based policies before production multi-team use.
