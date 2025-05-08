"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CampaignForm } from "./create-campaign-form"
import { Campaign, CampaignInput } from "@/types/campaign"
import { useCampaigns } from "@/hooks/admin/useCampaigns"
import { toast } from "sonner"

interface CampaignDialogProps {
  campaign?: Campaign | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function CampaignDialog({
  campaign,
  open,
  onOpenChange,
  onSuccess,
}: CampaignDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { createCampaign, updateCampaign } = useCampaigns()

  const isEdit = !!campaign

  const handleSubmit = async (data: CampaignInput) => {
    setIsLoading(true)
    try {
      if (isEdit && campaign) {
        // Editing an existing campaign
        await updateCampaign({
          variables: {
            id: campaign.id,
            input: data,
          },
        })
        toast.success("Campaign updated successfully")
      } else {
        // Creating a new campaign
        await createCampaign({
          variables: {
            input: data,
          },
        })
        toast.success("Campaign created successfully")
      }
      onOpenChange(false)
      if (onSuccess) onSuccess()
    } catch (error) {
      console.error("Error saving campaign:", error)
      toast.error("An error occurred while saving the campaign")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Campaign" : "Create New Campaign"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Edit the campaign details below."
              : "Fill in the form below to create a new campaign."}
          </DialogDescription>
        </DialogHeader>
        <CampaignForm
          initialData={campaign}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  )
} 