import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { SITE_CONFIG, mainNavItems, footerNavItems } from "./constants";
import { NavLink } from "./NavLink";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/context/AuthContext";
import { UserGroup } from "@/graphql/generated/graphql";
import { getRequiredGroupsForPath } from "@/lib/utils/access-control";

// Мапиране на URL пътища към необходими групи за достъп
const pathToGroupsMap: Record<string, UserGroup[]> = {
  "/admin/campaigns": ["campaigns"],
  "/admin/initiatives": ["initiatives"],
  "/admin/conferences": ["conferences"],
  "/admin/events": ["events"],
  "/admin/news": ["news"],
  "/admin/blog": ["blog"],
  "/admin/recipes": ["recipes"],
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user } = useAuth();
  
  // Функция, която проверява дали потребителят има достъп до дадена страница
  const hasAccessToPath = (path: string): boolean => {
    // Админите имат достъп до всички страници
    if (user?.role === 'admin') return true;
    
    // Ако пътят не изисква специфични права, позволяваме достъп
    const requiredGroups = getRequiredGroupsForPath(path);
    if (requiredGroups.length === 0) return true;
    
    // Проверяваме дали потребителят има поне една от необходимите групи
    return user?.groups?.some((group: string) => 
      requiredGroups.includes(group as UserGroup)
    ) || false;
  };
  
  // Филтрираме навигационните елементи според групите на потребителя
  const filteredMainNavItems = mainNavItems.filter(item => {
    return hasAccessToPath(item.href);
  });

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-30 w-full max-w-[300px] bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="h-20 flex items-center justify-between p-6 border-b border-slate-200">
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-primary leading-none">
            {SITE_CONFIG.title}
          </h1>
          <p className="text-sm text-muted-foreground">
            {SITE_CONFIG.subtitle}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden h-9 w-9"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-auto py-2">
        <nav className="space-y-1 px-2">
          {filteredMainNavItems.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </nav>
      </div>

      <Separator />
      
      <div className="px-4 py-6">
        {footerNavItems.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
      </div>
    </div>
  );
} 