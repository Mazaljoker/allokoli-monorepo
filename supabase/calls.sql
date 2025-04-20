-- Active l’extension uuid-ossp pour la génération d’UUID si ce n’est pas déjà fait
create extension if not exists "uuid-ossp";

create table public.calls (
  id uuid primary key default uuid_generate_v4(),
  agent_id uuid not null references public.agents(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  langue text not null,
  started_at timestamp with time zone,
  ended_at timestamp with time zone,
  duration_sec integer,
  audio_url text,
  transcript text,
  status text check (status in ('completed', 'missed', 'failed')),
  source text check (source in ('inbound', 'outbound')),
  created_at timestamp with time zone not null default now()
);
