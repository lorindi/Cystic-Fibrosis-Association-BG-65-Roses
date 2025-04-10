import React from "react";
import { Campaign, CampaignEvent } from "@/types/campaign";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  CampaignFormModal,
  CampaignEventFormModal,
  CampaignManageParticipantsDialog,
} from "./";

interface CampaignDialogsProps {
  // Campaign modal
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  selectedCampaign?: Campaign;
  onSubmitCampaign: (formData: Record<string, any>) => void;

  // Campaign delete dialog
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  onDeleteCampaign: () => void;

  // Event modal
  isEventModalOpen: boolean;
  setIsEventModalOpen: (open: boolean) => void;
  selectedEvent?: Partial<CampaignEvent>;
  onSubmitEvent: (formData: Record<string, any>) => void;

  // Event delete dialog
  isEventDeleteDialogOpen: boolean;
  setIsEventDeleteDialogOpen: (open: boolean) => void;
  onDeleteEvent: () => void;

  // Participants dialog
  isParticipantsModalOpen: boolean;
  setIsParticipantsModalOpen: (open: boolean) => void;
  participantsCampaignId?: string;
}

export const CampaignDialogs: React.FC<CampaignDialogsProps> = ({
  // Campaign modal
  isModalOpen,
  setIsModalOpen,
  selectedCampaign,
  onSubmitCampaign,

  // Campaign delete dialog
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  onDeleteCampaign,

  // Event modal
  isEventModalOpen,
  setIsEventModalOpen,
  selectedEvent,
  onSubmitEvent,

  // Event delete dialog
  isEventDeleteDialogOpen,
  setIsEventDeleteDialogOpen,
  onDeleteEvent,

  // Participants dialog
  isParticipantsModalOpen,
  setIsParticipantsModalOpen,
  participantsCampaignId,
}) => {
  return (
    <>
      {/* Campaign Form Modal */}
      <CampaignFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        campaign={selectedCampaign}
        onSubmit={onSubmitCampaign}
      />

      {/* Event Form Modal */}
      <CampaignEventFormModal
        open={isEventModalOpen}
        onOpenChange={setIsEventModalOpen}
        event={selectedEvent}
        onSubmit={onSubmitEvent}
      />

      {/* Participants Management Dialog */}
      {participantsCampaignId && (
        <CampaignManageParticipantsDialog
          open={isParticipantsModalOpen}
          onOpenChange={setIsParticipantsModalOpen}
          campaignId={participantsCampaignId}
        />
      )}

      {/* Delete Campaign Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. It will delete the campaign and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDeleteCampaign}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Event Dialog */}
      <AlertDialog open={isEventDeleteDialogOpen} onOpenChange={setIsEventDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. It will delete the event.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDeleteEvent}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}; 