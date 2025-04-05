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
import { ChevronDown, ChevronUp, Pencil, Trash } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface CampaignsTableProps {
  campaigns: Campaign[];
  onEdit: (campaign: Campaign) => void;
  onDelete: (campaign: Campaign) => void;
}

export function CampaignsTable({
  campaigns,
  onEdit,
  onDelete,
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
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(campaign);
                    }}
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
                  >
                    <Trash className="h-4 w-4" />
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
                <TableCell colSpan={6} className="bg-muted/50">
                  <div className="p-4">
                    <h4 className="font-semibold mb-2">Описание:</h4>
                    <p className="text-sm text-muted-foreground">
                      {campaign.description}
                    </p>
                    <h4 className="font-semibold mt-4 mb-2">Събития:</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      {campaign.events?.map((event, index) => (
                        <li key={index}>
                          {event.title} - {formatDate(event.date)}
                        </li>
                      ))}
                    </ul>
                    <h4 className="font-semibold mt-4 mb-2">
                      Брой участници: {campaign.participantsCount || 0}
                    </h4>
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