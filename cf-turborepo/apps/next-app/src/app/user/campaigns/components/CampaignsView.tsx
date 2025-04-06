"use client";

import * as React from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Info, Users } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";
import {
  GET_CAMPAIGNS,
  GET_USER_CAMPAIGNS,
  GET_USER_CAMPAIGN_STATUS,
  JOIN_CAMPAIGN,
  LEAVE_CAMPAIGN,
} from "../graphql/campaigns";
import CampaignDetailDialog from "./CampaignDetailDialog";

export default function CampaignsView() {
  const { toast } = useToast();
  const [selectedCampaign, setSelectedCampaign] = React.useState<any>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = React.useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = React.useState(false);
  const [campaignToJoin, setCampaignToJoin] = React.useState<any>(null);

  // Заявки за получаване на кампании
  const { data: allCampaignsData, loading: allCampaignsLoading } = useQuery(GET_CAMPAIGNS);
  const { data: userCampaignsData, loading: userCampaignsLoading, refetch: refetchUserCampaigns } = useQuery(GET_USER_CAMPAIGNS);
  const { data: statusData, loading: statusLoading, refetch: refetchStatus } = useQuery(GET_USER_CAMPAIGN_STATUS);

  // Мутации за записване/отписване от кампания
  const [joinCampaign, { loading: joinLoading }] = useMutation(JOIN_CAMPAIGN, {
    onCompleted: () => {
      refetchUserCampaigns();
      refetchStatus();
    },
  });

  const [leaveCampaign, { loading: leaveLoading }] = useMutation(LEAVE_CAMPAIGN, {
    onCompleted: () => {
      refetchUserCampaigns();
      refetchStatus();
    },
  });

  // Функция за записване за кампания
  const handleJoinCampaign = (campaign: any) => {
    setCampaignToJoin(campaign);
    setIsConfirmDialogOpen(true);
  };

  // Функция за потвърждение на записване
  const confirmJoinCampaign = async () => {
    if (!campaignToJoin) return;

    try {
      await joinCampaign({
        variables: {
          id: campaignToJoin.id,
        },
      });

      toast({
        title: "Успешно записване",
        description: "Вашата заявка за участие в кампанията беше изпратена и очаква одобрение.",
      });
      setIsConfirmDialogOpen(false);
      setCampaignToJoin(null);
    } catch (error: any) {
      toast({
        title: "Грешка",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Функция за отписване от кампания
  const handleLeaveCampaign = async (campaignId: string) => {
    try {
      await leaveCampaign({
        variables: {
          id: campaignId,
        },
      });

      toast({
        title: "Успешно отписване",
        description: "Вие се отписахте от кампанията успешно.",
      });
    } catch (error: any) {
      toast({
        title: "Грешка",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Функция за отваряне на детайли за кампанията
  const openCampaignDetails = (campaign: any) => {
    setSelectedCampaign(campaign);
    setIsDetailDialogOpen(true);
  };

  // Помощна функция за получаване на текущия статус на потребителя в кампанията
  const getCampaignStatus = (campaignId: string) => {
    if (!statusData || !statusData.getUserCampaignStatus) return "NOT_REGISTERED";

    const campaignStatus = statusData.getUserCampaignStatus.find(
      (status: any) => status.campaign.id === campaignId
    );

    return campaignStatus ? campaignStatus.status : "NOT_REGISTERED";
  };

  // Получаване на варианта на бадж според статуса
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "success";
      case "PENDING":
        return "warning";
      default:
        return "outline";
    }
  };

  // Превод на статуса към български
  const translateStatus = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "Одобрен";
      case "PENDING":
        return "Чака одобрение";
      case "NOT_REGISTERED":
        return "Не сте записан";
      default:
        return status;
    }
  };

  if (allCampaignsLoading || userCampaignsLoading || statusLoading) {
    return <div className="container py-10">Зареждане...</div>;
  }

  const allCampaigns = allCampaignsData?.getCampaigns || [];
  const userCampaigns = userCampaignsData?.getUserCampaigns || [];

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Кампании</h1>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all">Всички кампании</TabsTrigger>
          <TabsTrigger value="my">Моите кампании</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {allCampaigns.length === 0 ? (
            <div className="text-center p-6 bg-muted/50 rounded-md">
              <p className="text-muted-foreground">Няма активни кампании в момента.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allCampaigns.map((campaign: any) => {
                const status = getCampaignStatus(campaign.id);
                const isRegistered = status === "APPROVED";
                const isPending = status === "PENDING";

                return (
                  <Card key={campaign.id} className="overflow-hidden">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="line-clamp-2">{campaign.title}</CardTitle>
                        <Badge variant={getStatusBadgeVariant(status)}>
                          {translateStatus(status)}
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-2">
                        {campaign.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Събрана сума: {campaign.currentAmount} лв.</span>
                            <span>Цел: {campaign.goal} лв.</span>
                          </div>
                          <Progress value={(campaign.currentAmount / campaign.goal) * 100} />
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {formatDate(campaign.startDate)}
                            {campaign.endDate && ` - ${formatDate(campaign.endDate)}`}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>{campaign.participantsCount} участници</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openCampaignDetails(campaign)}
                      >
                        <Info className="h-4 w-4 mr-2" />
                        Детайли
                      </Button>
                      {!isRegistered && !isPending ? (
                        <Button
                          size="sm"
                          onClick={() => handleJoinCampaign(campaign)}
                          disabled={joinLoading}
                        >
                          Запиши се
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleLeaveCampaign(campaign.id)}
                          disabled={leaveLoading || isPending}
                        >
                          {isPending ? "Чака одобрение" : "Отпиши се"}
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="my" className="space-y-6">
          {userCampaigns.length === 0 ? (
            <div className="text-center p-6 bg-muted/50 rounded-md">
              <p className="text-muted-foreground">
                Не участвате в нито една кампания. Запишете се от таб "Всички кампании".
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userCampaigns.map((campaign: any) => (
                <Card key={campaign.id} className="overflow-hidden">
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{campaign.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {campaign.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Събрана сума: {campaign.currentAmount} лв.</span>
                          <span>Цел: {campaign.goal} лв.</span>
                        </div>
                        <Progress value={(campaign.currentAmount / campaign.goal) * 100} />
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {formatDate(campaign.startDate)}
                          {campaign.endDate && ` - ${formatDate(campaign.endDate)}`}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{campaign.participantsCount} участници</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openCampaignDetails(campaign)}
                    >
                      <Info className="h-4 w-4 mr-2" />
                      Детайли
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleLeaveCampaign(campaign.id)}
                      disabled={leaveLoading}
                    >
                      Отпиши се
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Диалог за потвърждение на записване */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Потвърждение за записване</DialogTitle>
            <DialogDescription>
              Сигурни ли сте, че искате да се запишете за кампанията &quot;
              {campaignToJoin?.title}&quot;? След записването, вашата заявка ще очаква одобрение от
              администратор.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>
              Отказ
            </Button>
            <Button onClick={confirmJoinCampaign} disabled={joinLoading}>
              Потвърди
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Диалог с детайли за кампанията */}
      {selectedCampaign && (
        <CampaignDetailDialog
          open={isDetailDialogOpen}
          onOpenChange={setIsDetailDialogOpen}
          campaign={selectedCampaign}
          userStatus={getCampaignStatus(selectedCampaign.id)}
          onJoin={() => handleJoinCampaign(selectedCampaign)}
          onLeave={() => handleLeaveCampaign(selectedCampaign.id)}
          joinLoading={joinLoading}
          leaveLoading={leaveLoading}
        />
      )}
    </div>
  );
} 