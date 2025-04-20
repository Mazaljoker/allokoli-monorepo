create extension if not exists "uuid-ossp";

create table if not exists agents (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references users(id) on delete cascade,
    secteur_activite text,
    ton text,
    created_at timestamp with time zone default now()
);
