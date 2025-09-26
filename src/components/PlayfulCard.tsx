import React from 'react';
import { Card } from '@/components/ui/card';
import CharacterAvatar, { CharacterType } from '@/components/CharacterAvatar';

interface PlayfulCardProps {
  children: React.ReactNode;
  character?: CharacterType;
  variant?: 'default' | 'cheerful' | 'magical' | 'calm';
  className?: string;
  showCharacter?: boolean;
}

const variantStyles = {
  default: 'card-character',
  cheerful: 'card-character border-character-yellow/30 bg-bg-yellow/20',
  magical: 'card-character border-character-pink/30 bg-bg-pink/20', 
  calm: 'card-character border-character-blue/30 bg-bg-blue/20',
};

const PlayfulCard = ({ 
  children, 
  character = 'cheerful', 
  variant = 'default', 
  className = '',
  showCharacter = true 
}: PlayfulCardProps) => {
  return (
    <Card className={`${variantStyles[variant]} ${className}`}>
      {showCharacter && (
        <div className="absolute -top-6 -right-6 z-10">
          <CharacterAvatar character={character} size="lg" />
        </div>
      )}
      <div className="relative">
        {children}
      </div>
    </Card>
  );
};

export default PlayfulCard;