import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icon } from '@/components/icons/Icon';

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
      className="bg-card rounded-xl shadow-md p-6 md:p-8 mb-8 border border-border"
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
            className="w-full p-3 md:p-4 text-base md:text-lg border-2 border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-smooth"
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
            className="w-full p-3 md:p-4 text-base md:text-lg border-2 border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-smooth"
          />
        </div>
        
        <div className="pt-2">
          <p className="text-sm md:text-base font-bold text-foreground mb-3 flex items-center gap-2">
            <Icon name="book" size={18} />
            Popular Books:
          </p>
          <div className="flex flex-wrap gap-2">
            {Object.values(fallbackDatabase).map((book: any) => (
              <Button
                key={book.id}
                variant="outline"
                onClick={() => {
                  setBookTitle(book.title);
                  setBookAuthor(book.author);
                }}
                className="px-3 md:px-4 py-2 bg-accent/50 text-accent-foreground rounded-full text-sm md:text-base font-medium hover:bg-accent transition-all border-border"
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
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 md:py-4 rounded-lg font-bold text-base md:text-lg transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={loading ? 'Searching for book' : 'Search for book'}
        >
          <Icon name="search" size={20} className="mr-2" />
          {loading ? 'Searching...' : 'Explore Book'}
        </Button>
      </div>

      {error && (
        <div className="mt-4 bg-bg-red border border-learning-red/30 rounded-lg p-4" role="alert">
          <p className="text-learning-red font-semibold mb-3">{error}</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={onGenerateWithAI}
              disabled={isGeneratingBook}
              className="bg-learning-purple hover:bg-learning-purple/90 text-white px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-50"
            >
              <Icon name={isGeneratingBook ? 'refreshCw' : 'bot'} size={16} className="mr-2" />
              {isGeneratingBook ? 'Searching...' : 'Find Book with AI'}
            </Button>
            <p className="text-sm text-muted-foreground self-center">We'll search and create materials automatically</p>
          </div>
        </div>
      )}
    </section>
  );
};

export default BookSearch;