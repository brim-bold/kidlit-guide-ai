import React from 'react';
import { Button } from '@/components/ui/button';
import { useDyslexia } from '@/contexts/DyslexiaContext';
import { Type } from 'lucide-react';

export const DyslexiaToggle: React.FC = () => {
  const { isDyslexicFont, toggleDyslexicFont } = useDyslexia();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleDyslexicFont}
      className="flex items-center gap-2 transition-colors hover:bg-learning-peach/10"
      title={isDyslexicFont ? "Switch to regular font" : "Switch to dyslexia-friendly font"}
    >
      <Type className="h-4 w-4" />
      {isDyslexicFont ? "Regular Font" : "Dyslexic Font"}
    </Button>
  );
};