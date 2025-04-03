"use client";

import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  BarChart3, 
  Users, 
  Calendar, 
  ShoppingBag, 
  FileText, 
  MessageSquare,
  Heart, 
  BookOpen, 
  Utensils, 
  BookMarked,
  MessageCircle,
  Bot,
  LayoutDashboard,
  Bell,
  Settings,
  LogOut
} from "lucide-react";
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

export default function AdminPanel() {
  const [activeMenu, setActiveMenu] = useState("dashboard");

  const menuItems = [
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

  // Функция за рендериране на съдържанието за всяка секция
  const renderContent = () => {
    switch (activeMenu) {
      case "dashboard":
        return <DashboardContent />;
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <p className="text-lg text-muted-foreground">Изберете секция от менюто за да видите съдържанието</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Странична навигация */}
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-200">
          <h1 className="text-xl font-bold text-primary">CF Admin</h1>
          <p className="text-sm text-muted-foreground">65 Roses Асоциация</p>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="space-y-1 px-2">
            {menuItems.map((item) => (
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
          <h1 className="text-2xl font-semibold">{menuItems.find(item => item.id === activeMenu)?.label || "Табло"}</h1>
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
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

// Компонент за съдържанието на таблото
function DashboardContent() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Общо потребители</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1,245</div>
          <p className="text-xs text-muted-foreground">+12% спрямо миналия месец</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Активни кампании</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">8</div>
          <p className="text-xs text-muted-foreground">2 нови тази седмица</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Дарения този месец</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">15,423 лв.</div>
          <p className="text-xs text-muted-foreground">+18% спрямо миналия месец</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Участници в инициативи</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">432</div>
          <p className="text-xs text-muted-foreground">+5% спрямо миналия месец</p>
        </CardContent>
      </Card>

      {/* Най-актуални активности */}
      <Card className="col-span-full md:col-span-2">
        <CardHeader>
          <CardTitle>Последни активности</CardTitle>
          <CardDescription>Най-скорошни действия в системата</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-100">
                <Avatar>
                  <AvatarFallback>U{i}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">Потребител {i} се регистрира в системата</p>
                  <p className="text-xs text-muted-foreground">Преди {i * 5} минути</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Предстоящи събития */}
      <Card className="col-span-full md:col-span-2">
        <CardHeader>
          <CardTitle>Предстоящи събития</CardTitle>
          <CardDescription>Събития в следващите 30 дни</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center p-2 rounded-lg hover:bg-slate-100">
                <div className="w-16 h-16 flex items-center justify-center bg-primary/10 rounded-lg mr-4">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Събитие {i}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(Date.now() + i * 86400000).toLocaleDateString("bg-BG")}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Детайли
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
