-- Drop the problematic policies
DROP POLICY IF EXISTS "Users can view their profile and children" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their profile and children" ON public.profiles;

-- Create a security definer function to check parent-child relationships
CREATE OR REPLACE FUNCTION public.get_accessible_profile_user_ids(_user_id uuid)
RETURNS TABLE(user_id uuid)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  -- Return the user's own ID and any children's user_ids
  SELECT _user_id AS user_id
  UNION
  SELECT p.user_id
  FROM public.profiles p
  WHERE p.parent_id IN (
    SELECT id FROM public.profiles WHERE user_id = _user_id
  );
$$;

-- Create new policies using the security definer function
CREATE POLICY "Users can view their profile and children" 
ON public.profiles 
FOR SELECT 
USING (
  user_id IN (
    SELECT get_accessible_profile_user_ids.user_id 
    FROM public.get_accessible_profile_user_ids(auth.uid())
  )
);

CREATE POLICY "Users can update their profile and children" 
ON public.profiles 
FOR UPDATE 
USING (
  user_id IN (
    SELECT get_accessible_profile_user_ids.user_id 
    FROM public.get_accessible_profile_user_ids(auth.uid())
  )
);