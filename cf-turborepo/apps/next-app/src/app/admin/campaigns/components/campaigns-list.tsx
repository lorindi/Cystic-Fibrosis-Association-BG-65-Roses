"use client"

import { useState } from "react"
import { DataTable } from "@/components/ui/data-table/data-table"
import { createColumns } from "@/components/ui/data-table/columns"
import { columns } from "../columns"
import { Campaign } from "@/types/campaign"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { CampaignDialog } from "./create-campaign-dialog"
import { DeleteCampaignDialog } from "./delete-campaign-dialog"
import { useCampaigns } from "@/hooks/admin/useCampaigns"

interface CampaignsListProps {
  campaigns: Campaign[]
  onRefresh: () => void
  pagination?: {
    page: number
    pageSize: number
    onPageChange: (page: number) => void
    onPageSizeChange: (pageSize: number) => void
  }
}

export function CampaignsList({ campaigns, onRefresh, pagination }: CampaignsListProps) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null)
  const [deletingCampaign, setDeletingCampaign] = useState<Campaign | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

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
    },
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
        columns={createColumns(columns)}
        data={campaigns}
        searchKey="title"
        actions={campaignActions}
        pagination={pagination}
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
          onRefresh()
        }}
      />

      {/* Delete confirmation dialog */}
      <DeleteCampaignDialog
        campaign={deletingCampaign}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onSuccess={onRefresh}
      />
    </div>
  )
} 