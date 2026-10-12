create table if not exists tams_sync_snapshots (
  client_id text primary key,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

create index if not exists tams_sync_snapshots_updated_at_idx
  on tams_sync_snapshots (updated_at desc);
