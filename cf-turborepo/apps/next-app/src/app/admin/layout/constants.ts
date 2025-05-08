import { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  Home,
  Heart,
  Calendar,
  MessageSquare,
  ShoppingBag,
  Newspaper,
  BookOpen,
  ChefHat,
  BookOpenText,
  Bot,
  LogOut,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  variant?: "default" | "danger";
};

export const SITE_CONFIG = {
  title: "Admin",
  subtitle: "Content Management",
  defaultPage: "Dashboard"
} as const;

export const mainNavItems: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/campaigns", label: "Campaigns", icon: Heart },
  { href: "/admin/initiatives", label: "Initiatives", icon: FileText },
  { href: "/admin/conferences", label: "Conferences", icon: Calendar },
  { href: "/admin/events", label: "Events", icon: Calendar },
  { href: "/admin/benefactors", label: "Benefactors", icon: Users },
  { href: "/admin/charity-store", label: "Charity Store", icon: ShoppingBag },
  { href: "/admin/news", label: "News", icon: Newspaper },
  { href: "/admin/blog", label: "Blog", icon: BookOpen },
  { href: "/admin/recipes", label: "Recipes", icon: ChefHat },
  { href: "/admin/stories", label: "Stories", icon: BookOpenText },
  { href: "/admin/chat", label: "Chat", icon: MessageSquare },
  { href: "/admin/ai-assistant", label: "AI Assistant", icon: Bot },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export const footerNavItems: NavItem[] = [
  { href: "/", label: "Back to Site", icon: Home },
  { href: "/logout", label: "Logout", icon: LogOut, variant: "danger" },
]; 