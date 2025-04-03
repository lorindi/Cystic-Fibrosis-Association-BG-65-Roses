import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users,
  Search,
  MoreHorizontal,
  PlusCircle,
  Filter
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function UsersContent() {
  // Примерни данни за потребители
  const users = [
    {
      id: 1,
      name: "Иван Иванов",
      email: "ivan@example.com",
      role: "patient",
      status: "active",
      dateJoined: "01.02.2023",
      imageUrl: "",
    },
    {
      id: 2,
      name: "Мария Петрова",
      email: "maria@example.com",
      role: "parent",
      status: "active",
      dateJoined: "15.03.2023",
      imageUrl: "",
    },
    {
      id: 3,
      name: "Георги Димитров",
      email: "georgi@example.com",
      role: "donor",
      status: "active",
      dateJoined: "05.04.2023",
      imageUrl: "",
    },
    {
      id: 4,
      name: "Силвия Тодорова",
      email: "silvia@example.com",
      role: "admin",
      status: "active",
      dateJoined: "10.01.2022",
      imageUrl: "",
    },
    {
      id: 5,
      name: "Димитър Колев",
      email: "dimitar@example.com",
      role: "patient",
      status: "inactive",
      dateJoined: "20.05.2023",
      imageUrl: "",
    },
    {
      id: 6,
      name: "Елена Христова",
      email: "elena@example.com",
      role: "parent",
      status: "active",
      dateJoined: "03.06.2023",
      imageUrl: "",
    },
  ];

  // Функция за определяне на цвета на badge за роля
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive";
      case "patient":
        return "default";
      case "parent":
        return "secondary";
      case "donor":
        return "outline";
      default:
        return "default";
    }
  };

  // Функция за превод на роля
  const translateRole = (role: string) => {
    switch (role) {
      case "admin":
        return "Администратор";
      case "patient":
        return "Пациент";
      case "parent":
        return "Родител";
      case "donor":
        return "Дарител";
      default:
        return role;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Потребители</h2>
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          Нов потребител
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Всички потребители</CardTitle>
          <CardDescription>Управление на потребители в системата</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Търсене на потребители..." className="pl-8" />
              </div>
              <Button variant="outline" className="sm:w-auto">
                <Filter className="h-4 w-4 mr-2" />
                Филтри
              </Button>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">ID</TableHead>
                    <TableHead>Потребител</TableHead>
                    <TableHead>Роля</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Регистрация</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            {user.imageUrl ? (
                              <AvatarImage src={user.imageUrl} alt={user.name} />
                            ) : null}
                            <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(user.role)}>
                          {translateRole(user.role)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className={`h-2 w-2 rounded-full mr-2 ${
                            user.status === "active" ? "bg-green-500" : "bg-gray-200"
                          }`} />
                          {user.status === "active" ? "Активен" : "Неактивен"}
                        </div>
                      </TableCell>
                      <TableCell>{user.dateJoined}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Отвори меню</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Действия</DropdownMenuLabel>
                            <DropdownMenuItem>Преглед на профил</DropdownMenuItem>
                            <DropdownMenuItem>Редактиране</DropdownMenuItem>
                            <DropdownMenuItem>Промяна на роля</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">Деактивиране</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="flex justify-center">
                <div className="p-3 rounded-full bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="mt-3 text-xl font-semibold">Общо потребители</h3>
              <p className="text-3xl font-bold mt-1">1,245</p>
              <p className="text-xs text-muted-foreground mt-1">+12% спрямо миналия месец</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="flex justify-center">
                <div className="p-3 rounded-full bg-blue-100">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <h3 className="mt-3 text-xl font-semibold">Пациенти</h3>
              <p className="text-3xl font-bold mt-1">512</p>
              <p className="text-xs text-muted-foreground mt-1">41% от всички потребители</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="flex justify-center">
                <div className="p-3 rounded-full bg-purple-100">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <h3 className="mt-3 text-xl font-semibold">Родители</h3>
              <p className="text-3xl font-bold mt-1">324</p>
              <p className="text-xs text-muted-foreground mt-1">26% от всички потребители</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="flex justify-center">
                <div className="p-3 rounded-full bg-amber-100">
                  <Users className="h-6 w-6 text-amber-600" />
                </div>
              </div>
              <h3 className="mt-3 text-xl font-semibold">Дарители</h3>
              <p className="text-3xl font-bold mt-1">409</p>
              <p className="text-xs text-muted-foreground mt-1">33% от всички потребители</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 