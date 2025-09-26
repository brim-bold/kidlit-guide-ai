import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/icons/Icon';
import { BookOpen, Calendar } from 'lucide-react';
import TextToSpeechButton from '@/components/TextToSpeechButton';

interface BookData {
  title: string;
  author: string;
  summary?: string;
  coverImage?: string;
  pageCount?: number;
  publishedDate?: string;
  categories?: string[];
  arLevel?: string;
  gradeLevel?: string;
  year?: number;
  bannedBook?: boolean;
}

interface BookCardProps {
  bookData: BookData;
}

const BookCard = ({ bookData }: BookCardProps) => {
  return (
    <article className="bg-card rounded-xl shadow-md p-6 md:p-8 mb-6 md:mb-8 border border-border">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Book Cover */}
        <div className="flex-shrink-0 mx-auto md:mx-0">
          <div className="w-32 h-48 md:w-40 md:h-60 bg-gradient-to-br from-primary/10 to-primary/20 rounded-lg border-2 border-primary/20 flex items-center justify-center overflow-hidden shadow-lg">
            {bookData.coverImage ? (
              <img 
                src={bookData.coverImage} 
                alt={`${bookData.title} cover`}
                className="w-full h-full object-cover"
              />
            ) : (
              <BookOpen className="w-16 h-16 text-primary/50" />
            )}
          </div>
        </div>

        {/* Book Info */}
        <div className="flex-grow text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
            <div>
              <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-2">{bookData.title}</h2>
              <p className="text-lg md:text-2xl text-primary mb-4 font-semibold">by {bookData.author}</p>
            </div>
            {bookData.summary && (
              <TextToSpeechButton 
                text={`${bookData.title} by ${bookData.author}. ${bookData.summary}`}
                voice="nova"
                className="border-primary text-primary hover:bg-primary hover:text-white"
              >
                Read Book Info
              </TextToSpeechButton>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2 md:gap-3 justify-center md:justify-start">
            {bookData.arLevel && (
              <Badge variant="secondary" className="bg-bg-blue text-learning-blue border-learning-blue/30 px-3 md:px-4 py-2 rounded-full font-bold text-sm md:text-base">
                <Icon name="target" size={14} className="mr-1" />
                AR Level: {bookData.arLevel}
              </Badge>
            )}
            {bookData.gradeLevel && (
              <Badge variant="secondary" className="bg-bg-green text-learning-green border-learning-green/30 px-3 md:px-4 py-2 rounded-full font-bold text-sm md:text-base">
                <Icon name="zap" size={14} className="mr-1" />
                Grade: {bookData.gradeLevel}
              </Badge>
            )}
            {bookData.pageCount && (
              <Badge variant="secondary" className="bg-bg-purple text-learning-purple border-learning-purple/30 px-3 md:px-4 py-2 rounded-full font-bold text-sm md:text-base">
                <Icon name="bookOpen" size={14} className="mr-1" />
                {bookData.pageCount} pages
              </Badge>
            )}
            {(bookData.publishedDate || bookData.year) && (
              <Badge variant="secondary" className="bg-bg-orange text-learning-orange border-learning-orange/30 px-3 md:px-4 py-2 rounded-full font-bold text-sm md:text-base">
                <Calendar size={14} className="mr-1" />
                {bookData.publishedDate ? new Date(bookData.publishedDate).getFullYear() : bookData.year}
              </Badge>
            )}
            {bookData.categories && bookData.categories.length > 0 && (
              <Badge variant="secondary" className="bg-accent text-accent-foreground px-3 md:px-4 py-2 rounded-full font-bold text-sm md:text-base">
                <Icon name="star" size={14} className="mr-1" />
                {bookData.categories[0]}
              </Badge>
            )}
            {bookData.bannedBook && (
              <Badge variant="destructive" className="bg-bg-red text-learning-red border-learning-red/30 px-3 md:px-4 py-2 rounded-full font-bold text-sm md:text-base">
                <Icon name="alertTriangle" size={14} className="mr-1" />
                Challenged Book
              </Badge>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default BookCard;