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
import { CalendarIcon, ImagePlus, Loader2, X } from "lucide-react"
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
import Image from "next/image"

// Validation schema for event
const eventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  date: z.date(),
  location: z.string().min(3, "Location must be at least 3 characters"),
  image: z.string().optional(),
  imageCaption: z.string().optional(),
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
  const [isUploading, setIsUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const isEdit = !!event

  // Initial form values
  const defaultValues: EventFormValues = {
    title: "",
    description: "",
    date: new Date(),
    location: "",
    image: "",
    imageCaption: "",
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
        image: event.image || "",
        imageCaption: event.imageCaption || "",
      })
      setImagePreview(event.image || null)
    } else if (!event && open) {
      // If adding a new event, reset the form
      form.reset(defaultValues)
      setImagePreview(null)
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
        image: data.image,
        imageCaption: data.imageCaption,
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

  // Помощна функция за проверка дали URL е от Cloudinary
  const isCloudinaryUrl = (url: string) => {
    return url.includes('cloudinary.com');
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    
    try {
      // Създаваме FormData
      const formData = new FormData();
      formData.append('image', file);
      formData.append('folder', 'events');
      
      // Изпращаме заявката и чакаме резултата
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/upload`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.url) {
        // Актуализираме формата с URL-то на изображението
        form.setValue("image", data.url);
        setImagePreview(data.url);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = async () => {
    const imageUrl = form.getValues("image");
    
    if (!imageUrl) return;
    
    // Ако изображението е от Cloudinary, изпращаме заявка за изтриване
    if (isCloudinaryUrl(imageUrl)) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/images`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: imageUrl }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete image');
        }
      } catch (error) {
        console.error('Error deleting image:', error);
        toast.error("Failed to delete image from server, but will remove it locally.");
      }
    }
    
    // Изчистваме полето за изображение и прегледа
    form.setValue("image", "");
    setImagePreview(null);
  };

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

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image (optional)</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      {imagePreview ? (
                        <div>
                          <div className="relative w-full h-40 rounded-md overflow-hidden border border-gray-200">
                            <Image
                              src={imagePreview}
                              alt="Event image"
                              fill
                              className="object-cover"
                            />
                            <Button
                              type="button"
                              size="icon"
                              variant="destructive"
                              className="absolute top-2 right-2 h-8 w-8 rounded-full"
                              onClick={removeImage}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="mt-3">
                            <FormField
                              control={form.control}
                              name="imageCaption"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Image Caption (optional)</FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="Enter a caption for this image" 
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          {isUploading ? (
                            <div className="h-40 w-full border border-gray-200 rounded-md flex items-center justify-center">
                              <div className="flex flex-col items-center">
                                <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
                                <span className="text-sm text-gray-500 mt-2">Uploading...</span>
                              </div>
                            </div>
                          ) : (
                            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100">
                              <div className="flex flex-col items-center justify-center">
                                <ImagePlus className="w-8 h-8 text-gray-400" />
                                <p className="mt-2 text-sm text-gray-500">Click to upload an image</p>
                              </div>
                              <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={isUploading}
                              />
                              <input type="hidden" {...field} />
                            </label>
                          )}
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading || isUploading}>
              {isLoading
                ? "Saving..."
                : isUploading
                ? "Uploading image..."
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