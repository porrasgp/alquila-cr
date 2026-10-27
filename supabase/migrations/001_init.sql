-- AlquilaCR Schema

create extension if not exists "uuid-ossp";

-- Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text check (role in ('owner','tenant','admin')) not null default 'tenant',
  full_name text,
  phone text,
  verified_identity_at timestamptz,
  avatar_url text,
  reputation_score_cached numeric default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by everyone" on public.profiles
  for select using (true);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- Properties
create table if not exists public.properties (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text not null,
  price_cr numeric not null,
  currency text default 'CRC',
  province text not null,
  canton text not null,
  district text not null,
  address_details text,
  beds int default 0,
  baths int default 0,
  area_m2 numeric,
  amenities jsonb default '[]'::jsonb,
  status text check (status in ('draft','published','unpublished','rented')) default 'draft',
  lat double precision,
  lng double precision,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.properties enable row level security;

create policy "Published properties viewable by everyone" on public.properties
  for select using (status = 'published' or auth.uid() = owner_id);

create policy "Owners can insert properties" on public.properties
  for insert with check (auth.uid() = owner_id);

create policy "Owners can update own properties" on public.properties
  for update using (auth.uid() = owner_id);

create policy "Owners can delete own properties" on public.properties
  for delete using (auth.uid() = owner_id);

-- Contracts
create table if not exists public.contracts (
  id uuid primary key default uuid_generate_v4(),
  property_id uuid references public.properties(id) on delete cascade not null,
  owner_id uuid references public.profiles(id) not null,
  tenant_id uuid references public.profiles(id) not null,
  status text check (status in ('draft','pending','active','completed','cancelled','disputed')) default 'draft',
  start_date date not null,
  end_date date not null,
  rent_amount numeric not null,
  deposit_amount numeric not null,
  contract_doc_path text,
  acta_path text,
  terms_snapshot jsonb,
  verified_at timestamptz,
  owner_accepted_at timestamptz,
  tenant_accepted_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint different_parties check (owner_id <> tenant_id)
);

alter table public.contracts enable row level security;

create policy "Contracts viewable by parties" on public.contracts
  for select using (auth.uid() = owner_id or auth.uid() = tenant_id);

create policy "Parties can insert contracts" on public.contracts
  for insert with check (auth.uid() = owner_id or auth.uid() = tenant_id);

create policy "Parties can update contracts" on public.contracts
  for update using (auth.uid() = owner_id or auth.uid() = tenant_id);

-- Documents
create table if not exists public.documents (
  id uuid primary key default uuid_generate_v4(),
  contract_id uuid references public.contracts(id) on delete cascade not null,
  uploaded_by uuid references public.profiles(id) not null,
  type text check (type in ('cedula','contract','receipt','acta','other')) not null,
  storage_key text not null,
  mime_type text,
  visibility text default 'parties_only',
  uploaded_at timestamptz default now()
);

alter table public.documents enable row level security;

create policy "Documents viewable by contract parties" on public.documents
  for select using (
    exists (
      select 1 from public.contracts c
      where c.id = contract_id
      and (c.owner_id = auth.uid() or c.tenant_id = auth.uid())
    )
  );

create policy "Parties can upload documents" on public.documents
  for insert with check (
    exists (
      select 1 from public.contracts c
      where c.id = contract_id
      and (c.owner_id = auth.uid() or c.tenant_id = auth.uid())
    )
  );

-- Payments
create table if not exists public.payments (
  id uuid primary key default uuid_generate_v4(),
  contract_id uuid references public.contracts(id) on delete cascade not null,
  amount numeric not null,
  currency text default 'CRC',
  paid_at date,
  method text,
  receipt_doc_id uuid references public.documents(id),
  marked_by uuid references public.profiles(id) not null,
  status text check (status in ('pending','paid','verified','rejected')) default 'pending',
  notes text,
  created_at timestamptz default now()
);

alter table public.payments enable row level security;

create policy "Payments viewable by contract parties" on public.payments
  for select using (
    exists (
      select 1 from public.contracts c
      where c.id = contract_id
      and (c.owner_id = auth.uid() or c.tenant_id = auth.uid())
    )
  );

create policy "Parties can manage payments" on public.payments
  for all using (
    exists (
      select 1 from public.contracts c
      where c.id = contract_id
      and (c.owner_id = auth.uid() or c.tenant_id = auth.uid())
    )
  );

-- Reviews
create table if not exists public.reviews (
  id uuid primary key default uuid_generate_v4(),
  contract_id uuid references public.contracts(id) on delete cascade not null,
  author_id uuid references public.profiles(id) not null,
  target_id uuid references public.profiles(id) not null,
  type text check (type in ('tenant_to_owner','owner_to_tenant')) not null,
  rating int check (rating >= 1 and rating <= 5) not null,
  comment text not null,
  is_visible boolean default true,
  moderated_by uuid references public.profiles(id),
  moderated_at timestamptz,
  created_at timestamptz default now(),
  unique(contract_id, author_id)
);

alter table public.reviews enable row level security;

create policy "Visible reviews are public" on public.reviews
  for select using (is_visible = true);

create policy "Contract parties can insert reviews" on public.reviews
  for insert with check (
    auth.uid() = author_id and
    exists (
      select 1 from public.contracts c
      where c.id = contract_id
      and c.status = 'completed'
      and (c.owner_id = auth.uid() or c.tenant_id = auth.uid())
    )
  );

-- Reports
create table if not exists public.reports (
  id uuid primary key default uuid_generate_v4(),
  reporter_id uuid references public.profiles(id) not null,
  target_type text check (target_type in ('property','user','review','contract')) not null,
  target_id uuid not null,
  reason text not null,
  details text not null,
  status text check (status in ('open','in_review','resolved','dismissed')) default 'open',
  handled_by uuid references public.profiles(id),
  handled_at timestamptz,
  created_at timestamptz default now()
);

alter table public.reports enable row level security;

create policy "Users can create reports" on public.reports
  for insert with check (auth.uid() = reporter_id);

create policy "Users can view own reports" on public.reports
  for select using (auth.uid() = reporter_id);

-- Trigger to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
