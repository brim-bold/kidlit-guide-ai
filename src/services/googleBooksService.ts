export interface GoogleBook {
  id: string;
  title: string;
  author: string;
  summary: string;
  coverImage?: string;
  pageCount?: number;
  publishedDate?: string;
  categories?: string[];
  vocabulary?: string[];
  questions?: string[];
  activities?: string[];
  predictions?: string[];
  comprehensionSkill?: string;
}

interface GoogleBooksApiResponse {
  items?: Array<{
    id: string;
    volumeInfo: {
      title: string;
      authors?: string[];
      description?: string;
      imageLinks?: {
        thumbnail?: string;
        smallThumbnail?: string;
      };
      pageCount?: number;
      publishedDate?: string;
      categories?: string[];
    };
  }>;
}

class GoogleBooksService {
  private readonly baseUrl = 'https://www.googleapis.com/books/v1/volumes';

  async searchBooks(query: string, maxResults: number = 10): Promise<GoogleBook[]> {
    try {
      const searchUrl = `${this.baseUrl}?q=${encodeURIComponent(query)}&maxResults=${maxResults}&printType=books&langRestrict=en`;
      
      const response = await fetch(searchUrl);
      
      if (!response.ok) {
        throw new Error(`Google Books API error: ${response.status}`);
      }

      const data: GoogleBooksApiResponse = await response.json();
      
      if (!data.items || data.items.length === 0) {
        return [];
      }

      return data.items.map(item => this.transformGoogleBookData(item));
    } catch (error) {
      console.error('Error searching Google Books:', error);
      throw new Error('Failed to search books. Please try again.');
    }
  }

  async getBookById(bookId: string): Promise<GoogleBook | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${bookId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Google Books API error: ${response.status}`);
      }

      const item = await response.json();
      return this.transformGoogleBookData(item);
    } catch (error) {
      console.error('Error fetching book by ID:', error);
      return null;
    }
  }

  private transformGoogleBookData(item: any): GoogleBook {
    const volumeInfo = item.volumeInfo;
    
    // Generate educational content based on the book
    const vocabulary = this.generateVocabulary(volumeInfo.title, volumeInfo.categories);
    const questions = this.generateQuestions(volumeInfo.title, volumeInfo.description);
    const activities = this.generateActivities(volumeInfo.title, volumeInfo.categories);
    const predictions = this.generatePredictions(volumeInfo.title, volumeInfo.description);

    return {
      id: item.id,
      title: volumeInfo.title || 'Unknown Title',
      author: volumeInfo.authors?.join(', ') || 'Unknown Author',
      summary: this.cleanDescription(volumeInfo.description) || 'No description available.',
      coverImage: this.getHighResolutionCoverImage(volumeInfo.imageLinks),
      pageCount: volumeInfo.pageCount,
      publishedDate: volumeInfo.publishedDate,
      categories: volumeInfo.categories,
      vocabulary,
      questions,
      activities,
      predictions,
      comprehensionSkill: this.getComprehensionSkill(volumeInfo.categories)
    };
  }

  private getHighResolutionCoverImage(imageLinks?: { thumbnail?: string; smallThumbnail?: string }): string | undefined {
    if (!imageLinks?.thumbnail && !imageLinks?.smallThumbnail) {
      return undefined;
    }
    
    // Use thumbnail URL and modify it for higher resolution
    const originalUrl = imageLinks.thumbnail || imageLinks.smallThumbnail;
    if (!originalUrl) return undefined;
    
    // Replace zoom=1 with zoom=2 for higher resolution, and add edge=curl for better quality
    const highResUrl = originalUrl
      .replace('zoom=1', 'zoom=2')
      .replace('zoom=5', 'zoom=2') // In case smallThumbnail is used
      .replace('&source=gbs_api', '&edge=curl&source=gbs_api');
    
    return highResUrl;
  }

  private cleanDescription(description?: string): string {
    if (!description) return '';
    
    // Remove HTML tags and clean up the description
    return description
      .replace(/<[^>]*>/g, '')
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .trim();
  }

  private generateVocabulary(title: string, categories?: string[]): string[] {
    const vocabularyByCategory: { [key: string]: string[] } = {
      fiction: ['protagonist', 'setting', 'plot', 'theme', 'character', 'narrative'],
      fantasy: ['magical', 'enchanted', 'mystical', 'adventure', 'quest', 'kingdom'],
      science: ['experiment', 'discovery', 'hypothesis', 'observation', 'conclusion', 'research'],
      history: ['timeline', 'civilization', 'culture', 'heritage', 'tradition', 'ancient'],
      mystery: ['clues', 'investigation', 'evidence', 'suspect', 'detective', 'solution'],
      biography: ['accomplishment', 'influence', 'inspiration', 'determination', 'achievement', 'legacy']
    };

    // Generate vocabulary based on categories or use general terms
    let vocab: string[] = [];
    
    if (categories && categories.length > 0) {
      categories.forEach(category => {
        const key = category.toLowerCase();
        Object.keys(vocabularyByCategory).forEach(vocabKey => {
          if (key.includes(vocabKey)) {
            vocab.push(...vocabularyByCategory[vocabKey]);
          }
        });
      });
    }

    // If no category-specific vocabulary found, use general reading terms
    if (vocab.length === 0) {
      vocab = ['character', 'setting', 'plot', 'theme', 'conflict', 'resolution'];
    }

    // Return first 5 unique vocabulary words
    return [...new Set(vocab)].slice(0, 5);
  }

  private generateQuestions(title: string, description?: string): string[] {
    const questions = [
      `What do you think "${title}" will be about based on the title?`,
      'Who do you predict will be the main character in this story?',
      'What challenges might the characters face in this book?',
      'Based on the description, what genre do you think this book belongs to?',
      'What do you hope to learn or discover from reading this book?'
    ];

    return questions;
  }

  private generateActivities(title: string, categories?: string[]): string[] {
    const activities = [
      `Create a book cover design for "${title}" using your own artistic style`,
      'Write a letter to the main character giving them advice',
      'Design a comic strip showing your favorite scene from the book',
      'Create a timeline of the major events in the story',
      'Write an alternative ending to the story',
      'Make a character trading card with stats and special abilities'
    ];

    return activities.slice(0, 4);
  }

  private generatePredictions(title: string, description?: string): string[] {
    return [
      'What do you think will happen in this story?',
      'How do you think the main problem will be solved?',
      'What kind of ending do you predict for this book?'
    ];
  }

  private getComprehensionSkill(categories?: string[]): string {
    if (!categories || categories.length === 0) {
      return 'Making Connections - Connecting Ideas';
    }

    const category = categories[0].toLowerCase();
    
    if (category.includes('fiction') || category.includes('literature')) {
      return 'Character Analysis - Understanding Characters';
    } else if (category.includes('science') || category.includes('nature')) {
      return 'Cause and Effect - Understanding Science';
    } else if (category.includes('history') || category.includes('biography')) {
      return 'Sequence of Events - Understanding Time';
    } else if (category.includes('mystery') || category.includes('adventure')) {
      return 'Making Inferences - Reading Between Lines';
    } else {
      return 'Making Connections - Connecting Ideas';
    }
  }
}

export const googleBooksService = new GoogleBooksService();