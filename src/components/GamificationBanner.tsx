import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Flame, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GamificationBanner = () => {
  const navigate = useNavigate();

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 mb-6">
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <h3 className="font-bold text-learning-blue text-lg mb-2 flex items-center justify-center md:justify-start gap-2">
              <Trophy className="w-5 h-5" />
              Unlock Your Reading Adventure!
            </h3>
            <p className="text-sm text-foreground/70 mb-3">
              Sign up to earn points, track your reading streak, and collect badges!
            </p>
            <div className="flex items-center justify-center md:justify-start gap-4 text-sm">
              <div className="flex items-center gap-1 text-learning-green">
                <Star className="w-4 h-4" />
                <span>Earn Points</span>
              </div>
              <div className="flex items-center gap-1 text-learning-orange">
                <Flame className="w-4 h-4" />
                <span>Track Streaks</span>
              </div>
              <div className="flex items-center gap-1 text-learning-purple">
                <Trophy className="w-4 h-4" />
                <span>Collect Badges</span>
              </div>
            </div>
          </div>
          
          <Button
            onClick={() => navigate('/auth')}
            className="bg-learning-blue hover:bg-learning-blue/90 text-white font-semibold px-6"
          >
            Join Now - It's Free!
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GamificationBanner;