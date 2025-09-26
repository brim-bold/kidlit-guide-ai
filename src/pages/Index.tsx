import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, Trophy, User, LogOut, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LoadingScreen from '@/components/LoadingScreen';
import BookCard from '@/components/BookCard';
import StrategySpotlight from '@/components/StrategySpotlight';
import PredictionSection from '@/components/PredictionSection';
import BookTabs from '@/components/BookTabs';
import BannedBookWarning from '@/components/BannedBookWarning';
import { DyslexiaToggle } from '@/components/DyslexiaToggle';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import CharacterAvatar from '@/components/CharacterAvatar';

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLoading, setShowLoading] = useState(true);
  const [bookData, setBookData] = useState<any>(null);
  const [predictions, setPredictions] = useState<{ [key: number]: string }>({});
  const [showStrategy, setShowStrategy] = useState(true);
  const [showBannedWarning, setShowBannedWarning] = useState(false);
  const { toast } = useToast();
  const { user, profile, isParent, signOut } = useAuth();

  // Handle book data from search page
  useEffect(() => {
    if (location.state?.bookData) {
      setBookData(location.state.bookData);
      if (location.state.showBannedWarning) {
        setShowBannedWarning(true);
      }
      // Clear the location state to prevent issues on refresh
      window.history.replaceState({}, document.title);
    } else {
      // If no book data, redirect to search page (which is now the default route)
      navigate('/');
    }
  }, [location.state, navigate]);

  const handleSignOut = async () => {
    await signOut();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handlePredictionChange = (index: number, value: string) => {
    setPredictions({ ...predictions, [index]: value });
  };

  return (
    <>
      {showLoading && <LoadingScreen onComplete={() => setShowLoading(false)} />}
      
      {showBannedWarning && (
        <BannedBookWarning onClose={() => setShowBannedWarning(false)} />
      )}

      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto p-4 space-y-6">
          
          {/* Simple Header Card */}
          <div className="bg-white rounded-3xl shadow-soft p-6 border border-border/30">
            <div className="flex justify-between items-center mb-4">
              {user ? (
                <div className="flex items-center gap-3">
                  <CharacterAvatar character="cheerful" size="md" animate={false} />
                  <div>
                    <p className="font-semibold text-foreground">
                      {profile?.display_name || user?.email?.split('@')[0] || 'Reader'}
                    </p>
                    <p className="text-sm text-muted-foreground">Welcome back!</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <CharacterAvatar character="star" size="md" animate={false} />
                  <div>
                    <p className="font-semibold text-foreground">Book Explorer</p>
                    <p className="text-sm text-muted-foreground">Guest Mode</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => navigate('/')}
                  className="bg-character-green text-white hover:bg-character-green/90 flex items-center gap-2 rounded-2xl px-4 py-2 focus:ring-2 focus:ring-character-green focus:ring-offset-2"
                  size="sm"
                >
                  <Search className="w-4 h-4" />
                  Search Books
                </Button>
                <DyslexiaToggle />
                {user ? (
                  <>
                    {isParent && (
                      <Button
                        onClick={() => navigate('/parent-dashboard')}
                        className="bg-character-purple text-white hover:bg-character-purple/90 flex items-center gap-2 rounded-2xl px-4 py-2 focus:ring-2 focus:ring-character-purple focus:ring-offset-2"
                        size="sm"
                      >
                        <User className="w-4 h-4" />
                        Dashboard
                      </Button>
                    )}
                    <Button
                      onClick={() => navigate('/progress')}
                      className="bg-character-blue text-white hover:bg-character-blue/90 flex items-center gap-2 rounded-2xl px-4 py-2 focus:ring-2 focus:ring-character-blue focus:ring-offset-2"
                      size="sm"
                    >
                      <Trophy className="w-4 h-4" />
                      <span className="font-bold">{profile?.total_points || 0}</span>
                    </Button>
                    <Button
                      onClick={handleSignOut}
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-foreground focus:ring-2 focus:ring-character-blue focus:ring-offset-2"
                    >
                      <LogOut className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => navigate('/auth')}
                    className="bg-character-blue text-white hover:bg-character-blue/90 focus:ring-2 focus:ring-character-blue focus:ring-offset-2 rounded-2xl px-4 py-2"
                    size="sm"
                  >
                    <Trophy className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                )}
              </div>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-character-blue p-3 rounded-2xl shadow-calm">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-3xl font-bold mb-2 text-character-blue">
                Book Explorer
              </h1>
              <p className="text-muted-foreground">
                {bookData ? `Reading: ${bookData.title}` : 'Discover, Learn, and Grow with Every Book!'}
              </p>
            </div>
          </div>

          {/* Book Content Cards */}
          {bookData && (
            <div className="space-y-6">
              {/* Book Info Card */}
              <div className="bg-white rounded-3xl shadow-soft p-6 border border-border/30">
                <BookCard bookData={bookData} />
              </div>

              {/* Strategy Card */}
              {showStrategy && bookData.comprehensionSkill && (
                <div className="bg-white rounded-3xl shadow-soft p-6 border border-border/30">
                  <StrategySpotlight
                    comprehensionSkill={bookData.comprehensionSkill}
                    strategyTip={bookData.strategyTip}
                    onClose={() => setShowStrategy(false)}
                  />
                </div>
              )}

              {/* Predictions Card */}
              {bookData.predictions && (
                <div className="bg-white rounded-3xl shadow-soft p-6 border border-border/30">
                  <PredictionSection
                    predictions={bookData.predictions}
                    userPredictions={predictions}
                    onPredictionChange={handlePredictionChange}
                  />
                </div>
              )}

              {/* Activities Card */}
              <div className="bg-white rounded-3xl shadow-soft border border-border/30 overflow-hidden">
                <BookTabs bookData={bookData} userPredictions={predictions} isAuthenticated={!!user} />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Index;