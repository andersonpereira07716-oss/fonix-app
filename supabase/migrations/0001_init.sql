-- ============================================================
-- FÔNIX — Schema do banco de dados (Fase 2)
-- Cole este script inteiro no SQL Editor do Supabase e execute.
-- Idempotente: pode rodar mais de uma vez sem quebrar.
-- ============================================================

create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- 1. profiles — um registro por usuário autenticado
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  plan text not null default 'FREE' check (plan in ('FREE','PREMIUM','FAMILIA','EMPRESA')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Cria automaticamente um profile quando um usuário se cadastra no Supabase Auth
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ------------------------------------------------------------
-- 2. devices — dispositivos cadastrados por cada usuário
-- ------------------------------------------------------------
create table if not exists public.devices (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  brand text,
  model text,
  os text check (os in ('Android','iOS','Desconhecido')) default 'Desconhecido',
  protection_enabled boolean not null default true,
  battery_level int check (battery_level between 0 and 100),
  connection_status text not null default 'DESCONHECIDO'
    check (connection_status in ('ONLINE','OFFLINE','DESCONHECIDO')),
  last_sync_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_devices_owner on public.devices(owner_id);

-- ------------------------------------------------------------
-- 3. locations — pontos de localização reportados por um dispositivo
-- ------------------------------------------------------------
create table if not exists public.locations (
  id uuid primary key default gen_random_uuid(),
  device_id uuid not null references public.devices(id) on delete cascade,
  latitude double precision,
  longitude double precision,
  accuracy_meters double precision,
  captured_at timestamptz not null default now()
);

create index if not exists idx_locations_device on public.locations(device_id, captured_at desc);

-- ------------------------------------------------------------
-- 4. device_events — linha do tempo de segurança
-- ------------------------------------------------------------
create table if not exists public.device_events (
  id uuid primary key default gen_random_uuid(),
  device_id uuid not null references public.devices(id) on delete cascade,
  type text not null check (type in ('NORMAL','ATENCAO','CRITICO','SISTEMA')),
  description text not null,
  location_id uuid references public.locations(id) on delete set null,
  occurred_at timestamptz not null default now()
);

create index if not exists idx_events_device on public.device_events(device_id, occurred_at desc);

-- ------------------------------------------------------------
-- 5. incidents — ocorrências do Modo Fênix
-- ------------------------------------------------------------
create table if not exists public.incidents (
  id uuid primary key default gen_random_uuid(),
  device_id uuid not null references public.devices(id) on delete cascade,
  status text not null default 'NORMAL'
    check (status in ('NORMAL','PERDIDO','ROUBADO','RECUPERADO')),
  opened_at timestamptz not null default now(),
  closed_at timestamptz,
  recovered boolean
);

create index if not exists idx_incidents_device on public.incidents(device_id, opened_at desc);

-- ------------------------------------------------------------
-- 6. recovery_contacts — contato exibido em caso de perda/roubo
-- ------------------------------------------------------------
create table if not exists public.recovery_contacts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  phone text not null,
  message text,
  created_at timestamptz not null default now()
);

create index if not exists idx_recovery_contacts_owner on public.recovery_contacts(owner_id);

-- ------------------------------------------------------------
-- 7. notifications — central de notificações do usuário
-- ------------------------------------------------------------
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_notifications_owner on public.notifications(owner_id, created_at desc);

-- ------------------------------------------------------------
-- 8. subscriptions — plano ativo do usuário (sem pagamento real no MVP)
-- ------------------------------------------------------------
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  plan text not null check (plan in ('FREE','PREMIUM','FAMILIA','EMPRESA')),
  status text not null default 'active' check (status in ('active','canceled','past_due')),
  started_at timestamptz not null default now(),
  ends_at timestamptz
);

create index if not exists idx_subscriptions_owner on public.subscriptions(owner_id);

-- ------------------------------------------------------------
-- 9. security_logs — auditoria interna (login, ativação de proteção etc.)
-- ------------------------------------------------------------
create table if not exists public.security_logs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  action text not null,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_security_logs_owner on public.security_logs(owner_id, created_at desc);

-- ============================================================
-- ROW LEVEL SECURITY
-- Regra geral: um usuário só acessa os próprios dados.
-- Para tabelas ligadas a devices (locations, device_events, incidents),
-- a checagem passa pelo owner_id do dispositivo.
-- ============================================================

alter table public.profiles enable row level security;
alter table public.devices enable row level security;
alter table public.locations enable row level security;
alter table public.device_events enable row level security;
alter table public.incidents enable row level security;
alter table public.recovery_contacts enable row level security;
alter table public.notifications enable row level security;
alter table public.subscriptions enable row level security;
alter table public.security_logs enable row level security;

-- profiles
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- devices
drop policy if exists "devices_all_own" on public.devices;
create policy "devices_all_own" on public.devices
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- locations (via device.owner_id)
drop policy if exists "locations_all_own" on public.locations;
create policy "locations_all_own" on public.locations
  for all using (
    exists (select 1 from public.devices d where d.id = device_id and d.owner_id = auth.uid())
  ) with check (
    exists (select 1 from public.devices d where d.id = device_id and d.owner_id = auth.uid())
  );

-- device_events (via device.owner_id)
drop policy if exists "events_all_own" on public.device_events;
create policy "events_all_own" on public.device_events
  for all using (
    exists (select 1 from public.devices d where d.id = device_id and d.owner_id = auth.uid())
  ) with check (
    exists (select 1 from public.devices d where d.id = device_id and d.owner_id = auth.uid())
  );

-- incidents (via device.owner_id)
drop policy if exists "incidents_all_own" on public.incidents;
create policy "incidents_all_own" on public.incidents
  for all using (
    exists (select 1 from public.devices d where d.id = device_id and d.owner_id = auth.uid())
  ) with check (
    exists (select 1 from public.devices d where d.id = device_id and d.owner_id = auth.uid())
  );

-- recovery_contacts
drop policy if exists "recovery_contacts_all_own" on public.recovery_contacts;
create policy "recovery_contacts_all_own" on public.recovery_contacts
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- notifications
drop policy if exists "notifications_all_own" on public.notifications;
create policy "notifications_all_own" on public.notifications
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- subscriptions
drop policy if exists "subscriptions_all_own" on public.subscriptions;
create policy "subscriptions_all_own" on public.subscriptions
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- security_logs
drop policy if exists "security_logs_all_own" on public.security_logs;
create policy "security_logs_all_own" on public.security_logs
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- ============================================================
-- Fim do script.
-- Depois de rodar: Authentication > Providers > confirme que Email
-- está habilitado, e Authentication > URL Configuration > adicione
-- o endereço do seu app (ex: http://localhost:5173) em Redirect URLs.
-- ============================================================
