import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TextToSpeechButtonProps {
  text: string;
  voice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
  className?: string;
  children?: React.ReactNode;
}

const TextToSpeechButton = ({ 
  text, 
  voice = 'alloy', 
  className = '', 
  children 
}: TextToSpeechButtonProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const handleSpeech = async () => {
    if (isPlaying && audio) {
      // Stop current audio
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
      return;
    }

    if (!text.trim()) {
      toast({
        title: "No Text",
        description: "No text available to read aloud.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { 
          text: text,
          voice: voice,
          speed: 1.0
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to generate speech');
      }

      // Convert base64 to audio blob and play
      const audioBlob = new Blob(
        [Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0))],
        { type: 'audio/mpeg' }
      );

      const audioUrl = URL.createObjectURL(audioBlob);
      const newAudio = new Audio(audioUrl);
      
      newAudio.onloadeddata = () => {
        setIsLoading(false);
        setIsPlaying(true);
        newAudio.play();
      };

      newAudio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
        setAudio(null);
      };

      newAudio.onerror = () => {
        setIsLoading(false);
        setIsPlaying(false);
        toast({
          title: "Playback Error",
          description: "Unable to play the generated audio.",
          variant: "destructive"
        });
      };

      setAudio(newAudio);

    } catch (error) {
      console.error('Text-to-speech error:', error);
      setIsLoading(false);
      toast({
        title: "Speech Generation Failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive"
      });
    }
  };

  const getIcon = () => {
    if (isLoading) return <Loader2 className="w-4 h-4 animate-spin" />;
    if (isPlaying) return <VolumeX className="w-4 h-4" />;
    return <Volume2 className="w-4 h-4" />;
  };

  const getLabel = () => {
    if (isLoading) return 'Generating...';
    if (isPlaying) return 'Stop';
    return children || 'Listen';
  };

  return (
    <Button
      onClick={handleSpeech}
      variant="outline"
      size="sm"
      className={`flex items-center gap-2 ${className}`}
      disabled={isLoading}
    >
      {getIcon()}
      {getLabel()}
    </Button>
  );
};

export default TextToSpeechButton;