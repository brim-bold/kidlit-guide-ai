import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icons/Icon';

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
}

const BookTabs = ({ bookData, userPredictions }: BookTabsProps) => {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="flex gap-2 mb-6 md:mb-8 overflow-x-auto pb-2 bg-transparent">
        {['overview', 'vocabulary', 'questions', 'activities', 'reflection'].map((tab) => (
          <TabsTrigger
            key={tab}
            value={tab}
            className="px-4 md:px-6 py-2 md:py-3 rounded-lg font-bold whitespace-nowrap text-sm md:text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm data-[state=inactive]:bg-card data-[state=inactive]:text-card-foreground hover:bg-accent border border-border data-[state=active]:border-primary"
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </TabsTrigger>
        ))}
      </TabsList>

      <div className="bg-card rounded-xl shadow-md p-6 md:p-8 border border-border">
        <TabsContent value="overview" className="space-y-4">
          <h3 className="text-xl md:text-3xl font-bold text-foreground mb-4">Summary</h3>
          <p className="text-card-foreground leading-relaxed text-base md:text-lg">{bookData.summary}</p>
        </TabsContent>

        <TabsContent value="vocabulary" className="space-y-4">
          <h3 className="text-xl md:text-3xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Icon name="book" size={24} />
            Key Vocabulary
          </h3>
          {bookData.vocabulary?.map((word, idx) => (
            <div key={idx} className="bg-bg-blue rounded-lg p-4 md:p-5 border border-learning-blue/30 shadow-sm">
              <p className="text-lg md:text-xl font-bold text-learning-blue">{word}</p>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="questions" className="space-y-4">
          <div className="bg-bg-orange rounded-lg p-4 md:p-5 mb-6 border border-learning-orange/30">
            <h4 className="font-bold text-learning-orange mb-3 text-base md:text-lg flex items-center gap-2">
              <Icon name="lightbulb" size={18} />
              Question Guide:
            </h4>
            <p className="text-sm md:text-base text-card-foreground mb-2"><Icon name="circle" size={12} className="text-blue-500 inline mr-1" /> <strong>Blue</strong> = Right in text</p>
            <p className="text-sm md:text-base text-card-foreground"><Icon name="circle" size={12} className="text-green-500 inline mr-1" /> <strong>Green</strong> = Think deeper</p>
          </div>
          {bookData.questions?.map((q, idx) => (
            <div key={idx} className="bg-card rounded-lg p-4 md:p-5 border border-border shadow-sm">
              <p className="text-card-foreground font-medium text-sm md:text-base">{q}</p>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="activities" className="space-y-4">
          <h3 className="text-xl md:text-3xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Icon name="palette" size={24} />
            Fun Activities
          </h3>
          {bookData.activities?.map((activity, idx) => (
            <div key={idx} className="bg-bg-purple rounded-lg p-4 md:p-5 border border-learning-purple/30 shadow-sm">
              <p className="text-card-foreground font-medium text-sm md:text-base">{activity}</p>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="reflection" className="space-y-6">
          <div className="bg-bg-green rounded-xl p-6 md:p-8 border-2 border-learning-green/30 shadow-card">
            <h3 className="font-bold text-learning-green mb-4 text-xl md:text-2xl flex items-center gap-2">
              <Icon name="bookOpen" size={24} />
              After Reading: Story Summary
            </h3>
            <p className="text-sm md:text-base text-muted-foreground mb-6 italic">Use this framework to summarize:</p>
            
            <div className="space-y-5">
              {[
                { label: 'Somebody', hint: 'Who is the main character?' },
                { label: 'Wanted', hint: 'What was their goal?' },
                { label: 'But', hint: 'What was the problem?' },
                { label: 'So', hint: 'What did they do?' },
                { label: 'Then', hint: 'How did it end?' }
              ].map((item, idx) => (
                <div key={idx}>
                  <Label className="block text-learning-green font-bold mb-2 text-sm md:text-base">
                    {item.label} <span className="font-normal text-muted-foreground">({item.hint})</span>
                  </Label>
                  <Input 
                    type="text"
                    placeholder={`Example: ${item.label}...`}
                    className="w-full p-3 md:p-4 text-base border-2 border-learning-green/30 rounded-xl focus:border-learning-green focus:ring-4 focus:ring-learning-green/20 transition-smooth"
                  />
                </div>
              ))}
            </div>

            <div className="mt-6 bg-card rounded-xl p-4 md:p-5 shadow-button">
              <p className="text-sm md:text-base text-learning-green font-medium flex items-center gap-2">
                <Icon name="lightbulb" size={18} />
                <strong>Parent Tip:</strong> Have your child say their summary out loud!
              </p>
            </div>
          </div>

          {Object.keys(userPredictions).length > 0 && (
            <div className="bg-bg-blue rounded-xl p-6 md:p-8 border-2 border-learning-blue/30 shadow-card">
              <h3 className="font-bold text-learning-blue mb-4 text-xl md:text-2xl flex items-center gap-2">
                <Icon name="eye" size={24} />
                How Were Your Predictions?
              </h3>
              <p className="text-card-foreground mb-5 text-sm md:text-base">Look back at what you predicted:</p>
              {Object.entries(userPredictions).map(([idx, pred]) => (
                pred && (
                  <div key={idx} className="bg-card rounded-xl p-4 md:p-5 mb-4 shadow-button">
                    <p className="text-card-foreground mb-3 text-sm md:text-base flex items-center gap-2">
                      <img src="/src/assets/faces/cheerful-face.png" alt="prediction" className="w-6 h-6" />
                      <strong>Your prediction:</strong> {pred}
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <Button size="sm" className="bg-learning-green hover:bg-learning-green/80 text-white font-semibold flex items-center gap-2">
                        <img src="/src/assets/faces/happy-face.png" alt="correct" className="w-4 h-4" />
                        Right!
                      </Button>
                      <Button size="sm" className="bg-learning-orange hover:bg-learning-orange/80 text-white font-semibold flex items-center gap-2">
                        <img src="/src/assets/faces/star-face.png" alt="close" className="w-4 h-4" />
                        Close
                      </Button>
                      <Button size="sm" className="bg-learning-blue hover:bg-learning-blue/80 text-white font-semibold flex items-center gap-2">
                        <img src="/src/assets/faces/surprised-face.png" alt="surprised" className="w-4 h-4" />
                        Surprised!
                      </Button>
                    </div>
                  </div>
                )
              ))}
            </div>
          )}
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default BookTabs;