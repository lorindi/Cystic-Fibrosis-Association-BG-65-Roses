"use client"

import { CampaignEvent } from "@/types/campaign"
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

interface DeleteEventDialogProps {
  campaignId: string
  event: CampaignEvent | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onDelete: (campaignId: string, eventId: string) => Promise<void>
  onSuccess?: () => void
}

export function DeleteEventDialog({
  campaignId,
  event,
  open,
  onOpenChange,
  onDelete,
  onSuccess,
}: DeleteEventDialogProps) {
  const handleDelete = async () => {
    if (!event) return

    try {
      await onDelete(campaignId, event.id)
      toast.success("Event deleted successfully")
      onOpenChange(false)
      if (onSuccess) onSuccess()
    } catch (error) {
      console.error("Error deleting event:", error)
      toast.error("An error occurred while deleting the event")
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will delete the event
            "{event?.title}" from this campaign.
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