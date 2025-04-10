import { useState, useCallback } from "react";
import { Campaign, CampaignEvent } from "@/types/campaign";

export const useModalManagement = () => {
  // Campaign management states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | undefined>();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<Campaign | undefined>();
  
  // Event management states
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Partial<CampaignEvent> | undefined>();
  const [isEventDeleteDialogOpen, setIsEventDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Partial<CampaignEvent> | undefined>();
  
  // Participants management state
  const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false);
  const [participantsCampaignId, setParticipantsCampaignId] = useState<string | undefined>();

  // Campaign modal handlers
  const handleEditCampaign = useCallback((campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setIsModalOpen(true);
  }, []);

  const handleDeleteCampaignRequest = useCallback((campaign: Campaign) => {
    setCampaignToDelete(campaign);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleOpenCreateModal = useCallback(() => {
    setSelectedCampaign(undefined);
    setIsModalOpen(true);
  }, []);

  // Event modal handlers
  const handleEditEvent = useCallback((event: CampaignEvent) => {
    setSelectedEvent(event);
    setIsEventModalOpen(true);
  }, []);

  const handleDeleteEventRequest = useCallback((event: CampaignEvent) => {
    setEventToDelete(event);
    setIsEventDeleteDialogOpen(true);
  }, []);

  const handleOpenCreateEventModal = useCallback(() => {
    setSelectedEvent(undefined);
    setIsEventModalOpen(true);
  }, []);

  // Participants modal handlers
  const handleManageParticipants = useCallback((campaign: Campaign) => {
    setParticipantsCampaignId(campaign.id);
    setIsParticipantsModalOpen(true);
  }, []);

  // Cleanup functions
  const resetCampaignModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedCampaign(undefined);
  }, []);

  const resetCampaignDeleteDialog = useCallback(() => {
    setIsDeleteDialogOpen(false);
    setCampaignToDelete(undefined);
  }, []);

  const resetEventModal = useCallback(() => {
    setIsEventModalOpen(false);
    setSelectedEvent(undefined);
  }, []);

  const resetEventDeleteDialog = useCallback(() => {
    setIsEventDeleteDialogOpen(false);
    setEventToDelete(undefined);
  }, []);

  return {
    // Campaign modal states
    isModalOpen,
    setIsModalOpen,
    selectedCampaign,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    campaignToDelete,
    
    // Event modal states
    isEventModalOpen,
    setIsEventModalOpen,
    selectedEvent,
    isEventDeleteDialogOpen,
    setIsEventDeleteDialogOpen,
    eventToDelete,
    
    // Participants modal states
    isParticipantsModalOpen,
    setIsParticipantsModalOpen,
    participantsCampaignId,
    
    // Campaign modal handlers
    handleEditCampaign,
    handleDeleteCampaignRequest,
    handleOpenCreateModal,
    resetCampaignModal,
    resetCampaignDeleteDialog,
    
    // Event modal handlers
    handleEditEvent,
    handleDeleteEventRequest,
    handleOpenCreateEventModal,
    resetEventModal,
    resetEventDeleteDialog,
    
    // Participants modal handlers
    handleManageParticipants
  };
}; 