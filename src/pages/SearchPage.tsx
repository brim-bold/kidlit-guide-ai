import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, LogOut, Trophy, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LoadingScreen from '@/components/LoadingScreen';
import BookSearch from '@/components/BookSearch';
import PopularBooks from '@/components/PopularBooks';
import GamificationBanner from '@/components/GamificationBanner';
import { DyslexiaToggle } from '@/components/DyslexiaToggle';
import { fallbackDatabase } from '@/data/fallbackDatabase';
import { googleBooksService, GoogleBook } from '@/services/googleBooksService';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import CharacterAvatar from '@/components/CharacterAvatar';

const SearchPage = () => {
  const [showLoading, setShowLoading] = useState(false);
  const [bookTitle, setBookTitle] = useState('');
  const [bookAuthor, setBookAuthor] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isGeneratingBook, setIsGeneratingBook] = useState(false);
  const { toast } = useToast();
  const { user, profile, isParent, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
  };

  const searchBook = async () => {
    if (!bookTitle.trim()) return;
    
    setLoading(true);
    setError('');

    try {
      // First try Google Books API
      const searchResults = await googleBooksService.searchBooks(bookTitle + (bookAuthor ? ` ${bookAuthor}` : ''));
      
      if (searchResults && searchResults.length > 0) {
        // Navigate to results page with the book data
        const selectedBook = searchResults[0];
        navigate('/results', { 
          state: { 
            bookData: selectedBook,
            source: 'google'
          } 
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
        navigate('/results', { 
          state: { 
            bookData: matchedBook,
            source: 'fallback',
            showBannedWarning: matchedBook.bannedBook
          } 
        });
        return;
      }

      // If not found anywhere, show error
      setError(`We couldn't find "${bookTitle}"${bookAuthor ? ` by ${bookAuthor}` : ''}. Try popular titles like "Charlotte's Web", "Wonder", or "The Giver".`);
      
    } catch (err) {
      console.error('Search error:', err);
      
      if (err instanceof Error && err.message.includes('quota')) {
        setError('Book search is temporarily unavailable due to high demand. Try using AI book generation instead!');
        toast({
          title: "Service Temporarily Unavailable",
          description: "Try generating a book with AI instead!",
          variant: "destructive",
        });
      } else {
        setError('Failed to search for books. Please check your internet connection and try again.');
        toast({
          title: "Search Error",
          description: "Unable to search for books. Please try again.",
          variant: "destructive",
        });
      }
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
      navigate('/results', { 
        state: { 
          bookData: generatedBook,
          source: 'ai'
        } 
      });
      
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

  return (
    <>
      {showLoading && <LoadingScreen onComplete={() => setShowLoading(false)} />}
      
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
                Search for your next great read!
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

          {/* Popular Books Card */}
          <div className="bg-white rounded-3xl shadow-soft p-6 border border-border/30">
            <PopularBooks onBookSelect={handleBookSelect} />
          </div>

          {/* Gamification Banner - only for guests */}
          {!user && (
            <div className="bg-white rounded-3xl shadow-soft p-6 border border-border/30">
              <GamificationBanner />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchPage;