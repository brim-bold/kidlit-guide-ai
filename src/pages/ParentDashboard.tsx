import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  User,
  BookOpen, 
  Trophy, 
  Clock, 
  TrendingUp, 
  Star,
  Calendar,
  Target,
  Award
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ChildProfile {
  id: string;
  user_id: string;
  child_name: string;
  display_name: string;
  grade_level: string;
  current_streak: number;
  longest_streak: number;
  books_completed: number;
  total_points: number;
}

interface ReadingSession {
  id: string;
  session_date: string;
  minutes_read: number;
}

interface BookRead {
  id: string;
  book_title: string;
  book_author: string;
  completed_at: string;
}

interface Activity {
  id: string;
  activity_type: string;
  points_earned: number;
  book_title: string;
  created_at: string;
}

const ParentDashboard = () => {
  const { profile, isParent, user } = useAuth();
  const navigate = useNavigate();
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  const [readingSessions, setReadingSessions] = useState<ReadingSession[]>([]);
  const [booksRead, setBooksRead] = useState<BookRead[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isParent || !user) {
      navigate('/auth');
      return;
    }
    fetchChildren();
  }, [isParent, user, navigate]);

  useEffect(() => {
    if (selectedChild) {
      fetchChildData(selectedChild);
    }
  }, [selectedChild]);

  const fetchChildren = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('parent_id', profile?.id)
        .eq('role', 'child');

      if (error) {
        console.error('Error fetching children:', error);
        return;
      }

      setChildren(data || []);
      if (data && data.length > 0) {
        setSelectedChild(data[0].user_id);
      }
    } catch (error) {
      console.error('Error fetching children:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChildData = async (childUserId: string) => {
    try {
      // Fetch reading sessions
      const { data: sessions } = await supabase
        .from('reading_sessions')
        .select('*')
        .eq('user_id', childUserId)
        .order('session_date', { ascending: false })
        .limit(30);

      // Fetch books read
      const { data: books } = await supabase
        .from('books_read')
        .select('*')
        .eq('user_id', childUserId)
        .order('completed_at', { ascending: false })
        .limit(20);

      // Fetch activities
      const { data: activitiesData } = await supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', childUserId)
        .order('created_at', { ascending: false })
        .limit(50);

      setReadingSessions(sessions || []);
      setBooksRead(books || []);
      setActivities(activitiesData || []);
    } catch (error) {
      console.error('Error fetching child data:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bg-blue via-background to-bg-purple flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isParent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bg-blue via-background to-bg-purple flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-destructive">Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">This dashboard is only available to parent accounts.</p>
            <Button onClick={() => navigate('/')}>Return Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const selectedChildProfile = children.find(child => child.user_id === selectedChild);
  const totalMinutesThisWeek = readingSessions
    .filter(session => {
      const sessionDate = new Date(session.session_date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return sessionDate >= weekAgo;
    })
    .reduce((total, session) => total + session.minutes_read, 0);

  const booksThisMonth = booksRead.filter(book => {
    const bookDate = new Date(book.completed_at);
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    return bookDate >= monthAgo;
  }).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-blue via-background to-bg-purple p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <Users className="w-8 h-8 text-primary" />
                Parent Dashboard
              </h1>
              <p className="text-muted-foreground">Monitor your child's reading progress</p>
            </div>
            <Button onClick={() => navigate('/')} variant="outline">
              Back to Reading
            </Button>
          </div>

          {/* Child Selector */}
          {children.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {children.map((child) => (
                <Button
                  key={child.id}
                  variant={selectedChild === child.user_id ? "default" : "outline"}
                  onClick={() => setSelectedChild(child.user_id)}
                  className="flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  {child.child_name || child.display_name}
                  {child.grade_level && (
                    <Badge variant="secondary" className="text-xs">
                      Grade {child.grade_level}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          )}
        </div>

        {children.length === 0 ? (
          <Card className="text-center py-12">
            <CardHeader>
              <CardTitle>No Children Found</CardTitle>
              <CardDescription>
                You don't have any child accounts linked to your parent account yet.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                To add a child account, create a new account with the "Child Account" option 
                and link it to your parent account.
              </p>
              <Button onClick={() => navigate('/auth')}>
                Create Child Account
              </Button>
            </CardContent>
          </Card>
        ) : selectedChildProfile && (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="reading">Reading Stats</TabsTrigger>
              <TabsTrigger value="books">Books Read</TabsTrigger>
              <TabsTrigger value="activities">Activities</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
                    <Trophy className="h-4 w-4 text-learning-orange" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-learning-orange">
                      {selectedChildProfile.current_streak} days
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Books Completed</CardTitle>
                    <BookOpen className="h-4 w-4 text-learning-blue" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-learning-blue">
                      {selectedChildProfile.books_completed}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Points</CardTitle>
                    <Star className="h-4 w-4 text-learning-purple" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-learning-purple">
                      {selectedChildProfile.total_points}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Minutes This Week</CardTitle>
                    <Clock className="h-4 w-4 text-learning-green" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-learning-green">
                      {totalMinutesThisWeek}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Progress Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Weekly Reading Goal
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{totalMinutesThisWeek}/210 minutes</span>
                      </div>
                      <Progress value={(totalMinutesThisWeek / 210) * 100} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        Goal: 30 minutes per day (210 minutes per week)
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      Recent Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedChildProfile.current_streak >= 7 && (
                        <Badge className="bg-learning-orange text-white">
                          🔥 Week Streak!
                        </Badge>
                      )}
                      {booksThisMonth >= 3 && (
                        <Badge className="bg-learning-blue text-white">
                          📚 Book Lover!
                        </Badge>
                      )}
                      {selectedChildProfile.total_points >= 500 && (
                        <Badge className="bg-learning-purple text-white">
                          ⭐ Point Master!
                        </Badge>
                      )}
                      {selectedChildProfile.current_streak >= selectedChildProfile.longest_streak && (
                        <Badge className="bg-learning-green text-white">
                          🏆 Personal Best!
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="reading" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Reading Sessions (Last 30 Days)</CardTitle>
                </CardHeader>
                <CardContent>
                  {readingSessions.length > 0 ? (
                    <div className="space-y-2">
                      {readingSessions.map((session) => (
                        <div key={session.id} className="flex justify-between items-center p-2 bg-muted rounded">
                          <span>{new Date(session.session_date).toLocaleDateString()}</span>
                          <Badge variant="outline">{session.minutes_read} minutes</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No reading sessions recorded yet.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="books" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recently Completed Books</CardTitle>
                </CardHeader>
                <CardContent>
                  {booksRead.length > 0 ? (
                    <div className="space-y-4">
                      {booksRead.map((book) => (
                        <div key={book.id} className="flex justify-between items-start p-3 bg-muted rounded">
                          <div>
                            <h4 className="font-semibold">{book.book_title}</h4>
                            <p className="text-sm text-muted-foreground">by {book.book_author}</p>
                          </div>
                          <Badge variant="outline">
                            {new Date(book.completed_at).toLocaleDateString()}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No books completed yet.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activities" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  {activities.length > 0 ? (
                    <div className="space-y-2">
                      {activities.map((activity) => (
                        <div key={activity.id} className="flex justify-between items-center p-2 bg-muted rounded">
                          <div>
                            <span className="font-medium">{activity.activity_type}</span>
                            {activity.book_title && (
                              <span className="text-sm text-muted-foreground ml-2">
                                - {activity.book_title}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-learning-purple text-white">
                              +{activity.points_earned} pts
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(activity.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No activities recorded yet.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default ParentDashboard;