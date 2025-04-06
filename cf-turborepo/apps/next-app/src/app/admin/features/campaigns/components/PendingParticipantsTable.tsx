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
import { 
  ChevronDown, 
  ChevronUp, 
  CheckCircle, 
  User, 
  Calendar, 
  X,
  MoreHorizontal,
  Info,
  AlertCircle 
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface PendingParticipantsTableProps {
  pendingRequests: Array<{
    id: string;
    title: string;
    startDate: string;
    endDate?: string;
    pendingParticipantsCount: number;
    pendingParticipants: Array<{
      _id: string;
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
        return "Administrator";
      case "patient":
        return "Patient";
      case "parent":
        return "Parent";
      case "donor":
        return "Donor";
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
            <p className="text-muted-foreground">No pending approval requests.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="rounded-md border p-4 bg-muted/20">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              <strong>Note:</strong> This functionality allows you to approve or reject participation requests in campaigns.
            </p>
            <p className="text-sm text-muted-foreground">
              The users themselves sign up for the campaigns, after which administrators or users with the "campaigns" group can approve or reject the requests.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            Total number of pending requests:
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
              <TableHead className="w-[40%]">Campaign</TableHead>
              <TableHead className="w-[40%]">Period</TableHead>
              <TableHead className="w-[20%] text-center">Number of pending</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaignsWithPendingParticipants.map((campaign) => (
              <React.Fragment key={campaign.id}>
                <TableRow 
                  className={`cursor-pointer hover:bg-muted/50 ${
                    expandedCampaigns[campaign.id] ? "bg-muted/30" : ""
                  }`}
                  onClick={() => toggleCampaignExpand(campaign.id)}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCampaignExpand(campaign.id);
                        }}
                        className="p-1 rounded-full hover:bg-muted"
                      >
                        {expandedCampaigns[campaign.id] ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-2">
                              {campaign.title}
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Click for more details about the pending participants</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {formatDate(campaign.startDate)}
                        {campaign.endDate && ` - ${formatDate(campaign.endDate)}`}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                      {campaign.pendingParticipantsCount}
                    </Badge>
                  </TableCell>
                </TableRow>

                {expandedCampaigns[campaign.id] && (
                  <TableRow>
                    <TableCell colSpan={3} className="p-0">
                      <div className="p-4 bg-muted/30 border-t">
                        <h3 className="font-medium mb-3 flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          Pending approval participants
                        </h3>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Role</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {campaign.pendingParticipants.map((participant) => (
                              <TableRow key={participant._id}>
                                <TableCell className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-muted-foreground" />
                                  {participant.name}
                                </TableCell>
                                <TableCell>{participant.email}</TableCell>
                                <TableCell>
                                  <Badge 
                                    variant="outline" 
                                    className={
                                      participant.role === "patient" 
                                        ? "border-blue-200 bg-blue-50 text-blue-700"
                                        : participant.role === "parent"
                                        ? "border-green-200 bg-green-50 text-green-700"
                                        : "border-gray-200 bg-gray-50 text-gray-700"
                                    }
                                  >
                                    {translateRole(participant.role)}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="border-red-200 text-red-600 hover:bg-red-50 flex items-center"
                                      onClick={() => onReject(campaign.id, participant._id)}
                                    >
                                      <X className="h-4 w-4 mr-2" />
                                      Reject
                                    </Button>
                                    <Button
                                      size="sm"
                                      className="bg-black text-white hover:bg-black/80 flex items-center"
                                      onClick={() => onApprove(campaign.id, participant._id)}
                                    >
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Approve
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
    </div>
  );
} 