import { Button } from '@/components/ui/button';

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
      <div className="bg-card rounded-2xl p-6 md:p-8 max-w-md shadow-card">
        <div className="text-center">
          <div className="text-5xl md:text-6xl mb-4" aria-hidden="true">📚</div>
          <h3 id="banned-book-title" className="text-xl md:text-2xl font-bold text-card-foreground mb-4">
            Important Notice
          </h3>
          <p className="text-card-foreground mb-4 text-base md:text-lg">
            This book has been challenged or banned in some communities. 
          </p>
          <div className="bg-gradient-warning/20 rounded-lg p-4 mb-6 border-2 border-learning-purple/30">
            <p className="text-card-foreground font-semibold text-sm md:text-base">
              We believe in the freedom to read and encourage exploring diverse perspectives through books!
            </p>
          </div>
          <Button
            onClick={onClose}
            className="bg-gradient-primary text-primary-foreground px-6 md:px-8 py-3 rounded-lg font-semibold hover:scale-hover transition-bounce shadow-button hover:shadow-hover text-base md:text-lg"
            aria-label="Close notice and continue to book"
          >
            Continue Reading Journey! 📖
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BannedBookWarning;