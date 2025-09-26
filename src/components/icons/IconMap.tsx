import { 
  Book, 
  Sparkles, 
  Palette, 
  Rocket, 
  Circle,
  Theater,
  FileText,
  Lightbulb,
  MessageCircle,
  Calendar,
  AlertTriangle,
  Bot,
  RefreshCw,
  Map,
  Scale,
  Eye,
  BookOpen,
  PenTool,
  Target,
  Smile,
  Globe2,
  Activity,
  Zap,
  Heart,
  Star
} from 'lucide-react';

export const IconMap = {
  // Learning & Education
  book: Book,
  bookOpen: BookOpen,
  sparkles: Sparkles,
  palette: Palette,
  rocket: Rocket,
  lightbulb: Lightbulb,
  target: Target,
  zap: Zap,
  heart: Heart,
  star: Star,
  
  // UI Elements
  circle: Circle,
  theater: Theater,
  fileText: FileText,
  messageCircle: MessageCircle,
  calendar: Calendar,
  alertTriangle: AlertTriangle,
  bot: Bot,
  refreshCw: RefreshCw,
  
  // Tools & Actions
  map: Map,
  scale: Scale,
  eye: Eye,
  penTool: PenTool,
  smile: Smile,
  globe: Globe2,
  activity: Activity,
};

export type IconName = keyof typeof IconMap;