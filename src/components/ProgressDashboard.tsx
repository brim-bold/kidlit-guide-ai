import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGameification } from '@/hooks/useGameification';
import { Trophy, Flame, BookOpen, Calendar, Star } from 'lucide-react';

const badgeInfo = {
  first_book: { icon: '📚', name: 'First Book', description: 'Complete your first book' },
  five_day_streak: { icon: '🔥', name: '5 Day Streak', description: 'Read for 5 days in a row' },
  vocabulary_master: { icon: '📖', name: 'Vocabulary Master', description: 'Earn 100+ points' },
  question_pro: { icon: '❓', name: 'Question Pro', description: 'Answer 10 discussion questions' },
  week_warrior: { icon: '⭐', name: 'Week Warrior', description: 'Read for 7 days straight' },
  book_worm: { icon: '🐛', name: 'Book Worm', description: 'Complete 5 books' }
};

const ProgressDashboard = () => {
  const { profile, badges, readingSessions, loading } = useGameification();

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6 text-center text-gray-500">
        Please sign in to view your progress dashboard.
      </div>
    );
  }

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  return (
    <div className="p-6 space-y-6 bg-bg-cream min-h-screen">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-learning-blue">Your Progress Dashboard</h1>
        <p className="text-foreground/70">Track your reading journey and achievements</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Total Points</CardTitle>
            <Trophy className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800">{profile.total_points}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">Current Streak</CardTitle>
            <Flame className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-800">
              🔥 {profile.current_streak} days
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Books Completed</CardTitle>
            <BookOpen className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800">{profile.books_completed}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Longest Streak</CardTitle>
            <Star className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-800">{profile.longest_streak} days</div>
          </CardContent>
        </Card>
      </div>

      {/* Reading Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-learning-blue">
            <Calendar className="w-5 h-5" />
            7-Day Reading Calendar
          </CardTitle>
          <CardDescription>Your reading activity over the past week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {last7Days.map(date => {
              const session = readingSessions.find(s => s.session_date === date);
              const isToday = date === new Date().toISOString().split('T')[0];
              const dayName = new Date(date).toLocaleDateString('en', { weekday: 'short' });
              
              return (
                <div key={date} className="text-center space-y-2">
                  <div className="text-xs text-gray-600">{dayName}</div>
                  <div 
                    className={`w-12 h-12 rounded-lg flex items-center justify-center text-sm font-medium ${
                      session 
                        ? 'bg-green-100 text-green-800 border-2 border-green-300' 
                        : isToday 
                          ? 'bg-gray-100 border-2 border-gray-300 text-gray-500'
                          : 'bg-gray-50 text-gray-400'
                    }`}
                  >
                    {session ? '✅' : isToday ? '📖' : '⭕'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {session ? `${session.minutes_read}m` : '0m'}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Badges Collection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-learning-blue">
            <Trophy className="w-5 h-5" />
            Badge Collection
          </CardTitle>
          <CardDescription>Your achievements and progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(badgeInfo).map(([type, info]) => {
              const earned = badges.some(b => b.badge_type === type);
              return (
                <div
                  key={type}
                  className={`p-4 rounded-lg border-2 text-center space-y-2 transition-all ${
                    earned 
                      ? 'bg-yellow-50 border-yellow-300 shadow-md' 
                      : 'bg-gray-50 border-gray-200 opacity-60'
                  }`}
                >
                  <div className="text-3xl">{info.icon}</div>
                  <div className="font-semibold text-sm text-learning-blue">{info.name}</div>
                  <div className="text-xs text-gray-600">{info.description}</div>
                  {earned && (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      Earned!
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressDashboard;