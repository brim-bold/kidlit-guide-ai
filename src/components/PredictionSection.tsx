import { MessageSquare } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface PredictionSectionProps {
  predictions: string[];
  userPredictions: { [key: number]: string };
  onPredictionChange: (index: number, value: string) => void;
}

const PredictionSection = ({ predictions, userPredictions, onPredictionChange }: PredictionSectionProps) => {
  return (
    <section className="mb-6 md:mb-8 bg-gradient-info/20 rounded-2xl p-6 md:p-8 border-2 border-learning-blue/30 shadow-card">
      <div className="flex items-center gap-3 mb-4">
        <MessageSquare className="text-learning-blue flex-shrink-0" size={28} />
        <h2 className="text-xl md:text-2xl font-bold text-learning-blue">Before You Read: Make Predictions!</h2>
      </div>
      {predictions.map((pred, idx) => (
        <div key={idx} className="mb-4">
          <Label htmlFor={`prediction-${idx}`} className="block text-foreground font-semibold mb-2 text-sm md:text-base">
            {pred}
          </Label>
          <Textarea
            id={`prediction-${idx}`}
            value={userPredictions[idx] || ''}
            onChange={(e) => onPredictionChange(idx, e.target.value)}
            placeholder="Type your prediction here..."
            className="w-full p-3 md:p-4 text-base border-2 border-learning-blue/30 rounded-xl focus:border-learning-blue focus:ring-4 focus:ring-learning-blue/20 transition-smooth"
            rows={3}
          />
        </div>
      ))}
      <p className="text-sm md:text-base text-learning-blue italic font-medium mt-4">
        ✨ Great readers make predictions!
      </p>
    </section>
  );
};

export default PredictionSection;