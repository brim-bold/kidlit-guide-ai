import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { useGameification } from '@/hooks/useGameification';

interface PointsButtonProps {
  activityType: 'vocabulary' | 'discussion' | 'creative';
  children: React.ReactNode;
  bookTitle?: string;
  className?: string;
}

const PointsButton = ({ activityType, children, bookTitle, className = '' }: PointsButtonProps) => {
  const { awardPoints } = useGameification();

  const pointsMap = {
    vocabulary: 10,
    discussion: 20,
    creative: 30
  };

  const handleClick = () => {
    awardPoints(activityType, bookTitle);
  };

  return (
    <Button
      onClick={handleClick}
      className={`btn-cheerful group ${className}`}
    >
      <span className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 group-hover:animate-spin" />
        {children}
        <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
          +{pointsMap[activityType]}
        </span>
      </span>
    </Button>
  );
};

export default PointsButton;