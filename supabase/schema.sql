create table if not exists cards (
  id bigserial primary key,
  user_id text not null,
  name text not null,
  condition text not null,
  qty integer not null default 1,
  cost numeric not null default 0,
  market numeric not null default 0,
  source text not null default 'Other',
  created_at timestamptz not null default now()
);

create index if not exists cards_user_id_idx on cards (user_id);
