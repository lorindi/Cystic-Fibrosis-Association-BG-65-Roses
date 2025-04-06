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

interface CampaignsTableProps {
  campaigns: Campaign[];
  onEdit: (campaign: Campaign) => void;
  onDelete: (campaign: Campaign) => void;
  onManageEvents: (campaign: Campaign) => void;
}

export function CampaignsTable({
  campaigns,
  onEdit,
  onDelete,
  onManageEvents,
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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Заглавие</TableHead>
          <TableHead>Цел</TableHead>
          <TableHead>Текуща сума</TableHead>
          <TableHead>Начална дата</TableHead>
          <TableHead>Крайна дата</TableHead>
          <TableHead>Участници</TableHead>
          <TableHead>Действия</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {campaigns.map((campaign) => (
          <React.Fragment key={campaign.id}>
            <TableRow
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => toggleRow(campaign.id)}
            >
              <TableCell className="font-medium">{campaign.title}</TableCell>
              <TableCell>{campaign.goal}</TableCell>
              <TableCell>{campaign.currentAmount}</TableCell>
              <TableCell>{formatDate(campaign.startDate)}</TableCell>
              <TableCell>{formatDate(campaign.endDate)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {campaign.participantsCount || 0}
                  </Badge>
                  {campaign.pendingParticipantsCount > 0 && (
                    <Badge variant="destructive">
                      {campaign.pendingParticipantsCount} чакащи
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(campaign);
                    }}
                    title="Редактиране на кампания"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(campaign);
                    }}
                    title="Изтриване на кампания"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onManageEvents(campaign);
                    }}
                    title="Управление на събития"
                  >
                    <Calendar className="h-4 w-4" />
                  </Button>
                  {expandedRows[campaign.id] ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </TableCell>
            </TableRow>
            {expandedRows[campaign.id] && (
              <TableRow>
                <TableCell colSpan={7} className="bg-muted/50">
                  <div className="p-4">
                    <h4 className="font-semibold mb-2">Описание:</h4>
                    <p className="text-sm text-muted-foreground">
                      {campaign.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 mt-4">
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
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            onManageEvents(campaign);
                          }}
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          Управление на събития
                        </Button>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">
                          Участници: {campaign.participantsCount || 0}
                        </h4>
                        {campaign.pendingParticipantsCount > 0 && (
                          <p className="text-sm">
                            <Badge variant="destructive">
                              {campaign.pendingParticipantsCount} чакащи одобрение
                            </Badge>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  );
} 