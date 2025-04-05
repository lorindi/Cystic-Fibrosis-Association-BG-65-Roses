import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Heart,
  Calendar,
  Clock,
  Users,
  BadgeDollarSign
} from "lucide-react";

export default function CampaignsContent() {
  // Примерни данни за кампании
  const campaigns = [
    {
      id: 1,
      title: "Набиране на средства за медицински център",
      description: "Кампания за набиране на средства за изграждане на специализиран медицински център за пациенти с кистична фиброза",
      target: 500000,
      current: 178500,
      daysLeft: 45,
      supporters: 124,
      image: "/campaigns/medical-center.jpg"
    },
    {
      id: 2,
      title: "Лекарства за деца с кистична фиброза",
      description: "Кампания за набиране на средства за закупуване на скъпоструващи лекарства за деца с кистична фиброза",
      target: 70000,
      current: 35000,
      daysLeft: 30,
      supporters: 87,
      image: "/campaigns/medications.jpg"
    },
    {
      id: 3,
      title: "Рехабилитационна програма",
      description: "Кампания за финансиране на рехабилитационна програма за пациенти с кистична фиброза",
      target: 25000,
      current: 12000,
      daysLeft: 20,
      supporters: 45,
      image: "/campaigns/rehabilitation.jpg"
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Активни кампании</h2>
        <Button>Нова кампания</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map(campaign => (
          <Card key={campaign.id} className="overflow-hidden">
            <div className="h-40 bg-slate-200 flex items-center justify-center">
              <Heart className="h-10 w-10 text-primary" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{campaign.title}</CardTitle>
              <CardDescription className="line-clamp-2">{campaign.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div 
                  className="bg-primary h-2.5 rounded-full" 
                  style={{ width: `${(campaign.current / campaign.target) * 100}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="font-semibold">{campaign.current.toLocaleString()} лв.</span>
                <span className="text-muted-foreground">от {campaign.target.toLocaleString()} лв.</span>
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{campaign.daysLeft} дни остават</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{campaign.supporters} дарители</span>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">Преглед</Button>
                <Button size="sm" className="flex-1">Редактиране</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Предстоящи кампании</h2>
        <Card>
          <CardHeader>
            <CardTitle>Планирани кампании</CardTitle>
            <CardDescription>Кампании, които са в процес на подготовка</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center p-2 rounded-lg hover:bg-slate-100">
                  <div className="w-12 h-12 flex items-center justify-center bg-primary/10 rounded-lg mr-4">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Планирана кампания {i}</p>
                    <p className="text-xs text-muted-foreground">
                      Начало: {new Date(Date.now() + i * 20 * 86400000).toLocaleDateString("bg-BG")}
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
    </div>
  );
} 