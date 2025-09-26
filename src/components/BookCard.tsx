import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/icons/Icon';

interface BookData {
  title: string;
  author: string;
  arLevel: string;
  gradeLevel: string;
  pageCount?: number;
  year?: number;
  bannedBook: boolean;
}

interface BookCardProps {
  bookData: BookData;
}

const BookCard = ({ bookData }: BookCardProps) => {
  return (
    <article className="bg-card rounded-xl shadow-md p-6 md:p-8 mb-6 md:mb-8 border border-border">
      <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-2">{bookData.title}</h2>
      <p className="text-lg md:text-2xl text-primary mb-4 font-semibold">by {bookData.author}</p>
      <div className="flex flex-wrap gap-2 md:gap-3">
        <Badge variant="secondary" className="bg-bg-blue text-learning-blue border-learning-blue/30 px-3 md:px-4 py-2 rounded-full font-bold text-sm md:text-base">
          <Icon name="target" size={14} className="mr-1" />
          AR Level: {bookData.arLevel}
        </Badge>
        <Badge variant="secondary" className="bg-bg-green text-learning-green border-learning-green/30 px-3 md:px-4 py-2 rounded-full font-bold text-sm md:text-base">
          <Icon name="zap" size={14} className="mr-1" />
          Grade: {bookData.gradeLevel}
        </Badge>
        {bookData.pageCount && (
          <Badge variant="secondary" className="bg-bg-purple text-learning-purple border-learning-purple/30 px-3 md:px-4 py-2 rounded-full font-bold text-sm md:text-base">
            <Icon name="fileText" size={14} className="mr-1" />
            {bookData.pageCount} pages
          </Badge>
        )}
        {bookData.year && (
          <Badge variant="secondary" className="bg-bg-orange text-learning-orange border-learning-orange/30 px-3 md:px-4 py-2 rounded-full font-bold text-sm md:text-base">
            <Icon name="calendar" size={14} className="mr-1" />
            {bookData.year}
          </Badge>
        )}
        {bookData.bannedBook && (
          <Badge variant="destructive" className="bg-bg-red text-learning-red border-learning-red/30 px-3 md:px-4 py-2 rounded-full font-bold text-sm md:text-base">
            <Icon name="alertTriangle" size={14} className="mr-1" />
            Challenged Book
          </Badge>
        )}
      </div>
    </article>
  );
};

export default BookCard;