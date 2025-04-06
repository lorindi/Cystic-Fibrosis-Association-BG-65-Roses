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
import { Pencil, Trash } from "lucide-react";
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
          <TableRow key={event.id}>
            <TableCell className="font-medium">{event.title}</TableCell>
            <TableCell>{formatDate(event.date)}</TableCell>
            <TableCell>{event.location}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(event)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(event)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
} 