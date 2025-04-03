import React from "react";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  ShoppingBag, 
  FileText, 
  Heart, 
  BookOpen, 
  Utensils, 
  BookMarked,
  MessageCircle,
  Bot
} from "lucide-react";

export interface MenuItem {
  label: string;
  icon: React.ReactNode;
  id: string;
}

export const menuItems: MenuItem[] = [
  {
    label: "Табло",
    icon: <LayoutDashboard className="h-5 w-5" />,
    id: "dashboard",
  },
  {
    label: "Кампании",
    icon: <Heart className="h-5 w-5" />,
    id: "campaigns",
  },
  {
    label: "Инициативи",
    icon: <ShoppingBag className="h-5 w-5" />,
    id: "initiatives",
  },
  {
    label: "Конференции",
    icon: <Calendar className="h-5 w-5" />,
    id: "conferences",
  },
  {
    label: "Събития",
    icon: <Calendar className="h-5 w-5" />,
    id: "events",
  },
  {
    label: "Дарители",
    icon: <Users className="h-5 w-5" />,
    id: "benefactors",
  },
  {
    label: "Благотворителен магазин",
    icon: <ShoppingBag className="h-5 w-5" />,
    id: "store",
  },
  {
    label: "Новини",
    icon: <FileText className="h-5 w-5" />,
    id: "news",
  },
  {
    label: "Блог",
    icon: <BookOpen className="h-5 w-5" />,
    id: "blog",
  },
  {
    label: "Рецепти",
    icon: <Utensils className="h-5 w-5" />,
    id: "recipes",
  },
  {
    label: "Истории",
    icon: <BookMarked className="h-5 w-5" />,
    id: "stories",
  },
  {
    label: "Чат",
    icon: <MessageCircle className="h-5 w-5" />,
    id: "chat",
  },
  {
    label: "AI асистент",
    icon: <Bot className="h-5 w-5" />,
    id: "ai-assistant",
  },
  {
    label: "Потребители",
    icon: <Users className="h-5 w-5" />,
    id: "users",
  },
]; 