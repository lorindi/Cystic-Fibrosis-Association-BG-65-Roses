'use client';

import { useState } from 'react';
import { useCampaigns } from '@/hooks/admin/useCampaigns';
import { DataTable } from "@/components/ui/data-table/data-table";
import { createColumns } from "@/components/ui/data-table/columns";
import { columns } from './columns';
import { Campaign } from "@/types/campaign";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CampaignDialog } from './components/create-campaign-dialog';
import { DeleteCampaignDialog } from './components/delete-campaign-dialog';
import { CampaignParticipants } from '@/components/admin/campaigns/CampaignParticipants';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CampaignsList } from './components/campaigns-list';
import { CampaignParticipantsList } from '@/components/admin/campaigns/CampaignParticipantsList';

export default function CampaignsPage() {
  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Campaign data
  const { campaigns, loading, error, refetch } = useCampaigns({
    noLimit: false
  });

  // Campaign dialog state
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [deletingCampaign, setDeletingCampaign] = useState<Campaign | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);

  // Handle edit and delete actions
  const handleEdit = (campaign: Campaign) => {
    setEditingCampaign(campaign);
  };
  
  const handleDelete = (campaign: Campaign) => {
    setDeletingCampaign(campaign);
    setDeleteDialogOpen(true);
  };

  const campaignActions = [
    {
      label: "Edit",
      onClick: (campaign: Campaign) => handleEdit(campaign),
    },
    {
      label: "Delete",
      onClick: (campaign: Campaign) => handleDelete(campaign),
      variant: "destructive" as const,
    },
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Campaign Management</h1>
      
      <Tabs defaultValue="campaigns" className="space-y-4">
        <TabsList>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="participants">Participants</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns">
          <CampaignsList />
        </TabsContent>

        <TabsContent value="participants">
          <CampaignParticipants />
        </TabsContent>
      </Tabs>
    </div>
  );
} 