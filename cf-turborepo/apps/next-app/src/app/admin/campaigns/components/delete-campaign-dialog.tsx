"use client"

import { Campaign } from "@/types/campaign"
import { useCampaigns } from "@/hooks/admin/useCampaigns"
import { toast } from "sonner"
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog"

interface DeleteCampaignDialogProps {
  campaign: Campaign | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function DeleteCampaignDialog({
  campaign,
  open,
  onOpenChange,
  onSuccess,
}: DeleteCampaignDialogProps) {
  const { deleteCampaign } = useCampaigns()

  const handleDelete = async () => {
    if (!campaign) return

    try {
      await deleteCampaign({
        variables: {
          id: campaign.id
        }
      })
      toast.success("Campaign deleted successfully")
      onOpenChange(false)
      if (onSuccess) onSuccess()
    } catch (error) {
      console.error("Error deleting campaign:", error)
      toast.error("An error occurred while deleting the campaign")
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will delete the campaign
            "{campaign?.title}" and all its data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete} 
            className="bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
} 