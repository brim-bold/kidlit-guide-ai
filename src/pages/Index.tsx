import React, { useState, useEffect } from 'react';
import { BookOpen, Trophy, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import LoadingScreen from '@/components/LoadingScreen';
import BookSearch from '@/components/BookSearch';
import BookCard from '@/components/BookCard';
import StrategySpotlight from '@/components/StrategySpotlight';
import PredictionSection from '@/components/PredictionSection';
import BookTabs from '@/components/BookTabs';
import BannedBookWarning from '@/components/BannedBookWarning';
import { fallbackDatabase } from '@/data/fallbackDatabase';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useGameification } from '@/hooks/useGameification';
import { Icon } from '@/components/icons/Icon';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const [showLoading, setShowLoading] = useState(true);
  const [bookTitle, setBookTitle] = useState('');
  const [bookAuthor, setBookAuthor] = useState('');
  const [bookData, setBookData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [predictions, setPredictions] = useState<{ [key: number]: string }>({});
  const [showStrategy, setShowStrategy] = useState(true);
  const [showBannedWarning, setShowBannedWarning] = useState(false);
  const [isGeneratingBook, setIsGeneratingBook] = useState(false);
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const { profile } = useGameification();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: 'Error signing out',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const searchBook = async () => {
    if (!bookTitle.trim()) return;
    
    setLoading(true);
    setBookData(null);
    setError('');
    setPredictions({});
    setShowStrategy(true);

    try {
      const searchKey = bookTitle.toLowerCase().replace(/[^a-z0-9]/g, '');
      const fallbackKeys = Object.keys(fallbackDatabase);
      const fallbackMatch = fallbackKeys.find(key => 
        searchKey.includes(key) || 
        fallbackDatabase[key as keyof typeof fallbackDatabase].title.toLowerCase().replace(/[^a-z0-9]/g, '').includes(searchKey)
      );

      if (fallbackMatch) {
        const matchedBook = fallbackDatabase[fallbackMatch as keyof typeof fallbackDatabase];
        setBookData(matchedBook);
        if (matchedBook.bannedBook) {
          setShowBannedWarning(true);
        }
        setLoading(false);
        toast({
          title: "Book Found!",
          description: `Found "${matchedBook.title}" with comprehensive reading materials.`,
        });
        return;
      }

      // If not found in fallback, show error
      setError(`We couldn't find "${bookTitle}"${bookAuthor ? ` by ${bookAuthor}` : ''}.`);
      setLoading(false);
    } catch (err) {
      console.error('Search error:', err);
      setError('Oops! Something went wrong with the search. Please try again!');
      setLoading(false);
    }
  };

  const generateBookWithAI = async () => {
    setIsGeneratingBook(true);
    
    // For demo purposes, we'll show an error since we don't have the API integration
    setTimeout(() => {
      setIsGeneratingBook(false);
      toast({
        title: "AI Search Not Available",
        description: "AI book generation would require API integration. Try selecting from popular books!",
        variant: "destructive",
      });
    }, 2000);
  };

  const handlePredictionChange = (index: number, value: string) => {
    setPredictions({ ...predictions, [index]: value });
  };

  return (
    <>
      {showLoading && <LoadingScreen onComplete={() => setShowLoading(false)} />}
      
      {showBannedWarning && (
        <BannedBookWarning onClose={() => setShowBannedWarning(false)} />
      )}

      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* User Navigation Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-learning-blue text-white">
                  {profile?.display_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || <User className="w-5 h-5" />}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-learning-blue">
                  {profile?.display_name || user?.email?.split('@')[0] || 'Reader'}
                </p>
                <p className="text-sm text-foreground/60">Welcome back!</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                onClick={() => navigate('/progress')}
                variant="outline"
                className="flex items-center gap-2 border-learning-blue text-learning-blue hover:bg-learning-blue hover:text-white"
              >
                <Trophy className="w-4 h-4" />
                <span className="hidden sm:inline">Points:</span>
                <span className="font-bold">{profile?.total_points || 0}</span>
              </Button>
              
              <Button
                onClick={handleSignOut}
                variant="ghost"
                size="sm"
                className="text-foreground/60 hover:text-foreground"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline ml-2">Sign Out</span>
              </Button>
            </div>
          </div>

          <header className="text-center mb-8 md:mb-12">
            <BookOpen className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-4 text-primary drop-shadow-lg" aria-hidden="true" />
            <h1 className="text-3xl md:text-5xl font-bold text-primary mb-2">
              Book Explorer
            </h1>
            <p className="text-base md:text-lg text-muted-foreground flex items-center justify-center gap-2">
              <Icon name="sparkles" size={18} />
              Discover, Learn, and Grow with Every Book!
            </p>
          </header>

          <BookSearch
            bookTitle={bookTitle}
            setBookTitle={setBookTitle}
            bookAuthor={bookAuthor}
            setBookAuthor={setBookAuthor}
            onSearch={searchBook}
            loading={loading}
            error={error}
            onGenerateWithAI={generateBookWithAI}
            isGeneratingBook={isGeneratingBook}
            fallbackDatabase={fallbackDatabase}
          />

          {bookData && (
            <div className="max-w-5xl mx-auto">
              <BookCard bookData={bookData} />

              {showStrategy && bookData.comprehensionSkill && (
                <StrategySpotlight
                  comprehensionSkill={bookData.comprehensionSkill}
                  strategyTip={bookData.strategyTip}
                  onClose={() => setShowStrategy(false)}
                />
              )}

              {bookData.predictions && (
                <PredictionSection
                  predictions={bookData.predictions}
                  userPredictions={predictions}
                  onPredictionChange={handlePredictionChange}
                />
              )}

              <BookTabs bookData={bookData} userPredictions={predictions} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Index;
