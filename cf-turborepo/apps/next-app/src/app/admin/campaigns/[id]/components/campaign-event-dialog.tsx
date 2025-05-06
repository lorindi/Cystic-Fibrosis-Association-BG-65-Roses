"use client"

import { useState, useEffect } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CampaignEvent, CampaignEventInput } from "@/types/campaign"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { enUS } from "date-fns/locale"
import { toast } from "sonner"

// Validation schema for event
const eventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  date: z.date(),
  location: z.string().min(3, "Location must be at least 3 characters"),
})

type EventFormValues = z.infer<typeof eventSchema>

interface CampaignEventDialogProps {
  campaignId: string
  event?: CampaignEvent | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  onSubmit: (campaignId: string, eventData: CampaignEventInput, eventId?: string) => Promise<void>
}

export function CampaignEventDialog({
  campaignId,
  event,
  open,
  onOpenChange,
  onSuccess,
  onSubmit
}: CampaignEventDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const isEdit = !!event

  // Initial form values
  const defaultValues: EventFormValues = {
    title: "",
    description: "",
    date: new Date(),
    location: "",
  }

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues,
  })

  // On event prop change or dialog opening, update the form
  useEffect(() => {
    // Check if there's an event to edit
    if (event && open) {
      console.log("Loading event data:", event)
      form.reset({
        title: event.title,
        description: event.description,
        date: new Date(event.date),
        location: event.location,
      })
    } else if (!event && open) {
      // If adding a new event, reset the form
      form.reset(defaultValues)
    }
  }, [event, open, form])

  async function handleSubmit(data: EventFormValues) {
    setIsLoading(true)
    try {
      // Convert data to expected format
      const eventData: CampaignEventInput = {
        title: data.title,
        description: data.description,
        date: data.date.toISOString(),
        location: data.location,
      }

      await onSubmit(campaignId, eventData, event?.id)
      
      toast.success(
        isEdit 
          ? "Event updated successfully" 
          : "Event added successfully"
      )
      
      onOpenChange(false)
      if (onSuccess) onSuccess()
    } catch (error) {
      console.error("Error saving event:", error)
      toast.error("An error occurred while saving the event")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit event" : "Add new event"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Edit the event information"
              : "Fill in the information for the new event"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: enUS })
                            ) : (
                              <span>Select a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          locale={enUS}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "Saving..."
                : isEdit
                ? "Save changes"
                : "Add event"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 