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
  CampaignManageParticipantsDialog,
  CampaignNotificationsIndicator
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
import { useSearchParams, useRouter } from "next/navigation";

export default function CampaignsContent() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Извличаме tab параметъра от URL, ако има такъв
  const tabParam = searchParams.get('tab');
  
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
  
  // Participants management state
  const [isParticipantsModalOpen, setIsParticipantsModalOpen] = React.useState(false);
  const [participantsCampaignId, setParticipantsCampaignId] = React.useState<string | undefined>();
  
  // Tab state - по подразбиране или от URL
  const [activeTab, setActiveTab] = React.useState(tabParam || "campaigns");

  // Актуализация на URL при смяна на таб
  const updateTabInUrl = (tab: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('tab', tab);
    router.push(`?${params.toString()}`);
  };

  // Промяна на активния таб
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    updateTabInUrl(value);
  };

  // Pagination states
  const [campaignsPage, setCampaignsPage] = React.useState(1);
  const [pendingPage, setPendingPage] = React.useState(1);
  const [campaignsPerPage, setCampaignsPerPage] = React.useState(10);
  const [pendingPerPage, setPendingPerPage] = React.useState(10);
  const [totalCampaigns, setTotalCampaigns] = React.useState(0);
  const [totalPending, setTotalPending] = React.useState(0);

  const { data, loading, error, refetch } = useQuery(GET_CAMPAIGNS, {
    variables: {
      limit: campaignsPerPage,
      offset: (campaignsPage - 1) * campaignsPerPage,
    },
    onCompleted: (data) => {
      // Assuming the total count is available or can be approximated
      if (data?.getCampaigns?.length < campaignsPerPage && campaignsPage === 1) {
        setTotalCampaigns(data?.getCampaigns?.length || 0);
      } else if (data?.getCampaigns?.length === campaignsPerPage) {
        // We'll need to do a separate query to get the total count or have the backend provide it
        // For now, we'll set it to a safe value to allow pagination
        setTotalCampaigns(campaignsPage * campaignsPerPage + campaignsPerPage);
      }
    },
  });

  const { 
    data: pendingRequestsData, 
    loading: pendingLoading, 
    refetch: refetchPending 
  } = useQuery(GET_PENDING_CAMPAIGN_REQUESTS, {
    variables: {
      limit: pendingPerPage,
      offset: (pendingPage - 1) * pendingPerPage,
    },
    onCompleted: (data) => {
      // Similar approach for total count
      if (data?.getPendingCampaignRequests?.length < pendingPerPage && pendingPage === 1) {
        setTotalPending(data?.getPendingCampaignRequests?.length || 0);
      } else if (data?.getPendingCampaignRequests?.length === pendingPerPage) {
        setTotalPending(pendingPage * pendingPerPage + pendingPerPage);
      }
    },
  });

  const [createCampaign] = useMutation(CREATE_CAMPAIGN, {
    refetchQueries: [{ 
      query: GET_CAMPAIGNS,
      variables: {
        limit: campaignsPerPage,
        offset: (campaignsPage - 1) * campaignsPerPage,
      }
    }],
  });

  const [updateCampaign] = useMutation(UPDATE_CAMPAIGN, {
    refetchQueries: [{ 
      query: GET_CAMPAIGNS,
      variables: {
        limit: campaignsPerPage,
        offset: (campaignsPage - 1) * campaignsPerPage,
      }
    }],
  });

  const [deleteCampaign] = useMutation(DELETE_CAMPAIGN, {
    refetchQueries: [{ 
      query: GET_CAMPAIGNS,
      variables: {
        limit: campaignsPerPage,
        offset: (campaignsPage - 1) * campaignsPerPage,
      }
    }],
  });

  // Event mutations
  const [addCampaignEvent] = useMutation(ADD_CAMPAIGN_EVENT, {
    refetchQueries: [{ 
      query: GET_CAMPAIGNS,
      variables: {
        limit: campaignsPerPage,
        offset: (campaignsPage - 1) * campaignsPerPage,
      }
    }],
  });

  const [updateCampaignEvent] = useMutation(UPDATE_CAMPAIGN_EVENT, {
    refetchQueries: [{ 
      query: GET_CAMPAIGNS,
      variables: {
        limit: campaignsPerPage,
        offset: (campaignsPage - 1) * campaignsPerPage,
      }
    }],
  });

  const [deleteCampaignEvent] = useMutation(DELETE_CAMPAIGN_EVENT, {
    refetchQueries: [{ 
      query: GET_CAMPAIGNS,
      variables: {
        limit: campaignsPerPage,
        offset: (campaignsPage - 1) * campaignsPerPage,
      } 
    }],
  });

  // Participant management mutations
  const [approveCampaignParticipant] = useMutation(APPROVE_CAMPAIGN_PARTICIPANT, {
    refetchQueries: [
      { 
        query: GET_PENDING_CAMPAIGN_REQUESTS,
        variables: {
          limit: pendingPerPage,
          offset: (pendingPage - 1) * pendingPerPage,
        }
      },
      { 
        query: GET_CAMPAIGNS,
        variables: {
          limit: campaignsPerPage,
          offset: (campaignsPage - 1) * campaignsPerPage,
        }
      }
    ],
  });
  
  const [rejectCampaignParticipant] = useMutation(REJECT_CAMPAIGN_PARTICIPANT, {
    refetchQueries: [
      { 
        query: GET_PENDING_CAMPAIGN_REQUESTS,
        variables: {
          limit: pendingPerPage,
          offset: (pendingPage - 1) * pendingPerPage,
        }
      }
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
      
      // Refresh data with pagination
      refetch({
        limit: campaignsPerPage,
        offset: (campaignsPage - 1) * campaignsPerPage,
      });
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
      
      // Refresh data with pagination
      refetch({
        limit: campaignsPerPage,
        offset: (campaignsPage - 1) * campaignsPerPage,
      });
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
      
      // Refresh data with pagination
      refetch({
        limit: campaignsPerPage,
        offset: (campaignsPage - 1) * campaignsPerPage,
      });
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
      
      // Refresh data with pagination
      refetch({
        limit: campaignsPerPage,
        offset: (campaignsPage - 1) * campaignsPerPage,
      });
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
      refetchPending({
        limit: pendingPerPage,
        offset: (pendingPage - 1) * pendingPerPage,
      });
      refetch({
        limit: campaignsPerPage,
        offset: (campaignsPage - 1) * campaignsPerPage,
      });
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
      refetchPending({
        limit: pendingPerPage,
        offset: (pendingPage - 1) * pendingPerPage,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Функция за управление на участниците
  const handleManageParticipants = (campaign: Campaign) => {
    setParticipantsCampaignId(campaign.id);
    setIsParticipantsModalOpen(true);
  };

  // Pagination handlers
  const handleCampaignsPageChange = (newPage: number) => {
    setCampaignsPage(newPage);
  };

  const handlePendingPageChange = (newPage: number) => {
    setPendingPage(newPage);
  };

  const handleCampaignsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPerPage = parseInt(e.target.value);
    setCampaignsPerPage(newPerPage);
    setCampaignsPage(1); // Reset to first page when changing items per page
  };

  const handlePendingPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPerPage = parseInt(e.target.value);
    setPendingPerPage(newPerPage);
    setPendingPage(1); // Reset to first page when changing items per page
  };

  if (loading || pendingLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const campaigns = data?.getCampaigns || [];
  const pendingRequests = pendingRequestsData?.getPendingCampaignRequests || [];

  const campaignsMaxPage = Math.ceil(totalCampaigns / campaignsPerPage);
  const pendingMaxPage = Math.ceil(totalPending / pendingPerPage);

  return (
    <div className="container mx-auto py-10">
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger 
              value="pending" 
              className="relative"
            >
              Pending participants
              {pendingRequests.some(
                (c: any) => c.pendingParticipantsCount > 0
              ) && (
                <span className="absolute top-0 right-0 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              )}
            </TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <CampaignNotificationsIndicator />
            
            {activeTab === "campaigns" && (
              <Button
                onClick={() => {
                  setSelectedCampaign(undefined);
                  setIsModalOpen(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Campaign
              </Button>
            )}
          </div>
        </div>

        <TabsContent value="campaigns">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Campaigns</h1>
          </div>

          <CampaignsTable
            campaigns={campaigns}
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
              handleTabChange("events");
            }}
            onManageParticipants={handleManageParticipants}
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
                onChange={handleCampaignsPerPageChange}
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
                onClick={() => handleCampaignsPageChange(campaignsPage - 1)}
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
                onClick={() => handleCampaignsPageChange(campaignsPage + 1)}
                disabled={campaignsPage >= campaignsMaxPage || campaigns.length < campaignsPerPage}
              >
                Next
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="pending">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Pending approval participants</h1>
          </div>

          <PendingParticipantsTable
            pendingRequests={pendingRequests}
            onApprove={handleApproveParticipant}
            onReject={handleRejectParticipant}
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
                onChange={handlePendingPerPageChange}
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
                onClick={() => handlePendingPageChange(pendingPage - 1)}
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
                onClick={() => handlePendingPageChange(pendingPage + 1)}
                disabled={pendingPage >= pendingMaxPage || pendingRequests.length < pendingPerPage}
              >
                Next
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="events">
          {currentCampaignId && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">
                  {campaigns.find((c: any) => c.id === currentCampaignId)?.title} - Events
                </h1>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleTabChange("campaigns");
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
                campaign={campaigns.find((c: any) => c.id === currentCampaignId)}
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