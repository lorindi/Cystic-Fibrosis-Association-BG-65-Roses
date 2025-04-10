import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Campaign } from "@/types/campaign";
import { CampaignsTable } from "./CampaignsTable";

interface CampaignsTabProps {
  campaigns: Campaign[];
  campaignsPage: number;
  campaignsMaxPage: number;
  campaignsPerPage: number;
  onEdit: (campaign: Campaign) => void;
  onDelete: (campaign: Campaign) => void;
  onManageEvents: (campaign: Campaign) => void;
  onManageParticipants: (campaign: Campaign) => void;
  onOpenCreateModal: () => void;
  onPageChange: (page: number) => void;
  onPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const CampaignsTab: React.FC<CampaignsTabProps> = ({
  campaigns,
  campaignsPage,
  campaignsMaxPage,
  campaignsPerPage,
  onEdit,
  onDelete,
  onManageEvents,
  onManageParticipants,
  onOpenCreateModal,
  onPageChange,
  onPerPageChange
}) => {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Campaigns</h1>
        <Button onClick={onOpenCreateModal}>
          <Plus className="mr-2 h-4 w-4" /> Add Campaign
        </Button>
      </div>

      <CampaignsTable
        campaigns={campaigns}
        onEdit={onEdit}
        onDelete={onDelete}
        onManageEvents={onManageEvents}
        onManageParticipants={onManageParticipants}
      />

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Rows per page:
          </span>
          <select
            className="border rounded px-2 py-1 text-sm"
            value={campaignsPerPage}
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
            onClick={() => onPageChange(campaignsPage - 1)}
            disabled={campaignsPage <= 1}
          >
            Previous
          </Button>
          <span className="text-sm">
            Page {campaignsPage} of {campaignsMaxPage || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(campaignsPage + 1)}
            disabled={campaignsPage >= campaignsMaxPage || campaigns.length < campaignsPerPage}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
}; 