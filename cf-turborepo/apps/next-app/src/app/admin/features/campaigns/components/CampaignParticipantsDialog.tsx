"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Campaign } from "@/types/campaign";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

interface CampaignParticipantsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: Campaign;
}

export function CampaignParticipantsDialog({
  open,
  onOpenChange,
  campaign,
}: CampaignParticipantsDialogProps) {
  const { toast } = useToast();
  console.log("CampaignParticipantsDialog рендериран с данни:", campaign);

  // Функция за превод на потребителската роля на български
  const translateRole = (role: string) => {
    const roles: Record<string, string> = {
      "admin": "Администратор",
      "patient": "Пациент",
      "parent": "Родител",
      "donor": "Дарител",
    };
    return roles[role] || role;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Преглед на участници в кампания</DialogTitle>
          <DialogDescription>
            {campaign?.title || "Кампания"} - {campaign?.participants?.length || 0} активни участници
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[500px] overflow-y-auto">
          {campaign?.participants && campaign.participants.length > 0 ? (
            <div>
              <h3 className="text-lg font-medium my-2">Одобрени участници</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Име</TableHead>
                    <TableHead>Имейл</TableHead>
                    <TableHead>Роля</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaign.participants.map((participant) => (
                    <TableRow key={participant.id}>
                      <TableCell>{participant.name}</TableCell>
                      <TableCell>{participant.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {translateRole(participant.role)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center p-6 bg-muted/50 rounded-md">
              <p className="text-muted-foreground">Няма одобрени участници в тази кампания.</p>
            </div>
          )}

          {campaign?.pendingParticipants && campaign.pendingParticipants.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-medium my-2">Чакащи одобрение участници</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Тези заявки могат да бъдат одобрени или отхвърлени от таб "Чакащи участници" в главното меню.
              </p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Име</TableHead>
                    <TableHead>Имейл</TableHead>
                    <TableHead>Роля</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaign.pendingParticipants.map((participant) => (
                    <TableRow key={participant.id}>
                      <TableCell>{participant.name}</TableCell>
                      <TableCell>{participant.email}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {translateRole(participant.role)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        <div className="mt-4 text-sm text-muted-foreground">
          <p>Забележка: Потребителите сами трябва да се запишат за участие в кампанията.</p>
          <p>Администраторите могат да одобрят или отхвърлят техните заявки от таб "Чакащи участници".</p>
        </div>
      </DialogContent>
    </Dialog>
  );
} 