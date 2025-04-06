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
  const [expandedRows, setExpandedRows] = React.useState<Record<string, boolean>>({});

  const toggleRow = (campaignId: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [campaignId]: !prev[campaignId],
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
            <TableHead>Начало</TableHead>
            <TableHead>Край</TableHead>
            <TableHead>Участници</TableHead>
            <TableHead className="w-[100px] text-right">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campaigns.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6">
                Няма налични кампании.
              </TableCell>
            </TableRow>
          ) : (
            campaigns.map((campaign) => (
              <React.Fragment key={campaign.id}>
                <TableRow 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => toggleRow(campaign.id)}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {expandedRows[campaign.id] ? (
                        <ChevronUp className="h-4 w-4 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="h-4 w-4 flex-shrink-0" />
                      )}
                      <span className="font-medium">{campaign.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {campaign.startDate
                      ? formatDate(new Date(campaign.startDate))
                      : "Няма начална дата"}
                  </TableCell>
                  <TableCell>
                    {campaign.endDate
                      ? formatDate(new Date(campaign.endDate))
                      : "Няма крайна дата"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Badge variant="outline">
                        {campaign.participantsCount || 0} участници
                      </Badge>
                      {campaign.pendingParticipantsCount > 0 && (
                        <Badge variant="destructive">
                          {campaign.pendingParticipantsCount} чакащи
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div onClick={(e) => e.stopPropagation()}>
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
                    </div>
                  </TableCell>
                </TableRow>
                {expandedRows[campaign.id] && (
                  <TableRow>
                    <TableCell colSpan={5} className="bg-muted/20 p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-2">Описание:</h4>
                          <p className="text-sm text-muted-foreground mb-4">
                            {campaign.description || "Няма описание"}
                          </p>
                          
                          <h4 className="font-semibold mb-2">Прогрес:</h4>
                          <div className="flex flex-col gap-1 mb-4">
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
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">Събития:</h4>
                          {campaign.events && campaign.events.length > 0 ? (
                            <ul className="list-disc list-inside text-sm text-muted-foreground">
                              {campaign.events.map((event) => (
                                <li key={event.id}>
                                  {event.title} - {formatDate(event.date)}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-muted-foreground">Няма добавени събития</p>
                          )}
                          
                          <div className="flex gap-2 mt-4">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onManageEvents(campaign);
                              }}
                            >
                              <Calendar className="h-4 w-4 mr-2" />
                              Управлявай събития
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onManageParticipants(campaign);
                              }}
                            >
                              <Users className="h-4 w-4 mr-2" />
                              Управлявай участници
                            </Button>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
} 