"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Campaign, CampaignEvent } from "@/types/campaign";
import {
  CampaignsTab,
  PendingTab,
  EventsTab,
  CampaignDialogs,
  CampaignNotificationsIndicator
} from "../features/campaigns/components";
import {
  useCampaignsData,
  useCampaignMutations,
  useTabManagement,
  useModalManagement
} from "../features/campaigns/hooks";

// Дефиниране на типа EventFormValues за обработка на форма за събития
type EventFormValues = {
  title: string;
  description: string;
  date: string;
  location: string;
};

export default function CampaignsContent() {
  // Using custom hooks for better organization
  const {
    campaigns,
    pendingRequests,
    loading,
    error,
    campaignsPage,
    pendingPage,
    campaignsPerPage,
    pendingPerPage,
    campaignsMaxPage,
    pendingMaxPage,
    handleCampaignsPageChange,
    handlePendingPageChange,
    handleCampaignsPerPageChange,
    handlePendingPerPageChange,
    refetchCampaigns,
    refetchPending
  } = useCampaignsData();

  const {
    activeTab,
    currentCampaignId,
    handleTabChange,
    handleManageEvents,
    handleBackToCampaigns
  } = useTabManagement();

  const {
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
    
    // Campaign handlers
    handleEditCampaign,
    handleDeleteCampaignRequest,
    handleOpenCreateModal,
    
    // Event handlers
    handleEditEvent,
    handleDeleteEventRequest,
    handleOpenCreateEventModal,
    
    // Participants handlers
    handleManageParticipants
  } = useModalManagement();

  const {
    handleCreateOrUpdateCampaign,
    handleDeleteCampaign,
    handleCreateOrUpdateEvent,
    handleDeleteEvent,
    handleApproveParticipant,
    handleRejectParticipant
  } = useCampaignMutations({
    refetchCampaigns,
    refetchPending,
    campaignsPage,
    campaignsPerPage,
    pendingPage,
    pendingPerPage
  });

  // Mutation wrappers
  const handleCreateOrUpdate = React.useCallback(async (formData: Record<string, any>) => {
    const success = await handleCreateOrUpdateCampaign(formData, selectedCampaign);
    if (success) {
      setIsModalOpen(false);
    }
  }, [handleCreateOrUpdateCampaign, selectedCampaign, setIsModalOpen]);

  const handleDelete = React.useCallback(async () => {
    if (!campaignToDelete) return;
    
    const success = await handleDeleteCampaign(campaignToDelete.id);
    if (success) {
      setIsDeleteDialogOpen(false);
    }
  }, [campaignToDelete, handleDeleteCampaign, setIsDeleteDialogOpen]);

  const handleSubmitEvent = React.useCallback(async (formData: Record<string, any>) => {
    const success = await handleCreateOrUpdateEvent(formData, selectedEvent, currentCampaignId);
    if (success) {
      setIsEventModalOpen(false);
    }
  }, [currentCampaignId, handleCreateOrUpdateEvent, selectedEvent, setIsEventModalOpen]);

  const handleEventDelete = React.useCallback(async () => {
    if (!eventToDelete?.id) return;
    
    const success = await handleDeleteEvent(eventToDelete.id);
    if (success) {
      setIsEventDeleteDialogOpen(false);
    }
  }, [eventToDelete, handleDeleteEvent, setIsEventDeleteDialogOpen]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  // Find current campaign for events tab
  const currentCampaign = currentCampaignId 
    ? campaigns.find((c: Campaign) => c.id === currentCampaignId) 
    : undefined;

  // Check for pending notifications
  const hasPendingRequests = pendingRequests.some(
    (c: any) => c.pendingParticipantsCount > 0
  );

  return (
    <div className="container mx-auto py-10">
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="pending">
              Pending participants
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="campaigns">
          <CampaignsTab 
            campaigns={campaigns}
            campaignsPage={campaignsPage}
            campaignsMaxPage={campaignsMaxPage}
            campaignsPerPage={campaignsPerPage}
            onEdit={handleEditCampaign}
            onDelete={handleDeleteCampaignRequest}
            onManageEvents={handleManageEvents}
            onManageParticipants={handleManageParticipants}
            onOpenCreateModal={handleOpenCreateModal}
            onPageChange={handleCampaignsPageChange}
            onPerPageChange={handleCampaignsPerPageChange}
          />
        </TabsContent>

        <TabsContent value="pending">
          <PendingTab 
            pendingRequests={pendingRequests}
            pendingPage={pendingPage}
            pendingMaxPage={pendingMaxPage}
            pendingPerPage={pendingPerPage}
            onApprove={handleApproveParticipant}
            onReject={handleRejectParticipant}
            onPageChange={handlePendingPageChange}
            onPerPageChange={handlePendingPerPageChange}
          />
        </TabsContent>

        <TabsContent value="events">
          <EventsTab 
            currentCampaign={currentCampaign}
            onEdit={handleEditEvent}
            onDelete={handleDeleteEventRequest}
            onBack={handleBackToCampaigns}
            onOpenCreateModal={handleOpenCreateEventModal}
          />
        </TabsContent>
      </Tabs>

      {/* All Dialogs & Modals */}
      <CampaignDialogs
        // Campaign modal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedCampaign={selectedCampaign}
        onSubmitCampaign={handleCreateOrUpdate}

        // Campaign delete dialog
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        onDeleteCampaign={handleDelete}

        // Event modal
        isEventModalOpen={isEventModalOpen}
        setIsEventModalOpen={setIsEventModalOpen}
        selectedEvent={selectedEvent}
        onSubmitEvent={handleSubmitEvent}

        // Event delete dialog
        isEventDeleteDialogOpen={isEventDeleteDialogOpen}
        setIsEventDeleteDialogOpen={setIsEventDeleteDialogOpen}
        onDeleteEvent={handleEventDelete}

        // Participants dialog
        isParticipantsModalOpen={isParticipantsModalOpen}
        setIsParticipantsModalOpen={setIsParticipantsModalOpen}
        participantsCampaignId={participantsCampaignId}
      />
    </div>
  );
} 