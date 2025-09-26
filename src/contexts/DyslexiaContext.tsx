import React, { createContext, useContext, useState, useEffect } from 'react';

interface DyslexiaContextType {
  isDyslexicFont: boolean;
  toggleDyslexicFont: () => void;
}

const DyslexiaContext = createContext<DyslexiaContextType | undefined>(undefined);

export const DyslexiaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDyslexicFont, setIsDyslexicFont] = useState(() => {
    const saved = localStorage.getItem('dyslexic-font');
    return saved === 'true';
  });

  const toggleDyslexicFont = () => {
    setIsDyslexicFont(prev => {
      const newValue = !prev;
      localStorage.setItem('dyslexic-font', newValue.toString());
      return newValue;
    });
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dyslexic-font', isDyslexicFont);
  }, [isDyslexicFont]);

  return (
    <DyslexiaContext.Provider value={{ isDyslexicFont, toggleDyslexicFont }}>
      {children}
    </DyslexiaContext.Provider>
  );
};

export const useDyslexia = () => {
  const context = useContext(DyslexiaContext);
  if (!context) {
    throw new Error('useDyslexia must be used within a DyslexiaProvider');
  }
  return context;
};