-- Fix infinite recursion in profiles policies
DROP POLICY IF EXISTS "Users can view their profile and children" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their profile and children" ON public.profiles;

-- Create correct policies without infinite recursion
CREATE POLICY "Users can view their profile and children" 
ON public.profiles 
FOR SELECT 
USING (
  auth.uid() = user_id OR 
  auth.uid() IN (
    SELECT p.user_id 
    FROM public.profiles p 
    WHERE p.id = profiles.parent_id
  )
);

CREATE POLICY "Users can update their profile and children" 
ON public.profiles 
FOR UPDATE 
USING (
  auth.uid() = user_id OR 
  auth.uid() IN (
    SELECT p.user_id 
    FROM public.profiles p 
    WHERE p.id = profiles.parent_id
  )
);