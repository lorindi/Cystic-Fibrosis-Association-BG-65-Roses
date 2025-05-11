"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Campaign, CampaignInput } from "@/types/campaign"
import { Button } from "@/components/ui/button"
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
import { useState } from "react"
import { CalendarIcon, ImagePlus, X } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { enUS } from "date-fns/locale"
import Image from "next/image"

// Campaign validation schema
const campaignSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  goal: z.number().min(1, "Goal must be a positive number"),
  startDate: z.date(),
  endDate: z.date().optional().nullable(),
  images: z.array(z.string()).min(1, "At least one image is required"),
  imagesCaptions: z.array(z.string()).optional(),
})

export type CampaignFormValues = z.infer<typeof campaignSchema>

interface CampaignFormProps {
  initialData?: Campaign | null
  onSubmit: (data: CampaignInput) => void
  isLoading?: boolean
}

export function CampaignForm({
  initialData,
  onSubmit,
  isLoading = false,
}: CampaignFormProps) {
  // Convert initial data to the correct format for the form
  const defaultValues: Partial<CampaignFormValues> = initialData
    ? {
        title: initialData.title,
        description: initialData.description,
        goal: initialData.goal,
        startDate: new Date(initialData.startDate),
        endDate: initialData.endDate ? new Date(initialData.endDate) : null,
        images: initialData.images || [],
        imagesCaptions: initialData.imagesCaptions || [],
      }
    : {
        title: "",
        description: "",
        goal: 0,
        startDate: new Date(),
        endDate: null,
        images: [],
        imagesCaptions: [],
      }

  const [imagePreviews, setImagePreviews] = useState<string[]>(
    initialData?.images || []
  )

  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignSchema),
    defaultValues,
  })

  function handleSubmit(data: CampaignFormValues) {
    // Convert form data to the expected API format
    const formattedData: CampaignInput = {
      ...data,
      startDate: data.startDate.toISOString(),
      endDate: data.endDate ? data.endDate.toISOString() : null,
      images: data.images,
      imagesCaptions: data.imagesCaptions,
      // Events are not added/edited in this form, so we don't include them
    }
    
    onSubmit(formattedData)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Handle file upload to your server/storage here
    // This is a placeholder for the actual image upload implementation
    // You would typically upload the image to your server and get back URLs
    
    const newImageUrls: string[] = [];
    const currentImages = form.getValues("images") || [];
    
    // Simulate upload and getting image URLs
    Array.from(files).forEach(file => {
      const fileUrl = URL.createObjectURL(file);
      newImageUrls.push(fileUrl);
    });
    
    const updatedImages = [...currentImages, ...newImageUrls];
    
    // Update form values
    form.setValue("images", updatedImages);
    setImagePreviews(updatedImages);
    
    // Trigger validation
    form.trigger("images");
  };

  const removeImage = (index: number) => {
    const currentImages = [...form.getValues("images")];
    currentImages.splice(index, 1);
    form.setValue("images", currentImages);
    setImagePreviews([...currentImages]);
    
    // Trigger validation
    form.trigger("images");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
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
                <Textarea
                  {...field}
                  rows={5}
                  className="resize-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="goal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Goal (BGN)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={e => {
                    const value = e.target.value;
                    // If the value is empty, set to 0, otherwise convert to number
                    field.onChange(value === "" ? 0 : parseFloat(value) || 0);
                  }}
                  value={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
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
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date (optional)</FormLabel>
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
                      selected={field.value || undefined}
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
        </div>

        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Images (required)</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-4 mt-2">
                    {imagePreviews.map((url, index) => (
                      <div key={index} className="relative group">
                        <div className="h-24 w-24 rounded-md overflow-hidden border border-gray-200">
                          <Image
                            src={url}
                            alt={`Campaign image ${index + 1}`}
                            width={96}
                            height={96}
                            className="object-cover h-full w-full"
                          />
                        </div>
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                    
                    <label className="h-24 w-24 rounded-md border border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col items-center">
                        <ImagePlus className="h-8 w-8 text-gray-400" />
                        <span className="text-xs text-gray-500 mt-1">Add image</span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                        multiple
                      />
                    </label>
                  </div>
                  {form.formState.errors.images && (
                    <p className="text-sm font-medium text-destructive">
                      {form.formState.errors.images.message}
                    </p>
                  )}
                  <p className="text-sm text-gray-500">
                    Upload up to 10 images for your campaign. First image will be used as the main thumbnail.
                  </p>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {initialData ? (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-blue-700 text-sm">
              <strong>Note:</strong> Campaign events can only be managed through the campaign detail page after the campaign is created.
            </p>
          </div>
        ) : null}

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Campaign"}
        </Button>
      </form>
    </Form>
  )
} 