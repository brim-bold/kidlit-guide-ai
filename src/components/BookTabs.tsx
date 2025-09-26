import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

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
            className="px-4 md:px-6 py-2 md:py-3 rounded-xl font-bold whitespace-nowrap text-sm md:text-base data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-button data-[state=inactive]:bg-card data-[state=inactive]:text-card-foreground hover:bg-accent border-2 border-accent data-[state=active]:border-primary"
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </TabsTrigger>
        ))}
      </TabsList>

      <div className="bg-gradient-card rounded-2xl shadow-card p-6 md:p-8 border-2 border-accent">
        <TabsContent value="overview" className="space-y-4">
          <h3 className="text-xl md:text-3xl font-bold text-foreground mb-4">Summary</h3>
          <p className="text-card-foreground leading-relaxed text-base md:text-lg">{bookData.summary}</p>
        </TabsContent>

        <TabsContent value="vocabulary" className="space-y-4">
          <h3 className="text-xl md:text-3xl font-bold text-foreground mb-4">Key Vocabulary</h3>
          {bookData.vocabulary?.map((word, idx) => (
            <div key={idx} className="bg-gradient-info/20 rounded-xl p-4 md:p-5 border-2 border-learning-blue/30 shadow-button">
              <p className="text-lg md:text-xl font-bold text-learning-blue">{word}</p>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="questions" className="space-y-4">
          <div className="bg-gradient-warning/20 rounded-xl p-4 md:p-5 mb-6 border-2 border-learning-yellow/30">
            <h4 className="font-bold text-learning-orange mb-3 text-base md:text-lg">Question Guide:</h4>
            <p className="text-sm md:text-base text-card-foreground mb-2">🔵 <strong>Blue</strong> = Right in text</p>
            <p className="text-sm md:text-base text-card-foreground">🟢 <strong>Green</strong> = Think deeper</p>
          </div>
          {bookData.questions?.map((q, idx) => (
            <div key={idx} className="bg-card rounded-xl p-4 md:p-5 border-2 border-learning-yellow/30 shadow-button">
              <p className="text-card-foreground font-medium text-sm md:text-base">{q}</p>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="activities" className="space-y-4">
          <h3 className="text-xl md:text-3xl font-bold text-foreground mb-4">Fun Activities</h3>
          {bookData.activities?.map((activity, idx) => (
            <div key={idx} className="bg-gradient-warning/20 rounded-xl p-4 md:p-5 border-2 border-learning-pink/30 shadow-button">
              <p className="text-card-foreground font-medium text-sm md:text-base">{activity}</p>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="reflection" className="space-y-6">
          <div className="bg-gradient-success/20 rounded-xl p-6 md:p-8 border-2 border-learning-green/30 shadow-card">
            <h3 className="font-bold text-learning-green mb-4 text-xl md:text-2xl">📖 After Reading: Story Summary</h3>
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
              <p className="text-sm md:text-base text-learning-green font-medium">
                <strong>💡 Parent Tip:</strong> Have your child say their summary out loud!
              </p>
            </div>
          </div>

          {Object.keys(userPredictions).length > 0 && (
            <div className="bg-gradient-info/20 rounded-xl p-6 md:p-8 border-2 border-learning-blue/30 shadow-card">
              <h3 className="font-bold text-learning-blue mb-4 text-xl md:text-2xl">🔮 How Were Your Predictions?</h3>
              <p className="text-card-foreground mb-5 text-sm md:text-base">Look back at what you predicted:</p>
              {Object.entries(userPredictions).map(([idx, pred]) => (
                pred && (
                  <div key={idx} className="bg-card rounded-xl p-4 md:p-5 mb-4 shadow-button">
                    <p className="text-card-foreground mb-3 text-sm md:text-base"><strong>Your prediction:</strong> {pred}</p>
                    <div className="flex gap-2 flex-wrap">
                      <Button size="sm" className="bg-learning-green hover:bg-learning-green/80 text-white font-semibold">
                        ✓ Right!
                      </Button>
                      <Button size="sm" className="bg-learning-orange hover:bg-learning-orange/80 text-white font-semibold">
                        ↻ Close
                      </Button>
                      <Button size="sm" className="bg-learning-blue hover:bg-learning-blue/80 text-white font-semibold">
                        ✗ Surprised!
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