-- ----------------------------------------------------------------
-- Kova Sun Shade · Journal posts schema
--
-- Run this once in the Supabase SQL editor for the project that
-- VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY point at. It creates the
-- `posts` table the journal reads from and turns on RLS so the public
-- anon key can only read posts that are explicitly published.
--
-- To author posts, use the Supabase dashboard (Table editor → posts)
-- or the service_role key. The anon key — the one the website uses —
-- can read but not write.
-- ----------------------------------------------------------------

create table if not exists public.posts (
  slug            text primary key,
  title           text not null,
  excerpt         text,
  body_md         text not null,
  cover_image_url text,
  author          text default 'Kova Sun Shade',
  published_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Index the listing query: published posts, newest first.
create index if not exists posts_published_at_idx
  on public.posts (published_at desc)
  where published_at is not null;

-- Touch updated_at on every UPDATE.
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists posts_touch_updated_at on public.posts;
create trigger posts_touch_updated_at
  before update on public.posts
  for each row execute function public.touch_updated_at();

-- Row-level security: anon may SELECT published posts only.
alter table public.posts enable row level security;

drop policy if exists "anon reads published posts" on public.posts;
create policy "anon reads published posts"
  on public.posts
  for select
  to anon
  using (
    published_at is not null
    and published_at <= now()
  );

-- Optional seed — a placeholder post so the journal index isn't empty
-- on first deploy. Remove or edit freely.
insert into public.posts (slug, title, excerpt, body_md, published_at)
values (
  'welcome-to-the-journal',
  'Welcome to the journal.',
  'A quiet running record of what we ship, what we learn, and what we change our minds about.',
  $$We started Kova Sun Shade because the showroom mark-up never sat right with us. Every quote we asked for in KL came back with a number that had been padded three or four times on its way down the chain.

This journal is where we'll write that out. Material studies, install notes, the occasional opinion. No release schedule — only when we have something to say.

If you want to be notified when there's a new entry, [send us a note](/#contact).$$,
  now()
)
on conflict (slug) do nothing;
