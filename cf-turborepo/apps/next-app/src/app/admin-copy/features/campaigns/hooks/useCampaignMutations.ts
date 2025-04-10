import { useMutation } from "@apollo/client";
import { useToast } from "@/components/ui/use-toast";
import { Campaign, CampaignEvent } from "@/types/campaign";
import {
  CREATE_CAMPAIGN,
  UPDATE_CAMPAIGN,
  DELETE_CAMPAIGN,
  ADD_CAMPAIGN_EVENT,
  UPDATE_CAMPAIGN_EVENT,
  DELETE_CAMPAIGN_EVENT,
  APPROVE_CAMPAIGN_PARTICIPANT,
  REJECT_CAMPAIGN_PARTICIPANT,
} from "../../../graphql/campaigns";

interface MutationHooksProps {
  refetchCampaigns: (variables: any) => void;
  refetchPending: (variables: any) => void;
  campaignsPage: number;
  campaignsPerPage: number;
  pendingPage: number;
  pendingPerPage: number;
}

export const useCampaignMutations = ({
  refetchCampaigns,
  refetchPending,
  campaignsPage,
  campaignsPerPage,
  pendingPage,
  pendingPerPage,
}: MutationHooksProps) => {
  const { toast } = useToast();

  // Campaign mutations
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

  // Campaign handlers
  const handleCreateOrUpdateCampaign = async (formData: Record<string, any>, selectedCampaign?: Campaign) => {
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
      
      refetchCampaigns({
        limit: campaignsPerPage,
        offset: (campaignsPage - 1) * campaignsPerPage,
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const handleDeleteCampaign = async (campaignId: string) => {
    try {
      await deleteCampaign({
        variables: {
          id: campaignId,
        },
      });
      toast({
        title: "Success",
        description: "The campaign has been deleted successfully",
      });
      
      refetchCampaigns({
        limit: campaignsPerPage,
        offset: (campaignsPage - 1) * campaignsPerPage,
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };
  
  // Event handlers
  const handleCreateOrUpdateEvent = async (formData: Record<string, any>, selectedEvent?: Partial<CampaignEvent>, campaignId?: string) => {
    try {
      if (selectedEvent?.id) {
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
      } else if (campaignId) {
        await addCampaignEvent({
          variables: {
            campaignId: campaignId,
            input: formData,
          },
        });
        toast({
          title: "Success",
          description: "The event has been added successfully",
        });
      }
      
      refetchCampaigns({
        limit: campaignsPerPage,
        offset: (campaignsPage - 1) * campaignsPerPage,
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteCampaignEvent({
        variables: {
          eventId: eventId,
        },
      });
      toast({
        title: "Success",
        description: "The event has been deleted successfully",
      });
      
      refetchCampaigns({
        limit: campaignsPerPage,
        offset: (campaignsPage - 1) * campaignsPerPage,
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };
  
  // Participant handlers
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
      
      refetchCampaigns({
        limit: campaignsPerPage,
        offset: (campaignsPage - 1) * campaignsPerPage,
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };
  
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
      
      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    handleCreateOrUpdateCampaign,
    handleDeleteCampaign,
    handleCreateOrUpdateEvent,
    handleDeleteEvent,
    handleApproveParticipant,
    handleRejectParticipant
  };
};

import { GET_CAMPAIGNS, GET_PENDING_CAMPAIGN_REQUESTS } from "../../../graphql/campaigns"; 