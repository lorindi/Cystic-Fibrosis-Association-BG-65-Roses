"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { Campaign } from "@/types/campaign";

const campaignFormSchema = z.object({
  title: z.string().min(1, "Заглавието е задължително"),
  description: z.string().min(1, "Описанието е задължително"),
  goal: z.number().min(0, "Целта трябва да бъде положително число"),
  startDate: z.string().min(1, "Началната дата е задължителна"),
  endDate: z.string().min(1, "Крайната дата е задължителна"),
});

type CampaignFormValues = z.infer<typeof campaignFormSchema>;

interface CampaignFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign?: Campaign;
  onSubmit: (data: CampaignFormValues) => void;
}

export function CampaignFormModal({
  open,
  onOpenChange,
  campaign,
  onSubmit,
}: CampaignFormModalProps) {
  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues: {
      title: campaign?.title || "",
      description: campaign?.description || "",
      goal: campaign?.goal || 0,
      startDate: campaign?.startDate
        ? new Date(campaign.startDate).toISOString().split("T")[0]
        : "",
      endDate: campaign?.endDate
        ? new Date(campaign.endDate).toISOString().split("T")[0]
        : "",
    },
  });

  // Актуализиране на стойностите на формата при промяна на campaign пропъртито
  React.useEffect(() => {
    if (campaign) {
      // Ресетваме формата със стойностите от campaign обекта
      form.reset({
        title: campaign.title || "",
        description: campaign.description || "",
        goal: campaign.goal || 0,
        startDate: campaign.startDate
          ? new Date(campaign.startDate).toISOString().split("T")[0]
          : "",
        endDate: campaign.endDate
          ? new Date(campaign.endDate).toISOString().split("T")[0]
          : "",
      });
    } else {
      // Ако няма campaign, ресетваме към празни стойности
      form.reset({
        title: "",
        description: "",
        goal: 0,
        startDate: "",
        endDate: "",
      });
    }
  }, [campaign, form]);

  // Функция за форматиране на датите при изпращане
  const handleSubmit = (values: CampaignFormValues) => {
    // Копираме стойностите, за да не променяме директно входните данни
    const formattedValues = { ...values };
    
    // Конвертираме дата стринговете към ISO формат
    if (formattedValues.startDate) {
      const startDate = new Date(formattedValues.startDate);
      startDate.setHours(0, 0, 0, 0);
      formattedValues.startDate = startDate.toISOString();
    }
    
    if (formattedValues.endDate) {
      const endDate = new Date(formattedValues.endDate);
      endDate.setHours(23, 59, 59, 999);
      formattedValues.endDate = endDate.toISOString();
    }
    
    onSubmit(formattedValues);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {campaign ? "Редактиране на кампания" : "Създаване на кампания"}
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
                    <Input placeholder="Заглавие на кампанията" {...field} />
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
                      placeholder="Описание на кампанията"
                      className="resize-none"
                      {...field}
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
                  <FormLabel>Цел (сума)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
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
                  <FormItem>
                    <FormLabel>Начална дата</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Крайна дата</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Отказ
              </Button>
              <Button type="submit">
                {campaign ? "Обнови" : "Създай"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 