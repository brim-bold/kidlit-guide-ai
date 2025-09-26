import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icons/Icon';

interface BannedBookWarningProps {
  onClose: () => void;
}

const BannedBookWarning = ({ onClose }: BannedBookWarningProps) => {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="banned-book-title"
    >
      <div className="bg-card rounded-xl p-6 md:p-8 max-w-md shadow-lg">
        <div className="text-center">
          <div className="flex justify-center mb-4" aria-hidden="true">
            <div className="w-16 h-16 bg-bg-orange rounded-full flex items-center justify-center">
              <Icon name="book" size={32} className="text-learning-orange" />
            </div>
          </div>
          <h3 id="banned-book-title" className="text-xl md:text-2xl font-bold text-card-foreground mb-4">
            Important Notice
          </h3>
          <p className="text-card-foreground mb-4 text-base md:text-lg">
            This book has been challenged or banned in some communities. 
          </p>
          <div className="bg-bg-purple rounded-lg p-4 mb-6 border border-learning-purple/30">
            <p className="text-card-foreground font-semibold text-sm md:text-base">
              We believe in the freedom to read and encourage exploring diverse perspectives through books!
            </p>
          </div>
          <Button
            onClick={onClose}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 md:px-8 py-3 rounded-lg font-semibold hover:scale-105 transition-smooth shadow-sm hover:shadow-md text-base md:text-lg"
            aria-label="Close notice and continue to book"
          >
            <Icon name="bookOpen" size={18} className="mr-2" />
            Continue Reading Journey!
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BannedBookWarning;