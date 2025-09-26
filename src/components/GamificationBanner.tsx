import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Flame, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GamificationBanner = () => {
  const navigate = useNavigate();

  return (
        <Card className="card-sunset mb-6 hover-lift animate-fade-in">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <h3 className="font-bold text-learning-blue text-lg mb-2 flex items-center justify-center md:justify-start gap-2">
                  <Trophy className="w-5 h-5 animate-pulse-glow" />
                  <span className="text-gradient-ocean">Unlock Your Reading Adventure!</span>
                </h3>
                <p className="text-sm text-foreground/70 mb-3">
                  Sign up to earn points, track your reading streak, and collect badges!
                </p>
                <div className="flex items-center justify-center md:justify-start gap-4 text-sm">
                  <div className="flex items-center gap-1 text-learning-green">
                    <Star className="w-4 h-4" />
                    <span>Earn Points</span>
                  </div>
                  <div className="flex items-center gap-1 text-learning-coral">
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
                className="btn-sunset hover-lift font-semibold px-6 animate-pulse-glow"
              >
                Join Now - It's Free!
              </Button>
            </div>
          </CardContent>
        </Card>
  );
};

export default GamificationBanner;