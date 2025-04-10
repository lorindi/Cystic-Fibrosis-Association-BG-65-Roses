import { useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Campaign } from "@/types/campaign";

export const useTabManagement = (initialTab: string = "campaigns") => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // URL param handling
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabParam || initialTab);
  const [currentCampaignId, setCurrentCampaignId] = useState<string | undefined>();
  
  // URL tab management
  const updateTabInUrl = useCallback((tab: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('tab', tab);
    router.push(`?${params.toString()}`);
  }, [router, searchParams]);

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
    updateTabInUrl(value);
  }, [updateTabInUrl]);

  const handleManageEvents = useCallback((campaign: Campaign) => {
    setCurrentCampaignId(campaign.id);
    handleTabChange("events");
  }, [handleTabChange]);

  const handleBackToCampaigns = useCallback(() => {
    handleTabChange("campaigns");
    setCurrentCampaignId(undefined);
  }, [handleTabChange]);

  return {
    activeTab,
    currentCampaignId,
    handleTabChange,
    handleManageEvents,
    handleBackToCampaigns,
    setCurrentCampaignId
  };
}; 