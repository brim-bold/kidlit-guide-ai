import { Badge } from '@/components/ui/badge';

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
    <article className="bg-gradient-card rounded-2xl shadow-card p-6 md:p-8 mb-6 md:mb-8 border-2 border-accent">
      <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-2">{bookData.title}</h2>
      <p className="text-lg md:text-2xl text-primary mb-4 font-semibold">by {bookData.author}</p>
      <div className="flex flex-wrap gap-2 md:gap-3">
        <Badge variant="secondary" className="bg-learning-blue/20 text-learning-blue border-learning-blue/30 px-3 md:px-4 py-2 rounded-full font-bold text-sm md:text-base">
          AR Level: {bookData.arLevel}
        </Badge>
        <Badge variant="secondary" className="bg-learning-green/20 text-learning-green border-learning-green/30 px-3 md:px-4 py-2 rounded-full font-bold text-sm md:text-base">
          Grade: {bookData.gradeLevel}
        </Badge>
        {bookData.pageCount && (
          <Badge variant="secondary" className="bg-learning-purple/20 text-learning-purple border-learning-purple/30 px-3 md:px-4 py-2 rounded-full font-bold text-sm md:text-base">
            📄 {bookData.pageCount} pages
          </Badge>
        )}
        {bookData.year && (
          <Badge variant="secondary" className="bg-learning-orange/20 text-learning-orange border-learning-orange/30 px-3 md:px-4 py-2 rounded-full font-bold text-sm md:text-base">
            📅 {bookData.year}
          </Badge>
        )}
        {bookData.bannedBook && (
          <Badge variant="destructive" className="bg-destructive/20 text-destructive border-destructive/30 px-3 md:px-4 py-2 rounded-full font-bold text-sm md:text-base">
            ⚠️ Challenged Book
          </Badge>
        )}
      </div>
    </article>
  );
};

export default BookCard;