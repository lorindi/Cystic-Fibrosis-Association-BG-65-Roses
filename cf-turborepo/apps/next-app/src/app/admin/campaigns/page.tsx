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
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Campaign Management</h1>
      
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Campaigns</h2>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> New Campaign
          </Button>
        </div>

        <DataTable
          columns={createColumns(columns)}
          data={campaigns}
          searchKey="title"
          actions={campaignActions}
          pagination={{
            page,
            pageSize,
            onPageChange: setPage,
            onPageSizeChange: setPageSize,
          }}
        />

        {/* Campaign create/edit dialog */}
        <CampaignDialog
          campaign={editingCampaign}
          open={createDialogOpen || !!editingCampaign}
          onOpenChange={(open) => {
            if (!open) {
              setEditingCampaign(null);
              setCreateDialogOpen(false);
            }
          }}
          onSuccess={() => {
            refetch();
          }}
        />

        {/* Delete confirmation dialog */}
        <DeleteCampaignDialog
          campaign={deletingCampaign}
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onSuccess={refetch}
        />
      </div>
    </div>
  );
} 