-- Chạy bổ sung trong Supabase SQL Editor nếu bảng feedbacks chưa tồn tại.
create table if not exists public.feedbacks (
  id text primary key,
  created_at timestamptz not null default now(),
  sender_name text not null,
  contact text,
  category text,
  page_name text,
  message text not null,
  image_path text,
  status text not null default 'Mới'
);
create index if not exists idx_feedbacks_created_at on public.feedbacks(created_at desc);
notify pgrst, 'reload schema';
