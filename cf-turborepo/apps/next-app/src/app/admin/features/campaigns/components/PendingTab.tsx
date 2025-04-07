import React from "react";
import { Button } from "@/components/ui/button";
import { PendingParticipantsTable } from "./PendingParticipantsTable";

interface PendingRequest {
  id: string;
  campaignId: string;
  campaignTitle: string;
  userId: string;
  userName: string;
  userEmail: string;
  status: string;
  createdAt: string;
  pendingParticipantsCount: number;
}

interface PendingTabProps {
  pendingRequests: PendingRequest[];
  pendingPage: number;
  pendingMaxPage: number;
  pendingPerPage: number;
  onApprove: (campaignId: string, userId: string) => void;
  onReject: (campaignId: string, userId: string) => void;
  onPageChange: (page: number) => void;
  onPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const PendingTab: React.FC<PendingTabProps> = ({
  pendingRequests,
  pendingPage,
  pendingMaxPage,
  pendingPerPage,
  onApprove,
  onReject,
  onPageChange,
  onPerPageChange
}) => {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Pending approval participants</h1>
      </div>

      <PendingParticipantsTable
        pendingRequests={pendingRequests}
        onApprove={onApprove}
        onReject={onReject}
      />

      {/* Pending Requests Pagination Controls */}
      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Rows per page:
          </span>
          <select
            className="border rounded px-2 py-1 text-sm"
            value={pendingPerPage}
            onChange={onPerPageChange}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pendingPage - 1)}
            disabled={pendingPage <= 1}
          >
            Previous
          </Button>
          <span className="text-sm">
            Page {pendingPage} of {pendingMaxPage || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pendingPage + 1)}
            disabled={pendingPage >= pendingMaxPage || pendingRequests.length < pendingPerPage}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
}; 