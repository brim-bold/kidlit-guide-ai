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
import { DyslexiaToggle } from '@/components/DyslexiaToggle';
import { fallbackDatabase } from '@/data/fallbackDatabase';
import { googleBooksService, GoogleBook } from '@/services/googleBooksService';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useGameification } from '@/hooks/useGameification';
import { Icon } from '@/components/icons/Icon';
import { useNavigate } from 'react-router-dom';
import CharacterAvatar, { CharacterType } from '@/components/CharacterAvatar';

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
                <DyslexiaToggle />
                {user ? (
                  <>
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
                Discover, Learn, and Grow with Every Book!
              </p>
            </div>
          </div>

          {/* Search Card */}
          <div className="bg-white rounded-3xl shadow-soft p-6 border border-border/30">
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
          </div>

          {/* Popular Books Card - only when no book selected */}
          {!bookData && (
            <div className="bg-white rounded-3xl shadow-soft p-6 border border-border/30">
              <PopularBooks onBookSelect={handleBookSelect} />
            </div>
          )}

          {/* Gamification Banner - only for guests */}
          {!user && (
            <div className="bg-white rounded-3xl shadow-soft p-6 border border-border/30">
              <GamificationBanner />
            </div>
          )}

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
