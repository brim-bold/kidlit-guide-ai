import { IconMap, type IconName } from './IconMap';
import { cn } from '@/lib/utils';

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
  color?: string;
}

export const Icon = ({ name, size = 20, className, color }: IconProps) => {
  const IconComponent = IconMap[name];
  
  return (
    <IconComponent 
      size={size} 
      color={color}
      className={cn('inline-block', className)} 
    />
  );
};