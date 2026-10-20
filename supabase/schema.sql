-- Supabase 대시보드 > SQL Editor 에 붙여 넣고 Run 하세요.

create table public.restaurants (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 40),
  categories text[] not null check (cardinality(categories) between 1 and 10),
  url text not null default '' check (url = '' or url ~* '^https?://'),
  created_at timestamptz not null default now()
);

alter table public.restaurants enable row level security;

-- 로그인 없이 링크를 아는 누구나 읽기/추가/수정/삭제 가능
create policy "anyone can read"   on public.restaurants for select to anon using (true);
create policy "anyone can add"    on public.restaurants for insert to anon with check (true);
create policy "anyone can edit"   on public.restaurants for update to anon using (true) with check (true);
create policy "anyone can delete" on public.restaurants for delete to anon using (true);
