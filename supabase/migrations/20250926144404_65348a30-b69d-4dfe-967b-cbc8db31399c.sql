-- Create user role enum
CREATE TYPE public.user_role AS ENUM ('parent', 'child');

-- Update profiles table to include age verification and parent relationship
ALTER TABLE public.profiles 
ADD COLUMN birth_year integer,
ADD COLUMN role user_role NOT NULL DEFAULT 'child',
ADD COLUMN parent_id uuid REFERENCES public.profiles(id),
ADD COLUMN child_name text,
ADD COLUMN grade_level text;

-- Create user_roles table for role-based access
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role user_role NOT NULL,
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role user_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to get user's children
CREATE OR REPLACE FUNCTION public.get_user_children(_parent_id uuid)
RETURNS TABLE(child_id uuid, child_name text, grade_level text, user_id uuid)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.id, p.child_name, p.grade_level, p.user_id
  FROM public.profiles p
  WHERE p.parent_id = _parent_id
$$;

-- Update RLS policies for profiles to include parent access
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their profile and children" 
ON public.profiles 
FOR SELECT 
USING (
  auth.uid() = user_id OR 
  auth.uid() IN (SELECT user_id FROM public.profiles WHERE id = profiles.parent_id)
);

-- Allow parents to update their children's profiles
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their profile and children" 
ON public.profiles 
FOR UPDATE 
USING (
  auth.uid() = user_id OR 
  auth.uid() IN (SELECT user_id FROM public.profiles WHERE id = profiles.parent_id)
);

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own roles" 
ON public.user_roles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Update other tables to allow parent access to children's data
DROP POLICY IF EXISTS "Users can view their own books" ON public.books_read;
CREATE POLICY "Users can view their books and children's books" 
ON public.books_read 
FOR SELECT 
USING (
  auth.uid() = user_id OR 
  auth.uid() IN (
    SELECT p.user_id 
    FROM public.profiles p 
    WHERE p.id = (SELECT parent_id FROM public.profiles WHERE user_id = books_read.user_id)
  )
);

DROP POLICY IF EXISTS "Users can view their own reading sessions" ON public.reading_sessions;
CREATE POLICY "Users can view their sessions and children's sessions" 
ON public.reading_sessions 
FOR SELECT 
USING (
  auth.uid() = user_id OR 
  auth.uid() IN (
    SELECT p.user_id 
    FROM public.profiles p 
    WHERE p.id = (SELECT parent_id FROM public.profiles WHERE user_id = reading_sessions.user_id)
  )
);

DROP POLICY IF EXISTS "Users can view their own activities" ON public.user_activities;
CREATE POLICY "Users can view their activities and children's activities" 
ON public.user_activities 
FOR SELECT 
USING (
  auth.uid() = user_id OR 
  auth.uid() IN (
    SELECT p.user_id 
    FROM public.profiles p 
    WHERE p.id = (SELECT parent_id FROM public.profiles WHERE user_id = user_activities.user_id)
  )
);

DROP POLICY IF EXISTS "Users can view their own badges" ON public.user_badges;
CREATE POLICY "Users can view their badges and children's badges" 
ON public.user_badges 
FOR SELECT 
USING (
  auth.uid() = user_id OR 
  auth.uid() IN (
    SELECT p.user_id 
    FROM public.profiles p 
    WHERE p.id = (SELECT parent_id FROM public.profiles WHERE user_id = user_badges.user_id)
  )
);

-- Update the handle_new_user function to support roles and age verification
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
AS $$
DECLARE
  user_birth_year integer;
  user_role user_role;
  parent_user_id uuid;
BEGIN
  -- Extract data from metadata
  user_birth_year := (NEW.raw_user_meta_data ->> 'birth_year')::integer;
  user_role := COALESCE((NEW.raw_user_meta_data ->> 'role')::user_role, 'child');
  parent_user_id := (NEW.raw_user_meta_data ->> 'parent_id')::uuid;

  -- Insert into profiles
  INSERT INTO public.profiles (
    user_id, 
    display_name, 
    birth_year, 
    role,
    parent_id,
    child_name,
    grade_level
  )
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email),
    user_birth_year,
    user_role,
    CASE 
      WHEN parent_user_id IS NOT NULL THEN (
        SELECT id FROM public.profiles WHERE user_id = parent_user_id
      )
      ELSE NULL 
    END,
    NEW.raw_user_meta_data->>'child_name',
    NEW.raw_user_meta_data->>'grade_level'
  );

  -- Insert into user_roles
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, user_role);

  RETURN NEW;
END;
$$;