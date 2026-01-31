-- Create testimonials table
create table if not exists public.testimonials (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text,
  description text not null,
  image_url text,
  sort_order integer default 0
);

-- Enable RLS
alter table public.testimonials enable row level security;

-- Create policies
create policy "Enable read access for all users" on public.testimonials
  for select using (true);

create policy "Enable insert for authenticated users only" on public.testimonials
  for insert with check (auth.role() = 'authenticated');

create policy "Enable update for authenticated users only" on public.testimonials
  for update using (auth.role() = 'authenticated');

create policy "Enable delete for authenticated users only" on public.testimonials
  for delete using (auth.role() = 'authenticated');

-- Add index on sort_order
create index if not exists testimonials_sort_order_idx on public.testimonials (sort_order);
