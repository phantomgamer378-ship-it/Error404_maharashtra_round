-- 1. Profiles Table
CREATE TABLE public.profiles (
  id uuid NOT NULL REFERENCES auth.users on delete cascade,
  user_id uuid NOT NULL REFERENCES auth.users on delete cascade,
  display_name text,
  bio text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  PRIMARY KEY (id)
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- 2. Creator DNA Table
CREATE TABLE public.creator_dna (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users on delete cascade,
  niche text[] NOT NULL DEFAULT '{}',
  audience text,
  tone text,
  topics text[] NOT NULL DEFAULT '{}',
  platforms text[] NOT NULL DEFAULT '{}',
  goals text[] NOT NULL DEFAULT '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  PRIMARY KEY (id),
  UNIQUE(user_id)
);
ALTER TABLE public.creator_dna ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own dna" ON public.creator_dna FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own dna" ON public.creator_dna FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own dna" ON public.creator_dna FOR UPDATE USING (auth.uid() = user_id);
