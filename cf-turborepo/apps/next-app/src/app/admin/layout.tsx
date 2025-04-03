'use client';
import './admin.css';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription 
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ArrowLeft,
  ArrowRight,
  Shield,
  LayoutDashboard,
  Users,
  FileEdit,
  Megaphone,
  PenTool,
  BookOpen,
  MessageSquare,
  Calendar,
  Flag,
  Heart,
  Ticket,
  ShoppingCart,
  Box,
  DollarSign,
  Settings,
  Search,
  Mail,
  Bell,
  ChevronDown,
  ChevronUp,
  List,
  GitBranch,
  HeartHandshake,
  InfoIcon
} from 'lucide-react';

interface NavItemProps {
  label: string;
  icon: React.ReactNode;
  href?: string;
  isActive?: boolean;
  badge?: {
    value: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
  };
  children?: React.ReactNode;
}

function NavItem({ label, icon, href, isActive, badge, children }: NavItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className={`rounded-md ${isActive ? 'bg-primary/10' : ''}`}>
      {href && !children ? (
        <Link href={href} className={`flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent ${isActive ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
          <span className="mr-2">{icon}</span>
          <span>{label}</span>
          {badge && (
            <Badge variant={badge.variant} className="ml-auto">
              {badge.value}
            </Badge>
          )}
        </Link>
      ) : (
        <>
          <button 
            className={`flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-accent ${isActive ? 'text-primary font-medium' : 'text-muted-foreground'}`}
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="mr-2">{icon}</span>
            <span>{label}</span>
            <span className="ml-auto">{isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</span>
          </button>
          {isOpen && (
            <div className="ml-6 mt-1 space-y-1">
              {children}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(true);
  const [activeMenuItem, setActiveMenuItem] = useState<string>('');

  useEffect(() => {
    // Set active menu item based on current path
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const currentPath = path.split('/').filter(Boolean)[1] || '';
      setActiveMenuItem(currentPath);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md fixed top-0 left-0 right-0 h-16 z-50 flex items-center justify-between px-4">
        <div className="flex items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setSidebarVisible(!sidebarVisible)}
                >
                  {sidebarVisible ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {sidebarVisible ? "Hide Sidebar" : "Show Sidebar"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <div className="text-xl font-semibold text-primary ml-2 flex items-center">
            <Shield className="mr-2" size={20} />
            <Link href="/">65 Roses Admin</Link>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Search size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Search</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Mail size={18} />
                  <Badge variant="secondary" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">2</Badge>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Messages</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell size={18} />
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">3</Badge>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Notifications</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Separator orientation="vertical" className="h-8 mx-2" />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center cursor-pointer">
                <Avatar>
                  <AvatarFallback>AU</AvatarFallback>
                </Avatar>
                <span className="ml-2 font-medium hidden md:block">Admin User</span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Sidebar using Sheet */}
      <Sheet open={sidebarVisible} onOpenChange={setSidebarVisible}>
        <SheetContent 
          side="left" 
          className="p-0 w-[280px] border-r"
          style={{ top: '4rem', height: 'calc(100vh - 4rem)' }}
        >
          <SheetHeader className="px-4 pt-2">
            <SheetTitle className="text-left">Admin Menu</SheetTitle>
          </SheetHeader>
          <div className="p-4 space-y-2">
            <NavItem 
              label="Dashboard" 
              icon={<LayoutDashboard size={18} />} 
              href="/admin" 
              isActive={activeMenuItem === ''}
            />

            <NavItem 
              label="Users" 
              icon={<Users size={18} />} 
              isActive={activeMenuItem === 'users'}
            >
              <NavItem 
                label="All Users" 
                icon={<List size={16} />} 
                href="/admin/users" 
              />
              <NavItem 
                label="Groups" 
                icon={<GitBranch size={16} />} 
                href="/admin/users/groups" 
              />
            </NavItem>

            <NavItem 
              label="Content" 
              icon={<FileEdit size={18} />} 
              isActive={['news', 'blog', 'recipes', 'stories'].includes(activeMenuItem)}
            >
              <NavItem 
                label="News" 
                icon={<Megaphone size={16} />} 
                href="/admin/news" 
                badge={{ value: "2", variant: "default" }}
              />
              <NavItem 
                label="Blog" 
                icon={<PenTool size={16} />} 
                href="/admin/blog" 
              />
              <NavItem 
                label="Recipes" 
                icon={<BookOpen size={16} />} 
                href="/admin/recipes" 
              />
              <NavItem 
                label="Stories" 
                icon={<MessageSquare size={16} />} 
                href="/admin/stories" 
              />
            </NavItem>

            <NavItem 
              label="Events" 
              icon={<Calendar size={18} />} 
              isActive={['campaigns', 'initiatives', 'conferences', 'activities'].includes(activeMenuItem)}
            >
              <NavItem 
                label="Campaigns" 
                icon={<Flag size={16} />} 
                href="/admin/campaigns" 
              />
              <NavItem 
                label="Initiatives" 
                icon={<Heart size={16} />} 
                href="/admin/initiatives" 
              />
              <NavItem 
                label="Conferences" 
                icon={<Users size={16} />} 
                href="/admin/conferences" 
              />
              <NavItem 
                label="Activities" 
                icon={<Ticket size={16} />} 
                href="/admin/activities" 
              />
            </NavItem>

            <NavItem 
              label="Store" 
              icon={<ShoppingCart size={18} />} 
              isActive={activeMenuItem === 'store'}
            >
              <NavItem 
                label="Items" 
                icon={<Box size={16} />} 
                href="/admin/store/items" 
              />
              <NavItem 
                label="Donors" 
                icon={<HeartHandshake size={16} />} 
                href="/admin/store/donors" 
              />
              <NavItem 
                label="Donations" 
                icon={<DollarSign size={16} />} 
                href="/admin/store/donations" 
                badge={{ value: "5", variant: "secondary" }}
              />
            </NavItem>

            <NavItem 
              label="Settings" 
              icon={<Settings size={18} />} 
              href="/admin/settings" 
              isActive={activeMenuItem === 'settings'}
            />
          </div>
          
          <Separator className="my-4" />
          
          <div className="p-4 mt-2 bg-primary/10 rounded-md mx-2 flex items-center">
            <InfoIcon className="text-primary mr-2" size={18} />
            <span className="text-sm">Need help? Check the <a href="#" className="text-primary font-medium">Admin Guide</a></span>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className={`pt-16 transition-all duration-300 p-4 ${sidebarVisible ? 'ml-[280px]' : ''}`}>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          {children}
        </div>
      </main>
    </div>
  );
}