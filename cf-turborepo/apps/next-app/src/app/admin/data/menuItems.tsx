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
    label: "Dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    id: "dashboard",
  },
  {
    label: "Campaigns",
    icon: <Heart className="h-5 w-5" />,
    id: "campaigns",
  },
  {
    label: "Initiatives",
    icon: <ShoppingBag className="h-5 w-5" />,
    id: "initiatives",
  },
  {
    label: "Conferences",
    icon: <Calendar className="h-5 w-5" />,
    id: "conferences",
  },
  {
    label: "Events",
    icon: <Calendar className="h-5 w-5" />,
    id: "events",
  },
  {
    label: "Benefactors",
    icon: <Users className="h-5 w-5" />,
    id: "benefactors",
  },
  {
    label: "Charity Store",
    icon: <ShoppingBag className="h-5 w-5" />,
    id: "store",
  },
  {
    label: "News",
    icon: <FileText className="h-5 w-5" />,
    id: "news",
  },
  {
    label: "Blog",
    icon: <BookOpen className="h-5 w-5" />,
    id: "blog",
  },
  {
    label: "Recipes",
    icon: <Utensils className="h-5 w-5" />,
    id: "recipes",
  },
  {
    label: "Stories",
    icon: <BookMarked className="h-5 w-5" />,
    id: "stories",
  },
  {
    label: "Chat",
    icon: <MessageCircle className="h-5 w-5" />,
    id: "chat",
  },
  {
    label: "AI Assistant",
    icon: <Bot className="h-5 w-5" />,
    id: "ai-assistant",
  },
  {
    label: "Users",
    icon: <Users className="h-5 w-5" />,
    id: "users",
  },
]; 