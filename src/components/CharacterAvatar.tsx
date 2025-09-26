import React from 'react';
import cheerfulFace from '@/assets/faces/cheerful-face.png';
import excitedFace from '@/assets/faces/excited-face.png';
import sleepyFace from '@/assets/faces/sleepy-face.png';
import shockedFace from '@/assets/faces/shocked-face.png';
import winkFace from '@/assets/faces/wink-face.png';
import starFace from '@/assets/faces/star-face.png';
import flowerFace from '@/assets/faces/flower-face.png';
import cloverFace from '@/assets/faces/clover-face.png';

export type CharacterType = 'cheerful' | 'excited' | 'sleepy' | 'shocked' | 'wink' | 'star' | 'flower' | 'clover';

interface CharacterAvatarProps {
  character: CharacterType;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animate?: boolean;
}

const characterImages = {
  cheerful: cheerfulFace,
  excited: excitedFace,
  sleepy: sleepyFace,
  shocked: shockedFace,
  wink: winkFace,
  star: starFace,
  flower: flowerFace,
  clover: cloverFace,
};

const sizeMap = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24',
};

const CharacterAvatar = ({ character, size = 'md', className = '', animate = true }: CharacterAvatarProps) => {
  const animationClass = animate ? 'hover:scale-110 hover:rotate-12 transition-all duration-300' : '';
  
  return (
    <div className={`${sizeMap[size]} ${animationClass} ${className}`}>
      <img
        src={characterImages[character]}
        alt={`${character} character`}
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default CharacterAvatar;