import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface UserProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  birth_year: number | null;
  role: 'parent' | 'child';
  parent_id: string | null;
  child_name: string | null;
  grade_level: string | null;
  current_streak: number;
  longest_streak: number;
  books_completed: number;
  total_points: number;
}

export interface SignUpData {
  email: string;
  password: string;
  display_name: string;
  birth_year: number;
  role: 'parent' | 'child';
  parent_id?: string;
  child_name?: string;
  grade_level?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user profile
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const signUp = async (signUpData: SignUpData) => {
    try {
      const currentYear = new Date().getFullYear();
      const age = currentYear - signUpData.birth_year;

      // Age verification - must be 18+ to create parent account
      if (signUpData.role === 'parent' && age < 18) {
        return { error: { message: 'You must be 18 or older to create a parent account.' } };
      }

      // Children must have parent_id if role is child
      if (signUpData.role === 'child' && !signUpData.parent_id) {
        return { error: { message: 'Child accounts must be linked to a parent account.' } };
      }

      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email: signUpData.email,
        password: signUpData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            display_name: signUpData.display_name,
            birth_year: signUpData.birth_year,
            role: signUpData.role,
            parent_id: signUpData.parent_id,
            child_name: signUpData.child_name,
            grade_level: signUpData.grade_level
          }
        }
      });

      if (error) {
        return { error };
      }

      toast({
        title: "Account created successfully!",
        description: "Please check your email to verify your account.",
      });

      return { error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error: { message: 'An unexpected error occurred during sign up.' } };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error };
      }

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });

      return { error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: { message: 'An unexpected error occurred during sign in.' } };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast({
          title: "Error signing out",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setUser(null);
      setSession(null);
      setProfile(null);
      
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const isParent = profile?.role === 'parent';
  const isChild = profile?.role === 'child';

  return {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    isParent,
    isChild,
    fetchUserProfile,
    isAuthenticated: !!session
  };
};