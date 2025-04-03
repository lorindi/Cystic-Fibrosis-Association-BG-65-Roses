import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar } from "lucide-react";

export default function DashboardContent() {
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