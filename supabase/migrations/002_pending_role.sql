-- ============================================================
-- Add 'pending' role — new signups wait for admin approval
-- ============================================================

-- Update role check to include pending
alter table public.profiles
  drop constraint if exists profiles_role_check;

alter table public.profiles
  add constraint profiles_role_check
  check (role in ('pending', 'member', 'coach', 'admin'));

-- New users now start as pending (not member)
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
      else 'pending'
    end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
