import { Lightbulb, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StrategySpotlightProps {
  comprehensionSkill: string;
  strategyTip: string;
  onClose: () => void;
}

const StrategySpotlight = ({ comprehensionSkill, strategyTip, onClose }: StrategySpotlightProps) => {
  return (
    <section className="mb-6 md:mb-8 bg-gradient-warning/20 rounded-2xl p-6 md:p-8 border-2 border-learning-orange/30 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <Lightbulb className="text-learning-orange flex-shrink-0" size={28} />
            <h2 className="text-xl md:text-2xl font-bold text-learning-orange">Strategy Spotlight</h2>
          </div>
          <div className="bg-card rounded-xl p-4 md:p-5 mb-4 shadow-button">
            <p className="text-base md:text-lg font-bold text-learning-orange mb-2">
              📚 Focus Skill: {comprehensionSkill}
            </p>
            <p className="text-card-foreground text-sm md:text-base leading-relaxed">{strategyTip}</p>
          </div>
          <p className="text-sm md:text-base text-learning-orange italic font-medium">
            💡 Use this strategy while reading!
          </p>
        </div>
        <Button 
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground p-2 rounded-lg hover:bg-card"
        >
          <X size={24} />
        </Button>
      </div>
    </section>
  );
};

export default StrategySpotlight;