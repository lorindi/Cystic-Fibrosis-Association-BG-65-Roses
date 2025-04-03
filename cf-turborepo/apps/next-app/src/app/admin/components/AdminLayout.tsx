import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Settings, LogOut } from "lucide-react";
import { menuItems, MenuItem } from "../data/menuItems";

interface AdminLayoutProps {
  children: React.ReactNode;
  activeMenu: string;
  setActiveMenu: (id: string) => void;
}

export function AdminLayout({ children, activeMenu, setActiveMenu }: AdminLayoutProps) {
  return (
    <div className="flex h-screen bg-[#fafafa] w-full max-w-[1536px]">
      {/* Странична навигация */}
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-200">
          <h1 className="text-xl font-bold text-primary">CF Admin</h1>
          <p className="text-sm text-muted-foreground">65 Roses Асоциация</p>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="space-y-1 px-2">
            {menuItems.map((item: MenuItem) => (
              <Button
                key={item.id}
                variant={activeMenu === item.id ? "secondary" : "ghost"}
                className={`w-full justify-start ${
                  activeMenu === item.id ? "bg-slate-100" : ""
                }`}
                onClick={() => setActiveMenu(item.id)}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </Button>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-slate-200">
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="h-5 w-5 mr-3" />
            Настройки
          </Button>
          <Button variant="ghost" className="w-full justify-start text-red-500">
            <LogOut className="h-5 w-5 mr-3" />
            Изход
          </Button>
        </div>
      </div>

      {/* Основно съдържание */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Заглавие */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">{menuItems.find((item: MenuItem) => item.id === activeMenu)?.label || "Табло"}</h1>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarImage src="/avatar.png" alt="Admin" />
                    <AvatarFallback>CF</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Моят акаунт</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Профил</DropdownMenuItem>
                <DropdownMenuItem>Настройки</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-500">Изход</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Основно съдържание */}
        <main className="flex-1 overflow-auto p-6 bg-slate-50">
          {children}
        </main>
      </div>
    </div>
  );
} 