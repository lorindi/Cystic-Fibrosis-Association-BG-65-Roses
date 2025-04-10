import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { SITE_CONFIG, mainNavItems, footerNavItems } from "./constants";
import { NavLink } from "./NavLink";
import { Separator } from "@/components/ui/separator";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
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
          {mainNavItems.map((item) => (
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