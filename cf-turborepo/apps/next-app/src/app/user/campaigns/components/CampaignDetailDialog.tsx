"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Users, MapPin, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface CampaignDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: any;
  userStatus: string;
  onJoin: () => void;
  onLeave: () => void;
  joinLoading: boolean;
  leaveLoading: boolean;
}

export default function CampaignDetailDialog({
  open,
  onOpenChange,
  campaign,
  userStatus,
  onJoin,
  onLeave,
  joinLoading,
  leaveLoading,
}: CampaignDetailDialogProps) {
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
        return "Одобрен участник";
      case "PENDING":
        return "Чака одобрение";
      case "NOT_REGISTERED":
        return "Не сте записан";
      default:
        return status;
    }
  };

  const isRegistered = userStatus === "APPROVED";
  const isPending = userStatus === "PENDING";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <DialogTitle className="text-2xl">{campaign.title}</DialogTitle>
            <Badge variant={getStatusBadgeVariant(userStatus)}>
              {translateStatus(userStatus)}
            </Badge>
          </div>
          <DialogDescription>
            {campaign.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Прогрес</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Събрана сума: {campaign.currentAmount} лв.</span>
                <span>Цел: {campaign.goal} лв.</span>
              </div>
              <Progress value={(campaign.currentAmount / campaign.goal) * 100} />
              <div className="text-sm text-muted-foreground text-right">
                {Math.round((campaign.currentAmount / campaign.goal) * 100)}% изпълнение
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Информация</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">
                  Период: {formatDate(campaign.startDate)}
                  {campaign.endDate && ` - ${formatDate(campaign.endDate)}`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="text-sm">{campaign.participantsCount} участници</span>
              </div>
            </div>
          </div>

          {campaign.events && campaign.events.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2">Събития</h3>
              <div className="space-y-3">
                {campaign.events.map((event: any) => (
                  <div key={event.id} className="bg-muted/50 p-3 rounded-md">
                    <div className="font-medium">{event.title}</div>
                    {event.description && (
                      <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                    )}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{event.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <Separator />

        <DialogFooter className="flex gap-2 sm:gap-0">
          {!isRegistered && !isPending ? (
            <Button onClick={onJoin} disabled={joinLoading}>
              Запиши се за кампанията
            </Button>
          ) : (
            <Button
              variant={isPending ? "outline" : "destructive"}
              onClick={onLeave}
              disabled={leaveLoading || isPending}
            >
              {isPending ? "Чака одобрение" : "Отпиши се от кампанията"}
            </Button>
          )}

          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Затвори
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 