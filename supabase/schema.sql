-- ============================================================
-- Zapphi — Supabase Schema
-- AI Learning App for Zapphira, Grade 3 Philippines
-- Run this in Supabase SQL Editor
-- ============================================================

create extension if not exists "uuid-ossp";

-- Topic progress tracking
create table if not exists topic_progress (
  id            uuid primary key default uuid_generate_v4(),
  profile_name  text not null,
  subject_id    text not null,
  topic_id      text not null,
  stars         int not null default 0 check (stars between 0 and 3),
  best_score    int not null default 0,
  times_attempted int not null default 0,
  completed     boolean not null default false,
  last_attempted timestamptz not null default now(),
  created_at    timestamptz not null default now(),
  unique(profile_name, subject_id, topic_id)
);

-- Quiz sessions
create table if not exists quiz_sessions (
  id            uuid primary key default uuid_generate_v4(),
  profile_name  text not null,
  subject_id    text not null,
  topic_id      text not null,
  score         int not null default 0,
  total_questions int not null default 5,
  stars_earned  int not null default 0,
  mode          text not null default 'multiple_choice',
  created_at    timestamptz not null default now()
);

-- Achievements / badges earned
create table if not exists achievements (
  id            uuid primary key default uuid_generate_v4(),
  profile_name  text not null,
  badge_id      text not null,
  earned_at     timestamptz not null default now(),
  unique(profile_name, badge_id)
);

-- Daily sessions (for parent tracking)
create table if not exists daily_sessions (
  id            uuid primary key default uuid_generate_v4(),
  profile_name  text not null,
  session_date  date not null default current_date,
  total_minutes int not null default 0,
  subjects_used text[] not null default '{}',
  stars_earned  int not null default 0,
  created_at    timestamptz not null default now(),
  unique(profile_name, session_date)
);

-- RLS — public access (family app, no auth needed)
alter table topic_progress enable row level security;
alter table quiz_sessions enable row level security;
alter table achievements enable row level security;
alter table daily_sessions enable row level security;

create policy "Anyone can read/write topic_progress" on topic_progress for all using (true) with check (true);
create policy "Anyone can read/write quiz_sessions" on quiz_sessions for all using (true) with check (true);
create policy "Anyone can read/write achievements" on achievements for all using (true) with check (true);
create policy "Anyone can read/write daily_sessions" on daily_sessions for all using (true) with check (true);

-- Indexes
create index if not exists topic_progress_profile_idx on topic_progress(profile_name);
create index if not exists quiz_sessions_profile_idx on quiz_sessions(profile_name);
create index if not exists achievements_profile_idx on achievements(profile_name);
create index if not exists daily_sessions_profile_date_idx on daily_sessions(profile_name, session_date);

-- Enable realtime for progress updates
alter publication supabase_realtime add table topic_progress;
