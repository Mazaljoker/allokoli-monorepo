create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  nom_complet text not null,
  langue text not null,
  has_consented boolean not null default false,
  role text,
  created_at timestamp with time zone not null default now()
);
