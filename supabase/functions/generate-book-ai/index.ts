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
    const { prompt, ageRange = "8-12", genre = "adventure" } = await req.json();

    if (!prompt) {
      throw new Error('Prompt is required');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const systemPrompt = `You are an expert children's book creator and educator. Create engaging, age-appropriate content for children aged ${ageRange}. 

Generate a complete book profile including:
1. An engaging title
2. Author name (you can be creative)
3. A compelling summary (2-3 paragraphs)
4. 5 vocabulary words appropriate for the age group
5. 5 discussion questions that promote critical thinking
6. 4 creative activities related to the book
7. 3 prediction prompts for before reading
8. A comprehension skill focus

Make sure all content is educational, safe, and promotes positive values. The genre should be ${genre}.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Create a ${genre} book for children aged ${ageRange} based on this idea: ${prompt}` }
        ],
        max_tokens: 1500,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;

    // Parse the AI response and structure it
    const bookData = parseAIBookResponse(generatedContent);

    console.log('Generated book data:', bookData);

    return new Response(JSON.stringify({ book: bookData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-book-ai function:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function parseAIBookResponse(content: string) {
  // This function parses the AI response and extracts structured data
  // For now, we'll create a structured response based on common patterns
  
  const lines = content.split('\n').filter(line => line.trim());
  
  // Extract title (usually first line or after "Title:")
  let title = "AI Generated Story";
  let author = "AI Assistant";
  let summary = "";
  let vocabulary: string[] = [];
  let questions: string[] = [];
  let activities: string[] = [];
  let predictions: string[] = [];
  
  let currentSection = "";
  
  for (const line of lines) {
    const cleanLine = line.trim();
    
    // Check for section headers
    if (cleanLine.toLowerCase().includes('title:') || cleanLine.startsWith('**Title')) {
      title = cleanLine.replace(/\*\*?Title:?\*\*?/i, '').trim();
      continue;
    }
    
    if (cleanLine.toLowerCase().includes('author:') || cleanLine.startsWith('**Author')) {
      author = cleanLine.replace(/\*\*?Author:?\*\*?/i, '').trim();
      continue;
    }
    
    if (cleanLine.toLowerCase().includes('summary') || cleanLine.toLowerCase().includes('description')) {
      currentSection = "summary";
      continue;
    }
    
    if (cleanLine.toLowerCase().includes('vocabulary')) {
      currentSection = "vocabulary";
      continue;
    }
    
    if (cleanLine.toLowerCase().includes('question') || cleanLine.toLowerCase().includes('discussion')) {
      currentSection = "questions";
      continue;
    }
    
    if (cleanLine.toLowerCase().includes('activit')) {
      currentSection = "activities";
      continue;
    }
    
    if (cleanLine.toLowerCase().includes('prediction')) {
      currentSection = "predictions";
      continue;
    }
    
    // Add content to current section
    if (cleanLine && !cleanLine.startsWith('**') && !cleanLine.startsWith('#')) {
      switch (currentSection) {
        case "summary":
          summary += cleanLine + " ";
          break;
        case "vocabulary":
          if (cleanLine.match(/^\d+\./) || cleanLine.startsWith('-') || cleanLine.startsWith('•')) {
            const word = cleanLine.replace(/^\d+\.?\s*[-•]?\s*/, '').split(/[:-]/)[0].trim();
            if (word && vocabulary.length < 5) vocabulary.push(word);
          }
          break;
        case "questions":
          if (cleanLine.match(/^\d+\./) || cleanLine.startsWith('-') || cleanLine.startsWith('•')) {
            const question = cleanLine.replace(/^\d+\.?\s*[-•]?\s*/, '').trim();
            if (question && questions.length < 5) questions.push(question);
          }
          break;
        case "activities":
          if (cleanLine.match(/^\d+\./) || cleanLine.startsWith('-') || cleanLine.startsWith('•')) {
            const activity = cleanLine.replace(/^\d+\.?\s*[-•]?\s*/, '').trim();
            if (activity && activities.length < 4) activities.push(activity);
          }
          break;
        case "predictions":
          if (cleanLine.match(/^\d+\./) || cleanLine.startsWith('-') || cleanLine.startsWith('•')) {
            const prediction = cleanLine.replace(/^\d+\.?\s*[-•]?\s*/, '').trim();
            if (prediction && predictions.length < 3) predictions.push(prediction);
          }
          break;
      }
    }
  }
  
  // Fallbacks if parsing didn't work well
  if (!title || title === "AI Generated Story") {
    title = `The ${["Magical", "Amazing", "Wonderful", "Incredible", "Fantastic"][Math.floor(Math.random() * 5)]} Adventure`;
  }
  
  if (!summary || summary.trim().length < 50) {
    summary = "An exciting story that will capture young readers' imagination and teach valuable lessons about friendship, courage, and discovery.";
  }
  
  if (vocabulary.length === 0) {
    vocabulary = ["adventure", "courage", "friendship", "discovery", "challenge"];
  }
  
  if (questions.length === 0) {
    questions = [
      "What do you think will happen next in the story?",
      "How do you think the main character feels?",
      "What would you do in this situation?",
      "What lesson can we learn from this story?",
      "How does this story relate to your own experiences?"
    ];
  }
  
  if (activities.length === 0) {
    activities = [
      "Draw your favorite scene from the story",
      "Write a letter to the main character",
      "Create an alternate ending",
      "Design a book cover"
    ];
  }
  
  if (predictions.length === 0) {
    predictions = [
      "What do you think this story will be about?",
      "What challenges might the main character face?",
      "How do you think the story will end?"
    ];
  }
  
  return {
    id: `ai-generated-${Date.now()}`,
    title: title,
    author: author,
    summary: summary.trim(),
    vocabulary: vocabulary,
    questions: questions,
    activities: activities,
    predictions: predictions,
    comprehensionSkill: "Making Predictions - Thinking Ahead",
    coverImage: null // Could add AI image generation here later
  };
}