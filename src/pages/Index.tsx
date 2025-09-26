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
import GamificationBanner from '@/components/GamificationBanner';
import PopularBooks from '@/components/PopularBooks';
import { fallbackDatabase } from '@/data/fallbackDatabase';
import { googleBooksService, GoogleBook } from '@/services/googleBooksService';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useGameification } from '@/hooks/useGameification';
import { Icon } from '@/components/icons/Icon';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const [showLoading, setShowLoading] = useState(true);
  const [bookTitle, setBookTitle] = useState('');
  const [bookAuthor, setBookAuthor] = useState('');
  const [bookData, setBookData] = useState<GoogleBook | any>(null);
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
      // First try Google Books API
      const searchResults = await googleBooksService.searchBooks(bookTitle + (bookAuthor ? ` ${bookAuthor}` : ''));
      
      if (searchResults && searchResults.length > 0) {
        // Use the first result from Google Books
        const selectedBook = searchResults[0];
        setBookData(selectedBook);
        
        toast({
          title: "Book Found!",
          description: `Found "${selectedBook.title}" by ${selectedBook.author}`,
        });
        return;
      }

      // Fallback to local database if no results from Google Books
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
        
        toast({
          title: "Book Found!",
          description: `Found "${matchedBook.title}" in our curated collection!`,
        });
        return;
      }

      // If not found anywhere, show error
      setError(`We couldn't find "${bookTitle}"${bookAuthor ? ` by ${bookAuthor}` : ''}. Try popular titles like "Charlotte's Web", "Wonder", or "The Giver".`);
      
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search for books. Please check your internet connection and try again.');
      
      toast({
        title: "Search Error",
        description: "Unable to search for books. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateBookWithAI = async () => {
    setIsGeneratingBook(true);
    
    try {
      const prompt = bookTitle || "A magical adventure for young readers";
      
      const { data, error } = await supabase.functions.invoke('generate-book-ai', {
        body: { 
          prompt: prompt,
          ageRange: "8-12",
          genre: "adventure"
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to generate book');
      }

      const generatedBook = data.book;
      setBookData(generatedBook);
      setBookTitle(generatedBook.title);
      setBookAuthor(generatedBook.author);
      
      toast({
        title: "🤖 AI Book Generated!",
        description: `Created "${generatedBook.title}" with full educational content!`,
      });

    } catch (error) {
      console.error('AI Generation Error:', error);
      toast({
        title: "AI Generation Failed",
        description: error instanceof Error ? error.message : "Please try again with a different prompt.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingBook(false);
    }
  };

  const handleBookSelect = (title: string, author: string) => {
    setBookTitle(title);
    setBookAuthor(author);
    searchBook();
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
            {user ? (
              <>
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
              </>
            ) : (
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-learning-blue text-white">
                      <BookOpen className="w-5 h-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-learning-blue">Book Explorer</p>
                    <p className="text-sm text-foreground/60">Guest Mode</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => navigate('/auth')}
                    variant="outline"
                    className="flex items-center gap-2 border-learning-blue text-learning-blue hover:bg-learning-blue hover:text-white"
                  >
                    <Trophy className="w-4 h-4" />
                    <span className="hidden sm:inline">Join to Earn Points!</span>
                    <span className="sm:hidden">Sign In</span>
                  </Button>
                </div>
              </div>
            )}
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

          {/* Show gamification banner for non-authenticated users */}
          {!user && <GamificationBanner />}

          {/* Show popular books when no book is selected */}
          {!bookData && <PopularBooks onBookSelect={handleBookSelect} />}

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

              <BookTabs bookData={bookData} userPredictions={predictions} isAuthenticated={!!user} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Index;
