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
import { Campaign } from "@/types/campaign";
import { Calendar, ChevronDown, ChevronUp, Pencil, Trash, Users } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface CampaignsTableProps {
  campaigns: Campaign[];
  onEdit: (campaign: Campaign) => void;
  onDelete: (campaign: Campaign) => void;
  onManageEvents: (campaign: Campaign) => void;
  onManageParticipants: (campaign: Campaign) => void;
}

export function CampaignsTable({
  campaigns,
  onEdit,
  onDelete,
  onManageEvents,
  onManageParticipants,
}: CampaignsTableProps) {
  const [expandedRows, setExpandedRows] = React.useState<Record<string, boolean>>(
    {}
  );

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Calculate progress percentage
  const calculateProgress = (current: number, goal: number) => {
    if (goal <= 0) return 0;
    const percent = (current / goal) * 100;
    return Math.min(percent, 100);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Заглавие</TableHead>
            <TableHead>Описание</TableHead>
            <TableHead>Прогрес</TableHead>
            <TableHead>Начало</TableHead>
            <TableHead>Край</TableHead>
            <TableHead>Събития</TableHead>
            <TableHead>Участници</TableHead>
            <TableHead className="w-[100px] text-right">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campaigns.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-6">
                Няма налични кампании.
              </TableCell>
            </TableRow>
          ) : (
            campaigns.map((campaign) => (
              <TableRow key={campaign.id}>
                <TableCell>{campaign.title}</TableCell>
                <TableCell>
                  {campaign.description?.length > 50
                    ? `${campaign.description.substring(0, 50)}...`
                    : campaign.description}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <Progress
                      value={calculateProgress(
                        campaign.currentAmount,
                        campaign.goal
                      )}
                    />
                    <span className="text-xs text-muted-foreground">
                      {campaign.currentAmount} / {campaign.goal} лв.
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {campaign.startDate
                    ? formatDate(new Date(campaign.startDate))
                    : "N/A"}
                </TableCell>
                <TableCell>
                  {campaign.endDate
                    ? formatDate(new Date(campaign.endDate))
                    : "N/A"}
                </TableCell>
                <TableCell>
                  {campaign.events ? campaign.events.length : 0} събития
                </TableCell>
                <TableCell>
                  {campaign.participantsCount || 0} участници
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Отвори меню</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(campaign)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Редактирай
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onManageEvents(campaign)}>
                        <Calendar className="mr-2 h-4 w-4" />
                        Управлявай събития
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onManageParticipants(campaign)}>
                        <Users className="mr-2 h-4 w-4" />
                        Управлявай участници
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDelete(campaign)}>
                        <Trash className="mr-2 h-4 w-4" />
                        Изтрий
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
} 