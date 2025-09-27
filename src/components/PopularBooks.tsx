import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { googleBooksService, GoogleBook } from '@/services/googleBooksService';
import { fallbackDatabase } from '@/data/fallbackDatabase';
import { BookOpen, Star } from 'lucide-react';

interface PopularBooksProps {
  onBookSelect: (title: string, author: string) => void;
}

const PopularBooks = ({ onBookSelect }: PopularBooksProps) => {
  const [books, setBooks] = useState<GoogleBook[]>([]);
  const [loading, setLoading] = useState(true);

  const popularSearches = [
    'Charlotte\'s Web',
    'Wonder R.J. Palacio', 
    'The Giver',
    'Matilda Roald Dahl',
    'Holes Louis Sachar',
    'Bridge to Terabithia'
  ];

  useEffect(() => {
    const fetchPopularBooks = async () => {
      try {
        // Use fallback books directly to avoid API quota issues
        const fallbackBooks = Object.values(fallbackDatabase).slice(0, 3).map(book => ({
          id: book.id,
          title: book.title,
          author: book.author,
          summary: book.summary,
          coverImage: (book as any).coverImage, // Handle optional coverImage
          vocabulary: book.vocabulary,
          questions: book.questions,
          activities: book.activities,
          predictions: book.predictions,
          comprehensionSkill: book.comprehensionSkill,
          categories: ['Fiction']
        }));
        
        setBooks(fallbackBooks);
      } catch (error) {
        console.error('Error loading popular books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularBooks();
  }, []);

  if (loading) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-learning-blue">
            <Star className="w-5 h-5" />
            Popular Books
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg h-32 mb-2"></div>
                <div className="bg-gray-200 rounded h-4 mb-1"></div>
                <div className="bg-gray-200 rounded h-3 w-2/3"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6 border-learning-blue/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-learning-blue">
          <Star className="w-5 h-5" />
          Popular Books
        </CardTitle>
        <CardDescription>
          Click on any book below to start exploring!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {books.map((book) => (
            <Card 
              key={book.id}
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-learning-blue/40"
              onClick={() => onBookSelect(book.title, book.author)}
            >
              <CardContent className="p-4">
                <div className="aspect-[3/4] mb-3 bg-gradient-to-br from-learning-blue/10 to-learning-purple/10 rounded-lg flex items-center justify-center overflow-hidden">
                  {book.coverImage ? (
                    <img 
                      src={book.coverImage} 
                      alt={book.title}
                      className="w-full h-full object-cover rounded-lg"
                      loading="lazy"
                      style={{ imageRendering: 'crisp-edges' }}
                    />
                  ) : (
                    <BookOpen className="w-12 h-12 text-learning-blue/50" />
                  )}
                </div>
                <h3 className="font-semibold text-sm mb-1 line-clamp-2 text-learning-blue">
                  {book.title}
                </h3>
                <p className="text-xs text-foreground/60 mb-2 line-clamp-1">
                  by {book.author}
                </p>
                {book.categories && book.categories.length > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {book.categories[0]}
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PopularBooks;