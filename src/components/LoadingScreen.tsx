import { Icon } from '@/components/icons/Icon';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  return (
    <div 
      className="fixed inset-0 bg-primary flex items-center justify-center z-50"
      role="status"
      aria-live="polite"
      aria-label="Loading Book Explorer application"
    >
      <div className="text-center text-white px-4">
        <div className="flex justify-center gap-3 md:gap-6 mb-8 flex-wrap">
          <div className="animate-bounce" style={{animationDelay: '0s'}} aria-hidden="true">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 rounded-full flex items-center justify-center shadow-md backdrop-blur-sm">
              <Icon name="book" size={32} color="white" />
            </div>
          </div>
          <div className="animate-bounce" style={{animationDelay: '0.2s'}} aria-hidden="true">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 rounded-full flex items-center justify-center shadow-md backdrop-blur-sm">
              <Icon name="sparkles" size={32} color="white" />
            </div>
          </div>
          <div className="animate-bounce" style={{animationDelay: '0.4s'}} aria-hidden="true">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 rounded-full flex items-center justify-center shadow-md backdrop-blur-sm">
              <Icon name="palette" size={32} color="white" />
            </div>
          </div>
          <div className="animate-bounce" style={{animationDelay: '0.6s'}} aria-hidden="true">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 rounded-full flex items-center justify-center shadow-md backdrop-blur-sm">
              <Icon name="rocket" size={32} color="white" />
            </div>
          </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-pulse drop-shadow-lg">Book Explorer!</h1>
        <p className="text-lg md:text-2xl mb-8 drop-shadow">Getting ready for your reading adventure...</p>
        <div className="flex justify-center space-x-3" aria-hidden="true">
          <div className="w-3 h-3 md:w-4 md:h-4 bg-white rounded-full animate-bounce"></div>
          <div className="w-3 h-3 md:w-4 md:h-4 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
          <div className="w-3 h-3 md:w-4 md:h-4 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        </div>
        <span className="sr-only">Loading, please wait...</span>
      </div>
    </div>
  );
};

export default LoadingScreen;