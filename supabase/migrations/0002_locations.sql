create table if not exists public.locations (
    id uuid default gen_random_uuid() primary key,
    incident_id uuid references public.incidents(id) on delete cascade not null,
    latitude double precision not null,
    longitude double precision not null,
    accuracy double precision,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.locations enable row level security;

create policy "Usuarios podem ver localizacoes dos seus incidentes"
    on public.locations for select
    using (
        exists (
            select 1 from public.incidents
            where incidents.id = locations.incident_id
            and incidents.user_id = auth.uid()
        )
    );

create policy "Usuarios podem inserir localizacoes nos seus incidentes"
    on public.locations for insert
    with check (
        exists (
            select 1 from public.incidents
            where incidents.id = locations.incident_id
            and incidents.user_id = auth.uid()
        )
    );

create or replace function public.log_location_to_events()
returns trigger as $$
begin
    insert into public.events (incident_id, type, description)
    values (
        new.incident_id,
        'LOCATION_UPDATED',
        concat('Localização atualizada com precisão de ', coalesce(round(new.accuracy::numeric, 1)::text, 'N/A'), 'm')
    );
    return new;
end;
$$ language plpgsql security definer;

create trigger on_location_created
    after insert on public.locations
    for each row execute procedure public.log_location_to_events();
