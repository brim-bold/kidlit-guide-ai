import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icons/Icon';
import PointsButton from '@/components/PointsButton';
import TextToSpeechButton from '@/components/TextToSpeechButton';
import CharacterAvatar from '@/components/CharacterAvatar';

interface BookData {
  title: string;
  author: string;
  summary: string;
  vocabulary?: string[];
  questions?: string[];
  activities?: string[];
}

interface BookTabsProps {
  bookData: BookData;
  userPredictions: { [key: number]: string };
  isAuthenticated?: boolean;
}

const BookTabs = ({ bookData, userPredictions, isAuthenticated = false }: BookTabsProps) => {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <div className="bg-character-blue p-1 rounded-2xl mb-6">
        <TabsList className="flex gap-1 bg-transparent w-full">
          {['overview', 'vocabulary', 'questions', 'activities', 'reflection'].map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="flex-1 px-3 py-2 rounded-xl font-medium text-sm whitespace-nowrap data-[state=active]:bg-white data-[state=active]:text-character-blue data-[state=active]:shadow-sm data-[state=inactive]:text-white/90 hover:text-white transition-all focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-character-blue"
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <div className="p-6">
        <TabsContent value="overview" className="space-y-4">
          <div className="bg-bg-blue rounded-2xl p-6 border border-character-blue/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                <CharacterAvatar character="sleepy" size="sm" animate={false} />
                Book Summary
              </h3>
              <TextToSpeechButton 
                text={bookData.summary} 
                voice="nova"
                className="btn-calm"
              />
            </div>
            <p className="text-foreground leading-relaxed">
              {bookData.summary}
            </p>
          </div>
        </TabsContent>

        <TabsContent value="vocabulary" className="space-y-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
              <CharacterAvatar character="excited" size="sm" animate={false} />
              Key Vocabulary
            </h3>
            <TextToSpeechButton 
              text={bookData.vocabulary?.join(', ') || ''} 
              voice="echo"
              className="btn-magical"
            >
              Read All
            </TextToSpeechButton>
          </div>
          <div className="grid gap-3">
            {bookData.vocabulary?.map((word, idx) => (
              <div key={idx} className="bg-bg-orange rounded-2xl p-4 border border-character-orange/20 flex items-center justify-between">
                <p className="text-lg font-bold text-character-orange">{word}</p>
                <div className="flex items-center gap-2">
                  <TextToSpeechButton 
                    text={word} 
                    voice="echo"
                    className="text-xs border border-character-orange/50 text-character-orange hover:bg-character-orange hover:text-white rounded-xl px-3 py-1"
                  />
                  {isAuthenticated ? (
                    <PointsButton 
                      activityType="vocabulary" 
                      bookTitle={bookData.title}
                      className="text-sm"
                    >
                      Learn
                    </PointsButton>
                  ) : (
                    <Badge variant="outline" className="text-character-orange border-character-orange">
                      +10 pts
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="questions" className="space-y-4">
          <div className="bg-bg-yellow rounded-2xl p-4 mb-6 border border-character-yellow/20">
            <h4 className="font-bold text-character-yellow mb-3 flex items-center gap-2">
              <CharacterAvatar character="wink" size="sm" animate={false} />
              Question Guide
            </h4>
            <div className="space-y-2">
              <p className="text-sm text-foreground flex items-center gap-2">
                <Icon name="circle" size={12} className="text-character-blue" /> 
                <strong className="text-character-blue">Blue</strong> = Find in text
              </p>
              <p className="text-sm text-foreground flex items-center gap-2">
                <Icon name="circle" size={12} className="text-character-green" /> 
                <strong className="text-character-green">Green</strong> = Think deeper
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            {bookData.questions?.map((q, idx) => {
              const isTextBased = idx % 2 === 0;
              const markerColor = isTextBased ? 'character-blue' : 'character-green';
              const bgColor = isTextBased ? 'bg-blue' : 'bg-green';
              const borderColor = isTextBased ? 'character-blue/20' : 'character-green/20';
              
              return (
                <div key={idx} className={`bg-${bgColor} rounded-2xl p-4 border border-${borderColor} flex items-start gap-3`}>
                  <Icon name="circle" size={14} className={`text-${markerColor} shrink-0 mt-1`} />
                  <p className="text-foreground font-medium flex-1">{q}</p>
                  {isAuthenticated ? (
                    <PointsButton 
                      activityType="discussion" 
                      bookTitle={bookData.title}
                      className="shrink-0 text-sm"
                    >
                      Answer
                    </PointsButton>
                  ) : (
                    <Badge variant="outline" className={`text-${markerColor} border-${markerColor} shrink-0 text-xs`}>
                      +20 pts
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="activities" className="space-y-4">
          <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <CharacterAvatar character="flower" size="sm" animate={false} />
            Fun Activities
          </h3>
          <div className="space-y-3">
            {bookData.activities?.map((activity, idx) => (
              <div key={idx} className="bg-bg-purple rounded-2xl p-4 border border-character-purple/20 flex items-start justify-between gap-4">
                <p className="text-foreground font-medium flex-1">{activity}</p>
                {isAuthenticated ? (
                  <PointsButton 
                    activityType="creative" 
                    bookTitle={bookData.title}
                    className="shrink-0 text-sm"
                  >
                    Do It
                  </PointsButton>
                ) : (
                  <Badge variant="outline" className="text-character-purple border-character-purple shrink-0 text-xs">
                    +30 pts
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reflection" className="space-y-6">
          <div className="bg-bg-green rounded-2xl p-6 border border-character-green/20">
            <h3 className="font-bold text-character-green mb-4 text-xl flex items-center gap-2">
              <CharacterAvatar character="clover" size="sm" animate={false} />
              Story Summary Framework
            </h3>
            <p className="text-muted-foreground mb-6 italic">Tell us about the story:</p>
            
            <div className="space-y-4">
              {[
                { label: 'Somebody', hint: 'Who is the main character?' },
                { label: 'Wanted', hint: 'What was their goal?' },
                { label: 'But', hint: 'What was the problem?' },
                { label: 'So', hint: 'What did they do?' },
                { label: 'Then', hint: 'How did it end?' }
              ].map((item, idx) => (
                <div key={idx}>
                  <Label className="block text-character-green font-bold mb-2">
                    {item.label} <span className="font-normal text-muted-foreground text-sm">({item.hint})</span>
                  </Label>
                  <Input 
                    type="text"
                    placeholder={`Tell us about ${item.label.toLowerCase()}...`}
                    className="w-full p-3 border border-character-green/30 rounded-xl focus:border-character-green focus:ring-2 focus:ring-character-green/20"
                  />
                </div>
              ))}
            </div>

            <div className="mt-6 bg-white/50 rounded-xl p-4 border border-character-green/20">
              <p className="text-character-green font-medium flex items-center gap-2">
                <Icon name="lightbulb" size={16} />
                <strong>Parent Tip:</strong> Ask your child to say their summary out loud first!
              </p>
            </div>
          </div>

          {Object.keys(userPredictions).length > 0 && (
            <div className="bg-bg-blue rounded-2xl p-6 border border-character-blue/20">
              <h3 className="font-bold text-character-blue mb-4 text-xl flex items-center gap-2">
                <CharacterAvatar character="shocked" size="sm" animate={false} />
                How Were Your Predictions?
              </h3>
              <p className="text-muted-foreground mb-4">Look back at what you predicted:</p>
              <div className="space-y-3">
                {Object.entries(userPredictions).map(([idx, pred]) => (
                  pred && (
                    <div key={idx} className="bg-white/50 rounded-xl p-4 border border-character-blue/20">
                      <p className="text-foreground mb-3 flex items-center gap-2">
                        <CharacterAvatar character="cheerful" size="sm" animate={false} />
                        <strong>Your prediction:</strong> {pred}
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        <Button size="sm" className="btn-cheerful">
                          <CharacterAvatar character="cheerful" size="sm" animate={false} className="mr-1" />
                          Right!
                        </Button>
                        <Button size="sm" className="btn-magical">
                          <CharacterAvatar character="star" size="sm" animate={false} className="mr-1" />
                          Close
                        </Button>
                        <Button size="sm" className="btn-calm">
                          <CharacterAvatar character="shocked" size="sm" animate={false} className="mr-1" />
                          Surprised!
                        </Button>
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default BookTabs;