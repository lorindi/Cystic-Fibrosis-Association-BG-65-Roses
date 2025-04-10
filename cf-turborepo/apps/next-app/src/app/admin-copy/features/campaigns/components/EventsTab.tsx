import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Campaign, CampaignEvent } from "@/types/campaign";
import { CampaignEventsTable } from "./CampaignEventsTable";

interface EventsTabProps {
  currentCampaign?: Campaign;
  onEdit: (event: CampaignEvent) => void;
  onDelete: (event: CampaignEvent) => void;
  onBack: () => void;
  onOpenCreateModal: () => void;
}

export const EventsTab: React.FC<EventsTabProps> = ({
  currentCampaign,
  onEdit,
  onDelete,
  onBack,
  onOpenCreateModal
}) => {
  if (!currentCampaign) return null;

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {currentCampaign.title} - Events
        </h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onBack}
          >
            Back to campaigns
          </Button>
          <Button
            onClick={onOpenCreateModal}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Event
          </Button>
        </div>
      </div>

      <CampaignEventsTable
        campaign={currentCampaign}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </>
  );
}; 