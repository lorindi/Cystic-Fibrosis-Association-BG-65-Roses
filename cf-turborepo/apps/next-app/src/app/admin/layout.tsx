"use client";
import { useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
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
  LucideIcon,
  Menu,
  Bell,
  User,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  variant?: "default" | "danger";
};

const SITE_CONFIG = {
  title: "Admin",
  subtitle: "Content Management",
  defaultPage: "Dashboard"
} as const;

const mainNavItems: NavItem[] = [
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

const footerNavItems: NavItem[] = [
  { href: "/", label: "Back to Site", icon: Home },
  { href: "/logout", label: "Logout", icon: LogOut, variant: "danger" },
];

const NavLink = ({ item }: { item: NavItem }) => {
  const pathname = usePathname();
  const isActive = pathname === item.href;

  return (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      className={cn(
        "w-full justify-start",
        isActive && "bg-slate-100",
        item.variant === "danger" && "text-red-500"
      )}
      asChild
    >
      <Link href={item.href}>
        <item.icon className="h-5 w-5 mr-3" />
        <span>{item.label}</span>
      </Link>
    </Button>
  );
};

const TopBar = ({ onMenuClick, isSidebarOpen }: { onMenuClick: () => void; isSidebarOpen: boolean }) => {
  const pathname = usePathname();
  const currentPage = mainNavItems.find(item => item.href === pathname)?.label || SITE_CONFIG.defaultPage;
  
  return (
    <header className="bg-white h-20 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-semibold">{currentPage}</h1>
      </div>

      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative hover:bg-slate-100 transition-colors"
        >
          <Bell className="h-5 w-5 text-slate-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9 rounded-full hover:bg-slate-100 transition-colors"
            >
              <User className="h-5 w-5 text-slate-600" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

const AdminSidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-30 w-full max-w-[300px] bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-slate-200 h-20">
        <div className="">
          <h1 className="text-xl font-bold text-primary">{SITE_CONFIG.title}</h1>
          <p className="text-sm text-muted-foreground">{SITE_CONFIG.subtitle}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-auto py-2">
        <nav className="space-y-1 px-2">
          {mainNavItems.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-200">
        {footerNavItems.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
      </div>
    </div>
  );
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#fafafa] w-full max-w-[1536px]">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <AdminSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar 
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} 
          isSidebarOpen={isSidebarOpen} 
        />
        <main className="flex-1 overflow-auto px-4 py-2 bg-slate-50">
          {children}
        </main>
      </div>
    </div>
  );
}
