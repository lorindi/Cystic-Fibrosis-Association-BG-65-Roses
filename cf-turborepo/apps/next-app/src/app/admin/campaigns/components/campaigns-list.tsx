"use client"

import { useState, useEffect } from "react"
import { DataTable } from "@/components/ui/data-table/data-table"
import { createColumns } from "@/components/ui/data-table/columns"
import { columns } from "../columns"
import { Campaign } from "@/types/campaign"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { CampaignDialog } from "./create-campaign-dialog"
import { DeleteCampaignDialog } from "./delete-campaign-dialog"
import { useCampaigns } from "@/hooks/admin/useCampaigns"

export interface CampaignsListProps {
  onCampaignSelect?: (campaignId: string | null) => void
}

export const CampaignsList = ({ onCampaignSelect }: CampaignsListProps) => {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [deletingCampaign, setDeletingCampaign] = useState<Campaign | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const { campaigns, loading, error, refetch } = useCampaigns({
    noLimit: true
  })

  useEffect(() => {
    const handleCampaignSelect = (event: CustomEvent) => {
      onCampaignSelect?.(event.detail);
    };

    window.addEventListener('campaign-select', handleCampaignSelect as EventListener);

    return () => {
      window.removeEventListener('campaign-select', handleCampaignSelect as EventListener);
    };
  }, [onCampaignSelect]);

  const handleEdit = (campaign: Campaign) => {
    setEditingCampaign(campaign)
  }
  
  const handleDelete = (campaign: Campaign) => {
    setDeletingCampaign(campaign)
    setDeleteDialogOpen(true)
  }

  const campaignActions = [
    {
      label: "Edit",
      onClick: (campaign: Campaign) => handleEdit(campaign),
    },
    {
      label: "Delete",
      onClick: (campaign: Campaign) => handleDelete(campaign),
      variant: "destructive" as const,
    }
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Campaigns</h2>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> New Campaign
        </Button>
      </div>

      <DataTable
        columns={columns}
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
            setEditingCampaign(null)
            setCreateDialogOpen(false)
          }
        }}
        onSuccess={() => {
          refetch()
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
  )
} 