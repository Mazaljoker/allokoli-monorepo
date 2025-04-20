-- Active l’extension uuid-ossp pour la génération d’UUID si ce n’est pas déjà fait
create extension if not exists "uuid-ossp";

create table public.messages (
  id uuid primary key default uuid_generate_v4(),
  call_id uuid not null references public.calls(id) on delete cascade,
  role text not null check (role in ('user', 'agent')),
  content text not null,
  langue text not null,
  timestamp timestamp with time zone not null,
  audio_url text,
  token_count integer,
  created_at timestamp with time zone not null default now()
);
