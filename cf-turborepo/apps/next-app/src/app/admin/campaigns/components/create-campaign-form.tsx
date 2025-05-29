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
import { CalendarIcon, Edit2, ImagePlus, Loader2, X } from "lucide-react"
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

// Campaign validation schema
const campaignSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  goal: z.number().min(1, "Goal must be a positive number"),
  startDate: z.date(),
  endDate: z.date().optional().nullable(),
  images: z.array(z.string()).optional(),
  imagesCaptions: z.array(z.string()).optional(),
})

// Define the type from the schema
type CampaignFormValues = z.infer<typeof campaignSchema>

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
  // Create initial values
  const defaultValues: CampaignFormValues = {
    title: initialData?.title || "",
    description: initialData?.description || "",
    goal: initialData?.goal || 0,
    startDate: initialData ? new Date(initialData.startDate) : new Date(),
    endDate: initialData?.endDate ? new Date(initialData.endDate) : null,
    images: initialData?.images || [],
    imagesCaptions: initialData?.imagesCaptions || [],
  };

  const [imagePreviews, setImagePreviews] = useState<string[]>(
    initialData?.images || []
  )
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [captionDialogOpen, setCaptionDialogOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(-1)
  const [currentCaption, setCurrentCaption] = useState("")

  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignSchema),
    defaultValues,
  })

  // Помощна функция за проверка дали URL е от Cloudinary
  const isCloudinaryUrl = (url: string) => {
    return url.includes('cloudinary.com');
  }

  function handleSubmit(data: CampaignFormValues) {
    // Convert form data to the expected API format
    const formattedData: CampaignInput = {
      ...data,
      startDate: data.startDate.toISOString(),
      endDate: data.endDate ? data.endDate.toISOString() : null,
      images: data.images || [],
      imagesCaptions: data.imagesCaptions || [],
    }
    
    onSubmit(formattedData)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    // Текущи изображения
    const currentImages = [...(form.getValues("images") || [])];
    const currentPreviews = [...imagePreviews];
    const currentCaptions = [...(form.getValues("imagesCaptions") || [])];
    
    try {
      // Качваме всички файлове последователно
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Изчисляваме прогреса
        const progressPerImage = 100 / files.length;
        setUploadProgress((i * progressPerImage) + (progressPerImage / 2));
        
        // Създаваме FormData
        const formData = new FormData();
        formData.append('image', file);
        formData.append('folder', 'campaigns');
        
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
          // Добавяме новото URL към изображенията
          currentImages.push(data.url);
          currentPreviews.push(data.url);
          // Добавяме празно заглавие за новото изображение
          currentCaptions.push("");
        }
      }
      
      // Актуализираме формата с всички успешно качени изображения
      form.setValue("images", currentImages);
      form.setValue("imagesCaptions", currentCaptions);
      setImagePreviews(currentPreviews);
      
      // Ако сме качили поне едно ново изображение, отваряме диалога за въвеждане на заглавие
      // за последното качено изображение
      if (currentImages.length > 0) {
        const newImageIndex = currentImages.length - 1;
        setSelectedImageIndex(newImageIndex);
        setCurrentCaption("");
        setCaptionDialogOpen(true);
      }
      
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Възникна грешка при качването на изображенията. Моля, опитайте отново.");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const removeImage = async (index: number) => {
    const currentImages = [...(form.getValues("images") || [])];
    const imageUrl = currentImages[index];
    const currentCaptions = [...(form.getValues("imagesCaptions") || [])];
    
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
        alert("Възникна грешка при изтриването на изображението. Изображението ще бъде премахнато локално.");
      }
    }
    
    // Премахваме изображението от масива
    currentImages.splice(index, 1);
    // Премахваме и съответното заглавие
    currentCaptions.splice(index, 1);
    
    form.setValue("images", currentImages);
    form.setValue("imagesCaptions", currentCaptions);
    setImagePreviews([...currentImages]);
  };

  const openCaptionDialog = (index: number) => {
    const captions = form.getValues("imagesCaptions") || [];
    setCurrentCaption(captions[index] || "");
    setSelectedImageIndex(index);
    setCaptionDialogOpen(true);
  };

  const saveCaption = () => {
    if (selectedImageIndex >= 0) {
      const currentCaptions = [...(form.getValues("imagesCaptions") || [])];
      currentCaptions[selectedImageIndex] = currentCaption;
      form.setValue("imagesCaptions", currentCaptions);
      setCaptionDialogOpen(false);
    }
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
              <FormLabel>Images (optional)</FormLabel>
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
                        <div className="absolute -top-2 -right-2 flex space-x-1">
                          <Button
                            type="button"
                            size="icon"
                            variant="secondary"
                            className="h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => openCaptionDialog(index)}
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            variant="destructive"
                            className="h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeImage(index)}
                            disabled={isUploading}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        {(form.getValues("imagesCaptions") || [])[index] && (
                          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                            {(form.getValues("imagesCaptions") || [])[index]}
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {isUploading ? (
                      <div className="h-24 w-24 rounded-md border border-gray-300 flex items-center justify-center">
                        <div className="flex flex-col items-center">
                          <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
                          <span className="text-xs text-gray-500 mt-1">{uploadProgress.toFixed(0)}%</span>
                        </div>
                      </div>
                    ) : (
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
                          disabled={isUploading}
                        />
                      </label>
                    )}
                  </div>
                  {form.formState.errors.images && (
                    <p className="text-sm font-medium text-destructive">
                      {form.formState.errors.images.message}
                    </p>
                  )}
                  {form.formState.errors.imagesCaptions && (
                    <p className="text-sm font-medium text-destructive">
                      {form.formState.errors.imagesCaptions.message}
                    </p>
                  )}
                  <p className="text-sm text-gray-500">
                    Upload up to 13 images for your campaign. First image will be used as the main thumbnail. Captions are optional.
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

        <Button type="submit" disabled={isLoading || isUploading}>
          {isLoading ? "Saving..." : isUploading ? "Uploading Images..." : "Save Campaign"}
        </Button>
      </form>

      <Dialog open={captionDialogOpen} onOpenChange={setCaptionDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Image Caption</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedImageIndex >= 0 && imagePreviews[selectedImageIndex] && (
              <div className="flex justify-center">
                <div className="w-48 h-48 relative">
                  <Image
                    src={imagePreviews[selectedImageIndex]}
                    alt="Selected image"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            )}
            <div className="space-y-2">
              <FormLabel>Caption</FormLabel>
              <Input
                value={currentCaption}
                onChange={(e) => setCurrentCaption(e.target.value)}
                placeholder="Enter a caption for this image"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setCaptionDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={saveCaption}>
              Save Caption
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Form>
  )
} 