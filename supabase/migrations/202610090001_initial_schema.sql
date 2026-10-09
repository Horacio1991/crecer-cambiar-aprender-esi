create extension if not exists pgcrypto;

create table if not exists public.students (
  id uuid primary key,
  first_name text not null check (char_length(first_name) between 1 and 60),
  last_name text not null check (char_length(last_name) between 1 and 60),
  course text not null check (char_length(course) between 1 and 30),
  created_at timestamptz not null default now()
);

create table if not exists public.student_responses (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  activity text not null check (char_length(activity) between 1 and 160),
  response text not null check (char_length(response) between 1 and 10000),
  reviewed boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.anonymous_questions (
  id uuid primary key default gen_random_uuid(),
  question text not null check (char_length(question) between 1 and 1200),
  category text not null check (char_length(category) between 1 and 100),
  answer text not null check (char_length(answer) between 1 and 4000),
  created_at timestamptz not null default now()
);

create index if not exists student_responses_student_created_idx on public.student_responses(student_id, created_at desc);
create index if not exists students_course_idx on public.students(course);
create index if not exists anonymous_questions_created_idx on public.anonymous_questions(created_at desc);

alter table public.students enable row level security;
alter table public.student_responses enable row level security;
alter table public.anonymous_questions enable row level security;

-- Student browsers may create records but cannot read, update, or delete any records.
create policy "public can register student identity" on public.students for insert to anon
  with check (true);
create policy "public can submit activity" on public.student_responses for insert to anon
  with check (true);
create policy "public can submit anonymous questions" on public.anonymous_questions for insert to anon
  with check (true);

-- The teacher account must have app_metadata.role = 'docente'. Disable public signups.
create policy "teacher can read students" on public.students for select to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'docente');
create policy "teacher can read responses" on public.student_responses for select to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'docente');
create policy "teacher can review responses" on public.student_responses for update to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'docente')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'docente');
create policy "teacher can delete responses" on public.student_responses for delete to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'docente');
create policy "teacher can read anonymous questions" on public.anonymous_questions for select to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'docente');

grant usage on schema public to anon, authenticated;
grant insert on public.students, public.student_responses, public.anonymous_questions to anon;
grant select on public.students, public.student_responses, public.anonymous_questions to authenticated;
grant update (reviewed) on public.student_responses to authenticated;
grant delete on public.student_responses to authenticated;


-- Server-only configuration. No client role receives table privileges or policies.
create table if not exists public.app_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);
alter table public.app_settings enable row level security;
revoke all on public.app_settings from anon, authenticated;
