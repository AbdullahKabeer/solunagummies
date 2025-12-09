-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,

  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check ((select auth.uid()) = id);

create policy "Users can update own profile." on profiles
  for update using ((select auth.uid()) = id);

-- Create a table for cart items
create table cart_items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  product_id text not null,
  name text not null,
  price numeric not null,
  quantity integer not null default 1,
  image text,
  subscription boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up RLS for cart_items
alter table cart_items enable row level security;

create policy "Users can view their own cart items." on cart_items
  for select using ((select auth.uid()) = user_id);

create policy "Users can insert their own cart items." on cart_items
  for insert with check ((select auth.uid()) = user_id);

create policy "Users can update their own cart items." on cart_items
  for update using ((select auth.uid()) = user_id);

create policy "Users can delete their own cart items." on cart_items
  for delete using ((select auth.uid()) = user_id);

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
