import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, voice = 'alloy', speed = 1.0 } = await req.json();

    if (!text) {
      throw new Error('Text is required for speech synthesis');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Generating speech for text:', text.substring(0, 50) + '...');

    // Call OpenAI Text-to-Speech API
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: text,
        voice: voice,
        response_format: 'mp3',
        speed: speed
      }),
    });

    if (!response.ok) {
      let errorText = '';
      let errorMessage = '';
      
      try {
        errorText = await response.text();
        const errorData = JSON.parse(errorText);
        
        // Handle specific OpenAI error types
        if (errorData.error) {
          switch (errorData.error.code) {
            case 'insufficient_quota':
              errorMessage = 'OpenAI API quota exceeded. Please check your billing details and add credits to your OpenAI account.';
              break;
            case 'rate_limit_exceeded':
              errorMessage = 'OpenAI API rate limit exceeded. Please try again in a moment.';
              break;
            case 'invalid_api_key':
              errorMessage = 'Invalid OpenAI API key configured.';
              break;
            default:
              errorMessage = errorData.error.message || `OpenAI API error: ${response.status}`;
          }
        } else {
          errorMessage = `OpenAI API error: ${response.status}`;
        }
      } catch (parseError) {
        errorMessage = `OpenAI API error: ${response.status}`;
        errorText = await response.text().catch(() => 'Unable to read error response');
      }
      
      console.error('OpenAI TTS API error:', response.status, errorText);
      throw new Error(errorMessage);
    }

    // Get the audio buffer and convert to base64
    const arrayBuffer = await response.arrayBuffer();
    const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

    console.log('Speech generated successfully, audio length:', base64Audio.length);

    return new Response(
      JSON.stringify({ 
        audioContent: base64Audio,
        format: 'mp3'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );

  } catch (error) {
    console.error('Error in text-to-speech function:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});