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
import { CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PendingRequest {
  id: string;
  title: string;
  pendingParticipants: {
    id: string;
    name: string;
    email: string;
    role: string;
  }[];
  pendingParticipantsCount: number;
}

interface PendingParticipantsTableProps {
  pendingRequests: PendingRequest[];
  onApprove: (campaignId: string, userId: string) => void;
}

export function PendingParticipantsTable({
  pendingRequests,
  onApprove,
}: PendingParticipantsTableProps) {
  const [expandedRows, setExpandedRows] = React.useState<Record<string, boolean>>(
    {}
  );

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (!pendingRequests || pendingRequests.length === 0) {
    return (
      <div className="text-center p-6 bg-muted/50 rounded-md">
        <p className="text-muted-foreground">Няма чакащи заявки за одобрение.</p>
      </div>
    );
  }

  // Filter out campaigns with no pending participants
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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Кампания</TableHead>
          <TableHead>Брой чакащи</TableHead>
          <TableHead>Действия</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {campaignsWithPendingParticipants.map((campaign) => (
          <React.Fragment key={campaign.id}>
            <TableRow
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => toggleRow(campaign.id)}
            >
              <TableCell className="font-medium">{campaign.title}</TableCell>
              <TableCell>
                <Badge variant="secondary">
                  {campaign.pendingParticipantsCount}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
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
                <TableCell colSpan={3} className="bg-muted/50 p-0">
                  <div className="p-4">
                    <h4 className="font-semibold mb-4">Чакащи одобрение участници:</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Име</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Роля</TableHead>
                          <TableHead>Действия</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {campaign.pendingParticipants.map((participant) => (
                          <TableRow key={participant.id}>
                            <TableCell>{participant.name}</TableCell>
                            <TableCell>{participant.email}</TableCell>
                            <TableCell>{participant.role}</TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  onApprove(campaign.id, participant.id)
                                }
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Одобри
                              </Button>
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
  );
} 