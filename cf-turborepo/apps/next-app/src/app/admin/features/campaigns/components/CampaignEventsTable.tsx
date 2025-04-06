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
import { Pencil, Trash, ChevronDown, ChevronRight } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface CampaignEventsTableProps {
  campaign: Campaign;
  onEdit: (event: any) => void;
  onDelete: (event: any) => void;
}

export function CampaignEventsTable({
  campaign,
  onEdit,
  onDelete,
}: CampaignEventsTableProps) {
  const [expandedEventId, setExpandedEventId] = React.useState<string | null>(null);
  
  const toggleExpand = (eventId: string) => {
    setExpandedEventId(expandedEventId === eventId ? null : eventId);
  };

  if (!campaign || !campaign.events || campaign.events.length === 0) {
    return (
      <div className="text-center p-6 bg-muted/50 rounded-md">
        <p className="text-muted-foreground">Няма добавени събития за тази кампания.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Заглавие</TableHead>
          <TableHead>Дата</TableHead>
          <TableHead>Местоположение</TableHead>
          <TableHead>Действия</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {campaign.events.map((event) => (
          <React.Fragment key={event.id}>
            <TableRow 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => toggleExpand(event.id)}
            >
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  {expandedEventId === event.id ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                  {event.title}
                </div>
              </TableCell>
              <TableCell>{formatDate(event.date)}</TableCell>
              <TableCell>{event.location}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(event);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(event);
                    }}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
            {expandedEventId === event.id && (
              <TableRow className="bg-muted/30">
                <TableCell colSpan={4} className="p-4">
                  <div className="text-sm">
                    <h4 className="font-semibold mb-2">Описание:</h4>
                    <p className="whitespace-pre-wrap text-muted-foreground">{event.description || "Няма описание"}</p>
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