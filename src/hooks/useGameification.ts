import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

export interface UserProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  total_points: number;
  current_streak: number;
  longest_streak: number;
  books_completed: number;
  created_at: string;
  updated_at: string;
}

export interface Badge {
  id: string;
  badge_type: 'first_book' | 'five_day_streak' | 'vocabulary_master' | 'question_pro' | 'week_warrior' | 'book_worm';
  earned_at: string;
}

export interface ReadingSession {
  id: string;
  session_date: string;
  minutes_read: number;
}

export const useGameification = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [readingSessions, setReadingSessions] = useState<ReadingSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchBadges();
      fetchReadingSessions();
    } else {
      setProfile(null);
      setBadges([]);
      setReadingSessions([]);
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchBadges = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setBadges(data || []);
    } catch (error) {
      console.error('Error fetching badges:', error);
    }
  };

  const fetchReadingSessions = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('reading_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('session_date', { ascending: false })
        .limit(7);

      if (error) throw error;
      setReadingSessions(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reading sessions:', error);
      setLoading(false);
    }
  };

  const awardPoints = async (activityType: 'vocabulary' | 'discussion' | 'creative', bookTitle?: string) => {
    if (!user) return;

    const pointsMap = {
      vocabulary: 10,
      discussion: 20,
      creative: 30
    };

    const points = pointsMap[activityType];

    try {
      // Add activity record
      const { error: activityError } = await supabase
        .from('user_activities')
        .insert({
          user_id: user.id,
          activity_type: activityType,
          points_earned: points,
          book_title: bookTitle
        });

      if (activityError) throw activityError;

      // Update profile points
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          total_points: (profile?.total_points || 0) + points
        })
        .eq('user_id', user.id);

      if (profileError) throw profileError;

      await fetchProfile();
      
      toast({
        title: `+${points} points earned!`,
        description: `Great work on your ${activityType} activity!`,
      });

      // Check for badge achievements
      await checkBadges();

    } catch (error) {
      console.error('Error awarding points:', error);
      toast({
        title: 'Error',
        description: 'Failed to award points. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const logReadingSession = async (minutes: number) => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];

    try {
      const { error } = await supabase
        .from('reading_sessions')
        .upsert({
          user_id: user.id,
          session_date: today,
          minutes_read: minutes
        }, {
          onConflict: 'user_id,session_date'
        });

      if (error) throw error;

      await fetchReadingSessions();
      await updateStreak();
      
      toast({
        title: 'Reading logged!',
        description: `${minutes} minutes added to today's reading.`,
      });

    } catch (error) {
      console.error('Error logging reading session:', error);
    }
  };

  const updateStreak = async () => {
    if (!user || !profile) return;

    // Calculate current streak based on reading sessions
    const sessions = await supabase
      .from('reading_sessions')
      .select('session_date')
      .eq('user_id', user.id)
      .order('session_date', { ascending: false });

    if (sessions.error) return;

    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < sessions.data.length; i++) {
      const sessionDate = new Date(sessions.data[i].session_date);
      const daysDiff = Math.floor((today.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === i) {
        streak++;
      } else {
        break;
      }
    }

    const longestStreak = Math.max(streak, profile.longest_streak);

    await supabase
      .from('profiles')
      .update({
        current_streak: streak,
        longest_streak: longestStreak
      })
      .eq('user_id', user.id);

    await fetchProfile();
  };

  const checkBadges = async () => {
    if (!user || !profile) return;

    const badgesToCheck = [
      { type: 'vocabulary_master', condition: profile.total_points >= 100 },
      { type: 'five_day_streak', condition: profile.current_streak >= 5 },
      { type: 'week_warrior', condition: profile.current_streak >= 7 }
    ];

    for (const badge of badgesToCheck) {
      if (badge.condition && !badges.some(b => b.badge_type === badge.type)) {
        await awardBadge(badge.type as Badge['badge_type']);
      }
    }
  };

  const awardBadge = async (badgeType: Badge['badge_type']) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_badges')
        .insert({
          user_id: user.id,
          badge_type: badgeType
        });

      if (error) throw error;

      await fetchBadges();
      
      toast({
        title: '🏆 Badge Earned!',
        description: `You've earned the ${badgeType.replace('_', ' ')} badge!`,
      });

    } catch (error) {
      console.error('Error awarding badge:', error);
    }
  };

  return {
    profile,
    badges,
    readingSessions,
    loading,
    awardPoints,
    logReadingSession,
    refresh: () => {
      fetchProfile();
      fetchBadges();
      fetchReadingSessions();
    }
  };
};