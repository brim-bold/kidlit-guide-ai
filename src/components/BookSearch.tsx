import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface BookSearchProps {
  bookTitle: string;
  setBookTitle: (title: string) => void;
  bookAuthor: string;
  setBookAuthor: (author: string) => void;
  onSearch: () => void;
  loading: boolean;
  error: string;
  onGenerateWithAI: () => void;
  isGeneratingBook: boolean;
  fallbackDatabase: any;
}

const BookSearch = ({
  bookTitle,
  setBookTitle,
  bookAuthor,
  setBookAuthor,
  onSearch,
  loading,
  error,
  onGenerateWithAI,
  isGeneratingBook,
  fallbackDatabase
}: BookSearchProps) => {
  return (
    <section 
      className="bg-gradient-card rounded-2xl shadow-card p-6 md:p-8 mb-8 border-2 border-accent"
      aria-label="Book search"
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="book-title" className="text-sm md:text-base font-bold text-foreground mb-2">
            Book Title <span className="text-destructive" aria-label="required">*</span>
          </Label>
          <Input
            id="book-title"
            type="text"
            value={bookTitle}
            onChange={(e) => setBookTitle(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onSearch()}
            placeholder="Enter book title..."
            className="w-full p-3 md:p-4 text-base md:text-lg border-2 border-border rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/20 transition-smooth"
            aria-required="true"
          />
        </div>
        <div>
          <Label htmlFor="book-author" className="text-sm md:text-base font-bold text-foreground mb-2">
            Author <span className="text-muted-foreground text-sm">(optional)</span>
          </Label>
          <Input
            id="book-author"
            type="text"
            value={bookAuthor}
            onChange={(e) => setBookAuthor(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onSearch()}
            placeholder="Enter author name..."
            className="w-full p-3 md:p-4 text-base md:text-lg border-2 border-border rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/20 transition-smooth"
          />
        </div>
        
        <div className="pt-2">
          <p className="text-sm md:text-base font-bold text-foreground mb-3">📚 Popular Books:</p>
          <div className="flex flex-wrap gap-2">
            {Object.values(fallbackDatabase).map((book: any) => (
              <Button
                key={book.id}
                variant="outline"
                onClick={() => {
                  setBookTitle(book.title);
                  setBookAuthor(book.author);
                }}
                className="px-3 md:px-4 py-2 bg-accent/50 text-accent-foreground rounded-full text-sm md:text-base font-semibold hover:bg-accent hover:scale-hover transition-bounce border-accent-foreground/20"
                aria-label={`Select ${book.title} by ${book.author}`}
              >
                {book.title}
              </Button>
            ))}
          </div>
        </div>

        <Button
          onClick={onSearch}
          disabled={loading}
          className="w-full bg-gradient-primary text-primary-foreground py-3 md:py-4 rounded-xl font-bold text-base md:text-lg hover:scale-hover transition-bounce shadow-button hover:shadow-hover disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={loading ? 'Searching for book' : 'Search for book'}
        >
          <Search size={20} aria-hidden="true" className="mr-2" />
          {loading ? 'Searching...' : 'Explore Book'}
        </Button>
      </div>

      {error && (
        <div className="mt-4 bg-destructive/10 border-2 border-destructive/30 rounded-xl p-4" role="alert">
          <p className="text-destructive font-semibold mb-3">{error}</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={onGenerateWithAI}
              disabled={isGeneratingBook}
              className="bg-gradient-secondary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:scale-hover transition-bounce disabled:opacity-50"
            >
              {isGeneratingBook ? '🔄 Searching...' : '🤖 Find Book with AI'}
            </Button>
            <p className="text-sm text-muted-foreground self-center">We'll search and create materials automatically</p>
          </div>
        </div>
      )}
    </section>
  );
};

export default BookSearch;