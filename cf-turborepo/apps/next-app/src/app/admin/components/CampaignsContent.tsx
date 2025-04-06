"use client";

import * as React from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Campaign } from "@/types/campaign";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CampaignsTable,
  CampaignFormModal,
  CampaignEventsTable, 
  CampaignEventFormModal,
  PendingParticipantsTable,
} from "../features/campaigns/components";
import {
  GET_CAMPAIGNS,
  GET_PENDING_CAMPAIGN_REQUESTS,
  CREATE_CAMPAIGN,
  UPDATE_CAMPAIGN,
  DELETE_CAMPAIGN,
  ADD_CAMPAIGN_EVENT,
  UPDATE_CAMPAIGN_EVENT,
  DELETE_CAMPAIGN_EVENT,
  APPROVE_CAMPAIGN_PARTICIPANT,
  REJECT_CAMPAIGN_PARTICIPANT,
} from "../graphql/campaigns";

export default function CampaignsContent() {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedCampaign, setSelectedCampaign] = React.useState<Campaign | undefined>();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [campaignToDelete, setCampaignToDelete] = React.useState<Campaign | undefined>();
  
  // Event management states
  const [isEventModalOpen, setIsEventModalOpen] = React.useState(false);
  const [selectedEvent, setSelectedEvent] = React.useState<any | undefined>();
  const [currentCampaignId, setCurrentCampaignId] = React.useState<string | undefined>();
  const [isEventDeleteDialogOpen, setIsEventDeleteDialogOpen] = React.useState(false);
  const [eventToDelete, setEventToDelete] = React.useState<any | undefined>();
  
  // Tab state
  const [activeTab, setActiveTab] = React.useState("campaigns");

  const { data, loading, error, refetch } = useQuery(GET_CAMPAIGNS);
  const { data: pendingRequestsData, loading: pendingLoading, refetch: refetchPending } = useQuery(GET_PENDING_CAMPAIGN_REQUESTS);

  const [createCampaign] = useMutation(CREATE_CAMPAIGN, {
    refetchQueries: [{ query: GET_CAMPAIGNS }],
  });

  const [updateCampaign] = useMutation(UPDATE_CAMPAIGN, {
    refetchQueries: [{ query: GET_CAMPAIGNS }],
  });

  const [deleteCampaign] = useMutation(DELETE_CAMPAIGN, {
    refetchQueries: [{ query: GET_CAMPAIGNS }],
  });

  // Event mutations
  const [addCampaignEvent] = useMutation(ADD_CAMPAIGN_EVENT, {
    refetchQueries: [{ query: GET_CAMPAIGNS }],
  });

  const [updateCampaignEvent] = useMutation(UPDATE_CAMPAIGN_EVENT, {
    refetchQueries: [{ query: GET_CAMPAIGNS }],
  });

  const [deleteCampaignEvent] = useMutation(DELETE_CAMPAIGN_EVENT, {
    refetchQueries: [{ query: GET_CAMPAIGNS }],
  });

  // Participant management mutations
  const [approveCampaignParticipant] = useMutation(APPROVE_CAMPAIGN_PARTICIPANT, {
    refetchQueries: [
      { query: GET_PENDING_CAMPAIGN_REQUESTS },
      { query: GET_CAMPAIGNS }
    ],
  });
  
  const [rejectCampaignParticipant] = useMutation(REJECT_CAMPAIGN_PARTICIPANT, {
    refetchQueries: [
      { query: GET_PENDING_CAMPAIGN_REQUESTS }
    ],
  });

  const handleCreateOrUpdate = async (formData: any) => {
    try {
      if (selectedCampaign) {
        await updateCampaign({
          variables: {
            id: selectedCampaign.id,
            input: formData,
          },
        });
        toast({
          title: "Success",
          description: "The campaign has been updated successfully",
        });
      } else {
        await createCampaign({
          variables: {
            input: formData,
          },
        });
        toast({
          title: "Success",
          description: "The campaign has been created successfully",
        });
      }
      setIsModalOpen(false);
      setSelectedCampaign(undefined);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!campaignToDelete) return;

    try {
      await deleteCampaign({
        variables: {
          id: campaignToDelete.id,
        },
      });
      toast({
        title: "Success",
        description: "The campaign has been deleted successfully",
      });
      setIsDeleteDialogOpen(false);
      setCampaignToDelete(undefined);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  // Event functions
  const handleCreateOrUpdateEvent = async (formData: any) => {
    try {
      if (selectedEvent) {
        await updateCampaignEvent({
          variables: {
            eventId: selectedEvent.id,
            input: formData,
          },
        });
        toast({
          title: "Success",
          description: "The event has been updated successfully",
        });
      } else if (currentCampaignId) {
        await addCampaignEvent({
          variables: {
            campaignId: currentCampaignId,
            input: formData,
          },
        });
        toast({
          title: "Success",
          description: "The event has been added successfully",
        });
      }
      setIsEventModalOpen(false);
      setSelectedEvent(undefined);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteEvent = async () => {
    if (!eventToDelete) return;

    try {
      await deleteCampaignEvent({
        variables: {
          eventId: eventToDelete.id,
        },
      });
      toast({
        title: "Success",
        description: "The event has been deleted successfully",
      });
      setIsEventDeleteDialogOpen(false);
      setEventToDelete(undefined);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  // Participant approval function
  const handleApproveParticipant = async (campaignId: string, userId: string) => {
    try {
      await approveCampaignParticipant({
        variables: {
          campaignId,
          userId,
        },
      });
      toast({
        title: "Success",
        description: "The participant has been approved successfully",
      });
      refetchPending();
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  // Participant rejection function
  const handleRejectParticipant = async (campaignId: string, userId: string) => {
    try {
      await rejectCampaignParticipant({
        variables: {
          campaignId,
          userId,
        },
      });
      toast({
        title: "Success",
        description: "The participant request has been rejected",
      });
      refetchPending();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading || pendingLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto py-10">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
              <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger 
            value="pending" 
            className="relative"
          >
            Pending participants
            {pendingRequestsData?.getPendingCampaignRequests?.some(
              (c: any) => c.pendingParticipantsCount > 0
            ) && (
              <span className="absolute top-0 right-0 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Campaigns</h1>
            <Button
              onClick={() => {
                setSelectedCampaign(undefined);
                setIsModalOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Campaign
            </Button>
          </div>

          <CampaignsTable
            campaigns={data.getCampaigns}
            onEdit={(campaign) => {
              setSelectedCampaign(campaign);
              setIsModalOpen(true);
            }}
            onDelete={(campaign) => {
              setCampaignToDelete(campaign);
              setIsDeleteDialogOpen(true);
            }}
            onManageEvents={(campaign) => {
              setCurrentCampaignId(campaign.id);
              setActiveTab("events");
            }}
          />
        </TabsContent>

        <TabsContent value="pending">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Pending approval participants</h1>
          </div>

          <PendingParticipantsTable
            pendingRequests={pendingRequestsData?.getPendingCampaignRequests || []}
            onApprove={handleApproveParticipant}
            onReject={handleRejectParticipant}
          />
        </TabsContent>

        <TabsContent value="events">
          {currentCampaignId && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">
                  {data.getCampaigns.find((c: any) => c.id === currentCampaignId)?.title} - Events
                </h1>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setActiveTab("campaigns");
                      setCurrentCampaignId(undefined);
                    }}
                  >
                    Back to campaigns
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedEvent(undefined);
                      setIsEventModalOpen(true);
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Event
                  </Button>
                </div>
              </div>

              <CampaignEventsTable
                campaign={data.getCampaigns.find((c: any) => c.id === currentCampaignId)}
                onEdit={(event: any) => {
                  setSelectedEvent(event);
                  setIsEventModalOpen(true);
                }}
                onDelete={(event: any) => {
                  setEventToDelete(event);
                  setIsEventDeleteDialogOpen(true);
                }}
              />
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Campaign Form Modal */}
      <CampaignFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        campaign={selectedCampaign}
        onSubmit={handleCreateOrUpdate}
      />

      {/* Event Form Modal */}
      <CampaignEventFormModal
        open={isEventModalOpen}
        onOpenChange={setIsEventModalOpen}
        event={selectedEvent}
        onSubmit={handleCreateOrUpdateEvent}
      />

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
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
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
            <AlertDialogAction onClick={handleDeleteEvent}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 