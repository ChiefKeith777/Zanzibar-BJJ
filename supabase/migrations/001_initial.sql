-- ============================================================
-- Zanzibar BJJ — initial schema
-- Run in Supabase SQL editor or via supabase db push
-- ============================================================

-- profiles (one row per auth user)
create table if not exists public.profiles (
  id          uuid references auth.users on delete cascade primary key,
  email       text unique not null,
  name        text,
  phone       text,
  role        text not null default 'member'
                check (role in ('member', 'coach', 'admin')),
  location    text,
  program     text,
  emergency   text,
  joined_date date default current_date,
  created_at  timestamptz default now()
);

-- members (extended data, one row per member profile)
create table if not exists public.members (
  id                   uuid references public.profiles(id) on delete cascade primary key,
  fee_amount           integer default 30000,
  due_date             date,
  status               text default 'active'
                         check (status in ('active', 'due', 'overdue', 'suspended')),
  belt                 text default 'White Belt',
  stripes              integer default 0,
  sessions_this_month  integer default 0,
  updated_at           timestamptz default now()
);

-- attendance
create table if not exists public.attendance (
  id           uuid default gen_random_uuid() primary key,
  member_id    uuid references public.profiles(id) on delete cascade,
  class_date   date not null default current_date,
  location     text,
  class_type   text,
  created_at   timestamptz default now()
);

-- payments
create table if not exists public.payments (
  id          uuid default gen_random_uuid() primary key,
  member_id   uuid references public.profiles(id) on delete cascade,
  amount      integer not null,
  method      text,
  paid_date   date default current_date,
  status      text default 'paid' check (status in ('paid', 'pending', 'failed')),
  created_at  timestamptz default now()
);

-- curriculum (admin builds, coaches read)
create table if not exists public.curriculum (
  id          uuid default gen_random_uuid() primary key,
  program     text not null check (program in ('fundamentals', 'kids', 'competition')),
  week        integer not null,
  theme       text not null,
  points      jsonb default '[]'::jsonb,
  video_url   text,
  updated_at  timestamptz default now(),
  updated_by  uuid references public.profiles(id),
  unique (program, week)
);

-- site_content (key-value store for editable site text)
create table if not exists public.site_content (
  key         text primary key,
  value       text,
  updated_at  timestamptz default now(),
  updated_by  uuid references public.profiles(id)
);

-- schedule (class times per location)
create table if not exists public.schedule (
  id          uuid default gen_random_uuid() primary key,
  location    text not null,
  day         text not null,
  time        text not null,
  class_type  text not null,
  program     text,
  updated_at  timestamptz default now()
);

-- bookings (contact form submissions)
create table if not exists public.bookings (
  id          uuid default gen_random_uuid() primary key,
  name        text not null,
  phone       text not null,
  location    text,
  program     text,
  kid_name    text,
  kid_age     text,
  kid_exp     text,
  news_opt_in boolean default false,
  status      text default 'new'
                check (status in ('new', 'contacted', 'enrolled', 'declined')),
  notes       text,
  created_at  timestamptz default now()
);

-- beach signups
create table if not exists public.beach_signups (
  id          uuid default gen_random_uuid() primary key,
  name        text not null,
  phone       text not null,
  created_at  timestamptz default now()
);

-- notification log
create table if not exists public.notification_log (
  id          uuid default gen_random_uuid() primary key,
  channel     text,
  text        text,
  member_id   uuid references public.profiles(id),
  sent_at     timestamptz default now()
);

-- alert rules
create table if not exists public.alert_rules (
  id            uuid default gen_random_uuid() primary key,
  trigger_key   text unique not null,
  label         text not null,
  note          text,
  email_enabled boolean default true,
  wa_enabled    boolean default true,
  tone          text default '#00A3DD'
);

-- ============================================================
-- Row Level Security
-- ============================================================

alter table public.profiles        enable row level security;
alter table public.members         enable row level security;
alter table public.attendance      enable row level security;
alter table public.payments        enable row level security;
alter table public.curriculum      enable row level security;
alter table public.site_content    enable row level security;
alter table public.schedule        enable row level security;
alter table public.bookings        enable row level security;
alter table public.beach_signups   enable row level security;
alter table public.notification_log enable row level security;
alter table public.alert_rules     enable row level security;

-- helper: get role without recursion
create or replace function public.get_my_role()
returns text language sql stable security definer
as $$ select role from public.profiles where id = auth.uid() $$;

-- profiles
create policy "users read own profile"       on public.profiles for select using (auth.uid() = id);
create policy "users update own profile"     on public.profiles for update using (auth.uid() = id);
create policy "admins read all profiles"     on public.profiles for select using (public.get_my_role() = 'admin');
create policy "admins update all profiles"   on public.profiles for update using (public.get_my_role() = 'admin');
create policy "admins insert profiles"       on public.profiles for insert with check (public.get_my_role() = 'admin');

-- members
create policy "members read own"             on public.members for select using (auth.uid() = id);
create policy "members update own"           on public.members for update using (auth.uid() = id);
create policy "admins full members"          on public.members for all using (public.get_my_role() = 'admin');

-- attendance
create policy "members read own attendance"  on public.attendance for select using (auth.uid() = member_id);
create policy "admins full attendance"       on public.attendance for all using (public.get_my_role() = 'admin');
create policy "coaches read attendance"      on public.attendance for select using (public.get_my_role() = 'coach');

-- payments
create policy "members read own payments"    on public.payments for select using (auth.uid() = member_id);
create policy "admins full payments"         on public.payments for all using (public.get_my_role() = 'admin');

-- curriculum (coaches + admins read; admins write)
create policy "coaches read curriculum"      on public.curriculum for select using (public.get_my_role() in ('coach', 'admin', 'member'));
create policy "admins write curriculum"      on public.curriculum for all using (public.get_my_role() = 'admin');

-- site_content (public read; admins write)
create policy "public read content"          on public.site_content for select using (true);
create policy "admins write content"         on public.site_content for all using (public.get_my_role() = 'admin');

-- schedule (public read; admins write)
create policy "public read schedule"         on public.schedule for select using (true);
create policy "admins write schedule"        on public.schedule for all using (public.get_my_role() = 'admin');

-- bookings (public insert; admins read/update)
create policy "public insert bookings"       on public.bookings for insert with check (true);
create policy "admins full bookings"         on public.bookings for all using (public.get_my_role() = 'admin');

-- beach signups (public insert; admins read)
create policy "public insert beach"          on public.beach_signups for insert with check (true);
create policy "admins read beach"            on public.beach_signups for select using (public.get_my_role() = 'admin');

-- notification log (admins only)
create policy "admins full notif"            on public.notification_log for all using (public.get_my_role() = 'admin');

-- alert rules (public read; admins write)
create policy "public read rules"            on public.alert_rules for select using (true);
create policy "admins write rules"           on public.alert_rules for all using (public.get_my_role() = 'admin');

-- ============================================================
-- Auto-create profile on signup
-- ============================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    case
      when new.email = current_setting('app.admin_email', true) then 'admin'
      else 'member'
    end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- Seed data
-- ============================================================

-- Site content defaults
insert into public.site_content (key, value) values
  ('banner', 'Karibu — first class free for locals · kids & adults · 4 locations'),
  ('whatsapp', '+255 628 031 317'),
  ('email', 'zanzibarbjj@gmail.com'),
  ('instagram', '@zanzibarbjj')
on conflict (key) do nothing;

-- Schedule
insert into public.schedule (location, day, time, class_type, program) values
  ('Stone Town',  'MON', '18:00', 'Adults',  'Adults BJJ'),
  ('Stone Town',  'WED', '18:00', 'Adults',  'Adults BJJ'),
  ('Stone Town',  'FRI', '18:00', 'Adults',  'Adults BJJ'),
  ('Stone Town',  'SAT', '09:00', 'Kids',    'Kids Program'),
  ('Kiwengwa',    'TUE', '18:00', 'Adults',  'Adults BJJ'),
  ('Kiwengwa',    'THU', '18:00', 'Adults',  'Adults BJJ'),
  ('Kiwengwa',    'SUN', '10:00', 'Family',  'Family'),
  ('Jambiani',    'MON', '17:30', 'Adults',  'Adults BJJ'),
  ('Jambiani',    'WED', '17:30', 'Adults',  'Adults BJJ')
on conflict do nothing;

-- Curriculum seed
insert into public.curriculum (program, week, theme, points) values
  ('fundamentals', 1, 'Positional Awareness',   '["Mount and guard — basic positions","How to fall safely","Posture in closed guard"]'),
  ('fundamentals', 2, 'Guard Work',              '["Closed guard attacks: armbar, triangle setup","Hip escape (shrimp)","Basic guard retention"]'),
  ('fundamentals', 3, 'Passing the Guard',       '["Torreando pass","Knee slice","Dealing with grips"]'),
  ('fundamentals', 4, 'Side Control & Mount',    '["Side control to mount transition","Americana and Kimura from mount","Upa escape"]'),
  ('fundamentals', 5, 'Back Control',            '["Taking the back","Rear naked choke finish","Defending the back take"]'),
  ('fundamentals', 6, 'Takedowns',               '["Double leg","Single leg","Clinch work"]'),
  ('fundamentals', 7, 'Leg Locks (beginner)',    '["Straight ankle lock","Defending the ankle lock","Heel hook awareness"]'),
  ('fundamentals', 8, 'Review & Assessment',     '["Positional sparring review","Drilling test","Open mat Q&A"]'),
  ('kids',         1, 'Mat Rules & Safety',      '["Falling safely","Tap out protocol","Partner respect"]'),
  ('kids',         2, 'Movement Games',          '["Shrimping race","Bear crawl","Break-fall fun"]'),
  ('kids',         3, 'Guard & Mount',           '["What is guard?","Mount position","Simple escape"]'),
  ('kids',         4, 'Submissions (safe)',      '["Armbar from guard (slow drill)","Triangle awareness","Tap early lesson"]'),
  ('competition',  1, 'Competition Rules',       '["Points system","Advantages","Prohibited techniques by belt"]'),
  ('competition',  2, 'Guard Under Pressure',    '["Framing against passes","Hip movement drills","Lasso and spider guard basics"]'),
  ('competition',  3, 'Submission Chains',       '["Arm triangle to back take","Kimura trap series","Ankle lock entry from leg drag"]'),
  ('competition',  4, 'Competition Prep',        '["Match simulation","Weight management tips","Mental prep and warm-up routine"]')
on conflict (program, week) do nothing;

-- Alert rules
insert into public.alert_rules (trigger_key, label, note, email_enabled, wa_enabled, tone) values
  ('due7',    'Payment due in 7 days',              'Friendly reminder with the amount and how to pay.',                                    true, true, '#FCD116'),
  ('due0',    'Payment due today',                  'Final reminder on the due date.',                                                      true, true, '#e08a1e'),
  ('late3',   'Overdue by 3 days — account suspended', 'Member is notified that access is paused until payment clears.',                    true, true, '#c0392b'),
  ('welcome', 'New booking received',               'Confirmation to the member, alert to the coach at that location.',                     true, true, '#00A3DD')
on conflict (trigger_key) do nothing;
