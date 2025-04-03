import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ShoppingBag, Users, Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function InitiativesContent() {
  // Примерни данни за инициативи
  const initiatives = [
    {
      id: 1,
      title: "Безплатни инхалатори",
      description: "Инициатива за предоставяне на безплатни инхалатори за пациенти с кистична фиброза",
      status: "active",
      participants: 42,
      startDate: "01.03.2023",
      endDate: "01.03.2024",
      availableCount: 65,
      distributedCount: 37,
      type: "equipment"
    },
    {
      id: 2,
      title: "Kavisep програма",
      description: "Предоставяне на достъп до медикамента Kavisep за пациенти с кистична фиброза",
      status: "active",
      participants: 28,
      startDate: "15.01.2023",
      endDate: "15.01.2024",
      availableCount: 50,
      distributedCount: 22,
      type: "medication"
    },
    {
      id: 3,
      title: "MukoClear терапия",
      description: "Инициатива за осигуряване на MukoClear терапия за улесняване на дишането",
      status: "pending",
      participants: 0,
      startDate: "01.05.2023",
      endDate: "01.05.2024",
      availableCount: 30,
      distributedCount: 0,
      type: "medication"
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Всички инициативи</h2>
        <Button>Нова инициатива</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {initiatives.map(initiative => (
          <Card key={initiative.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {initiative.title}
                    <Badge variant={initiative.status === "active" ? "default" : "secondary"}>
                      {initiative.status === "active" ? "Активна" : "Планирана"}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="mt-1">{initiative.description}</CardDescription>
                </div>
                <div className="p-2 bg-primary/10 rounded-full">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span><span className="font-medium">{initiative.participants}</span> участници</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{initiative.startDate} - {initiative.endDate}</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Разпределени</span>
                  <span className="font-medium">{initiative.distributedCount} / {initiative.availableCount}</span>
                </div>
                <Progress value={(initiative.distributedCount / initiative.availableCount) * 100} />
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button variant="outline" className="flex-1">Участници</Button>
              <Button className="flex-1">Редактиране</Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Отчети за инициативи</h2>
        <Card>
          <CardHeader>
            <CardTitle>Статистика за инициативи</CardTitle>
            <CardDescription>Обобщена информация за всички инициативи</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <span className="text-3xl font-bold">98</span>
                    <p className="text-sm text-muted-foreground mt-1">Общо участници</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <span className="text-3xl font-bold">59</span>
                    <p className="text-sm text-muted-foreground mt-1">Разпределени продукти</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <span className="text-3xl font-bold">3</span>
                    <p className="text-sm text-muted-foreground mt-1">Активни инициативи</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 