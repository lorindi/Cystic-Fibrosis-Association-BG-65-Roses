"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const eventFormSchema = z.object({
  title: z.string().min(3, {
    message: "Заглавието трябва да бъде поне 3 символа.",
  }),
  description: z.string().min(10, {
    message: "Описанието трябва да бъде поне 10 символа.",
  }),
  date: z.string().min(1, {
    message: "Датата е задължителна.",
  }),
  location: z.string().min(3, {
    message: "Местоположението трябва да бъде поне 3 символа.",
  }),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

interface CampaignEventFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: any;
  onSubmit: (values: EventFormValues) => void;
}

export function CampaignEventFormModal({
  open,
  onOpenChange,
  event,
  onSubmit,
}: CampaignEventFormModalProps) {
  // Референция за предишното състояние на модала
  const prevOpenRef = React.useRef(open);
  
  // Форматира дата до YYYY-MM-DD формат за input тип date
  const formatDateForInput = (dateStr: string | undefined): string => {
    if (!dateStr) return new Date().toISOString().split("T")[0];
    
    try {
      const date = new Date(dateStr);
      // Проверка дали датата е валидна
      if (isNaN(date.getTime())) {
        console.error("Invalid date:", dateStr);
        return new Date().toISOString().split("T")[0];
      }
      return date.toISOString().split("T")[0];
    } catch (e) {
      console.error("Error parsing date:", e);
      return new Date().toISOString().split("T")[0];
    }
  };

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      location: "",
    },
  });

  // useEffect за актуализиране на формата при промяна на event пропъртито
  React.useEffect(() => {
    // Проверяваме дали модала се отваря (за да избегнем ненужно ресетване)
    const isOpening = open && !prevOpenRef.current;
    prevOpenRef.current = open;
    
    if (open) {
      console.log("Modal opened with event:", event);
      
      if (event) {
        // Логваме данните, за да видим какви са
        console.log("Event data:", {
          title: event.title,
          description: event.description,
          date: event.date,
          formattedDate: formatDateForInput(event.date),
          location: event.location
        });
        
        // Ресетваме формата със стойностите от event обекта
        form.reset({
          title: event.title || "",
          description: event.description || "",
          date: formatDateForInput(event.date),
          location: event.location || "",
        });
      } else if (isOpening) {
        // Ако няма event и модалът се отваря, ресетваме към празни стойности
        form.reset({
          title: "",
          description: "",
          date: new Date().toISOString().split("T")[0],
          location: "",
        });
      }
    }
  }, [event, form, open]); // Запазваме масива от зависимости константен

  const handleSubmit = (values: EventFormValues) => {
    // Convert date string to ISO string with time
    const date = new Date(values.date);
    date.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues
    
    const formattedValues = {
      ...values,
      date: date.toISOString(),
    };
    
    console.log("Submitting values:", formattedValues);
    onSubmit(formattedValues);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {event ? "Редактиране на събитие" : "Добавяне на ново събитие"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Заглавие</FormLabel>
                  <FormControl>
                    <Input placeholder="Заглавие на събитието" {...field} />
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
                  <FormLabel>Описание</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Описание на събитието"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Дата</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Местоположение</FormLabel>
                  <FormControl>
                    <Input placeholder="Местоположение на събитието" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Отказ
              </Button>
              <Button type="submit">
                {event ? "Обнови" : "Създай"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 