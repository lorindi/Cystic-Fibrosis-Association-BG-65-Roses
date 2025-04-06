"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, CheckCircle, User, Calendar, X } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface PendingParticipantsTableProps {
  pendingRequests: Array<{
    id: string;
    title: string;
    startDate: string;
    endDate?: string;
    pendingParticipantsCount: number;
    pendingParticipants: Array<{
      id: string;
      name: string;
      email: string;
      role: string;
    }>;
  }>;
  onApprove: (campaignId: string, userId: string) => void;
  onReject: (campaignId: string, userId: string) => void;
}

export function PendingParticipantsTable({
  pendingRequests,
  onApprove,
  onReject,
}: PendingParticipantsTableProps) {
  const [expandedCampaigns, setExpandedCampaigns] = React.useState<Record<string, boolean>>({});

  const toggleCampaignExpand = (campaignId: string) => {
    setExpandedCampaigns((prev) => ({
      ...prev,
      [campaignId]: !prev[campaignId],
    }));
  };

  // Превод на роля на български
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

  // Филтрираме заявките, за да покажем само кампании с чакащи участници
  const campaignsWithPendingParticipants = pendingRequests.filter(
    (campaign) => campaign.pendingParticipantsCount > 0
  );

  if (campaignsWithPendingParticipants.length === 0) {
    return (
      <div className="text-center p-6 bg-muted/50 rounded-md">
        <p className="text-muted-foreground">Няма чакащи заявки за одобрение.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {pendingRequests.length === 0 ? (
        <div className="rounded-md border p-8 text-center">
          <p className="text-muted-foreground">
            Няма чакащи заявки за одобрение.
          </p>
        </div>
      ) : (
        <>
          <div className="rounded-md border p-4 bg-muted/20">
            <p className="text-sm text-muted-foreground mb-2">
              <strong>Забележка:</strong> Тази функционалност позволява одобряване или отхвърляне на заявки за участие в кампании.
            </p>
            <p className="text-sm text-muted-foreground">
              Потребителите сами се записват за кампаниите, след което администратори или потребители с група "campaigns" могат да одобрят или отхвърлят заявките.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                Общ брой чакащи заявки:
                <Badge variant="secondary" className="ml-2">
                  {campaignsWithPendingParticipants.reduce(
                    (total, campaign) => total + campaign.pendingParticipantsCount,
                    0
                  )}
                </Badge>
              </h2>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Кампания</TableHead>
                  <TableHead>Период</TableHead>
                  <TableHead>Брой чакащи</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaignsWithPendingParticipants.map((campaign) => (
                  <React.Fragment key={campaign.id}>
                    <TableRow className="cursor-pointer hover:bg-muted/50">
                      <TableCell
                        className="font-medium"
                        onClick={() => toggleCampaignExpand(campaign.id)}
                      >
                        {campaign.title}
                      </TableCell>
                      <TableCell onClick={() => toggleCampaignExpand(campaign.id)}>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {formatDate(campaign.startDate)}
                            {campaign.endDate && ` - ${formatDate(campaign.endDate)}`}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell onClick={() => toggleCampaignExpand(campaign.id)}>
                        <Badge variant="secondary">{campaign.pendingParticipantsCount}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleCampaignExpand(campaign.id)}
                        >
                          {expandedCampaigns[campaign.id] ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>

                    {expandedCampaigns[campaign.id] && (
                      <TableRow>
                        <TableCell colSpan={4} className="p-0">
                          <div className="p-4 bg-muted/30">
                            <h3 className="font-medium mb-2">Чакащи одобрение участници:</h3>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Име</TableHead>
                                  <TableHead>Email</TableHead>
                                  <TableHead>Роля</TableHead>
                                  <TableHead className="text-right">Действия</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {campaign.pendingParticipants.map((participant) => (
                                  <TableRow key={participant.id}>
                                    <TableCell className="flex items-center gap-2">
                                      <User className="h-4 w-4" />
                                      {participant.name}
                                    </TableCell>
                                    <TableCell>{participant.email}</TableCell>
                                    <TableCell>
                                      <Badge variant="outline">{translateRole(participant.role)}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <div className="flex justify-end gap-2">
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="border-destructive text-destructive hover:bg-destructive/10"
                                          onClick={() => onReject(campaign.id, participant.id)}
                                        >
                                          <X className="h-4 w-4 mr-2" />
                                          Откажи
                                        </Button>
                                        <Button
                                          size="sm"
                                          onClick={() => onApprove(campaign.id, participant.id)}
                                        >
                                          <CheckCircle className="h-4 w-4 mr-2" />
                                          Одобри
                                        </Button>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
} 