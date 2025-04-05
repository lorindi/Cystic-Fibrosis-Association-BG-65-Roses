"use client";

import * as React from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Campaign } from "@/types/campaign";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CampaignsTable } from "../features/campaigns/components/CampaignsTable";
import { CampaignFormModal } from "../features/campaigns/components/CampaignFormModal";
import {
  GET_CAMPAIGNS,
  CREATE_CAMPAIGN,
  UPDATE_CAMPAIGN,
  DELETE_CAMPAIGN,
} from "../graphql/campaigns";

export default function CampaignsContent() {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedCampaign, setSelectedCampaign] = React.useState<Campaign | undefined>();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [campaignToDelete, setCampaignToDelete] = React.useState<Campaign | undefined>();

  const { data, loading, error } = useQuery(GET_CAMPAIGNS);

  const [createCampaign] = useMutation(CREATE_CAMPAIGN, {
    refetchQueries: [{ query: GET_CAMPAIGNS }],
  });

  const [updateCampaign] = useMutation(UPDATE_CAMPAIGN, {
    refetchQueries: [{ query: GET_CAMPAIGNS }],
  });

  const [deleteCampaign] = useMutation(DELETE_CAMPAIGN, {
    refetchQueries: [{ query: GET_CAMPAIGNS }],
  });

  const handleCreateOrUpdate = async (formData: any) => {
    try {
      if (selectedCampaign) {
        await updateCampaign({
          variables: {
            id: selectedCampaign.id,
            ...formData,
          },
        });
        toast({
          title: "Успешно",
          description: "Кампанията беше обновена успешно",
        });
      } else {
        await createCampaign({
          variables: formData,
        });
        toast({
          title: "Успешно",
          description: "Кампанията беше създадена успешно",
        });
      }
      setIsModalOpen(false);
      setSelectedCampaign(undefined);
    } catch (error: any) {
      toast({
        title: "Грешка",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!campaignToDelete) return;

    try {
      await deleteCampaign({
        variables: {
          id: campaignToDelete.id,
        },
      });
      toast({
        title: "Успешно",
        description: "Кампанията беше изтрита успешно",
      });
      setIsDeleteDialogOpen(false);
      setCampaignToDelete(undefined);
    } catch (error: any) {
      toast({
        title: "Грешка",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) return <div>Зареждане...</div>;
  if (error) return <div>Грешка: {error.message}</div>;

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Кампании</h1>
        <Button
          onClick={() => {
            setSelectedCampaign(undefined);
            setIsModalOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Добави кампания
        </Button>
      </div>

      <CampaignsTable
        campaigns={data.getCampaigns}
        onEdit={(campaign) => {
          setSelectedCampaign(campaign);
          setIsModalOpen(true);
        }}
        onDelete={(campaign) => {
          setCampaignToDelete(campaign);
          setIsDeleteDialogOpen(true);
        }}
      />

      <CampaignFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        campaign={selectedCampaign}
        onSubmit={handleCreateOrUpdate}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Сигурни ли сте?</AlertDialogTitle>
            <AlertDialogDescription>
              Това действие не може да бъде отменено. Ще изтрие кампанията и всички свързани с нея данни.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отказ</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Изтрий</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 