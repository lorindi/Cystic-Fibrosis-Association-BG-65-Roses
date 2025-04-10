import { useQuery } from "@apollo/client";
import { useState } from "react";
import { Campaign } from "@/types/campaign";
import { GET_CAMPAIGNS, GET_PENDING_CAMPAIGN_REQUESTS } from "../../../graphql/campaigns";

interface UseCampaignsDataProps {
  initialCampaignsPerPage?: number;
  initialPendingPerPage?: number;
}

export const useCampaignsData = ({
  initialCampaignsPerPage = 10,
  initialPendingPerPage = 10
}: UseCampaignsDataProps = {}) => {
  // Pagination states
  const [campaignsPage, setCampaignsPage] = useState(1);
  const [pendingPage, setPendingPage] = useState(1);
  const [campaignsPerPage, setCampaignsPerPage] = useState(initialCampaignsPerPage);
  const [pendingPerPage, setPendingPerPage] = useState(initialPendingPerPage);
  const [totalCampaigns, setTotalCampaigns] = useState(0);
  const [totalPending, setTotalPending] = useState(0);

  // Get campaigns data
  const { 
    data, 
    loading: campaignsLoading, 
    error: campaignsError, 
    refetch: refetchCampaigns 
  } = useQuery(GET_CAMPAIGNS, {
    variables: {
      limit: campaignsPerPage,
      offset: (campaignsPage - 1) * campaignsPerPage,
    },
    onCompleted: (data) => {
      if (data?.getCampaigns?.length < campaignsPerPage && campaignsPage === 1) {
        setTotalCampaigns(data?.getCampaigns?.length || 0);
      } else if (data?.getCampaigns?.length === campaignsPerPage) {
        setTotalCampaigns(campaignsPage * campaignsPerPage + campaignsPerPage);
      }
    },
  });

  // Get pending requests data
  const { 
    data: pendingRequestsData, 
    loading: pendingLoading, 
    error: pendingError,
    refetch: refetchPending 
  } = useQuery(GET_PENDING_CAMPAIGN_REQUESTS, {
    variables: {
      limit: pendingPerPage,
      offset: (pendingPage - 1) * pendingPerPage,
    },
    onCompleted: (data) => {
      if (data?.getPendingCampaignRequests?.length < pendingPerPage && pendingPage === 1) {
        setTotalPending(data?.getPendingCampaignRequests?.length || 0);
      } else if (data?.getPendingCampaignRequests?.length === pendingPerPage) {
        setTotalPending(pendingPage * pendingPerPage + pendingPerPage);
      }
    },
  });

  // Computed values
  const campaigns: Campaign[] = data?.getCampaigns || [];
  const pendingRequests = pendingRequestsData?.getPendingCampaignRequests || [];
  const campaignsMaxPage = Math.ceil(totalCampaigns / campaignsPerPage);
  const pendingMaxPage = Math.ceil(totalPending / pendingPerPage);
  const loading = campaignsLoading || pendingLoading;
  const error = campaignsError || pendingError;

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

  return {
    // Data
    campaigns,
    pendingRequests,
    
    // Loading and error states
    loading,
    error,
    
    // Pagination states
    campaignsPage,
    pendingPage,
    campaignsPerPage,
    pendingPerPage,
    campaignsMaxPage,
    pendingMaxPage,
    
    // Pagination handlers
    handleCampaignsPageChange,
    handlePendingPageChange,
    handleCampaignsPerPageChange,
    handlePendingPerPageChange,
    
    // Refetch functions
    refetchCampaigns,
    refetchPending
  };
}; 