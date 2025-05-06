'use client';

import { useState } from 'react';
import { useCampaign } from '@/hooks/admin/useCampaigns';
import { useParams } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, Trash2, Edit } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { CampaignEvent, CampaignEventInput } from '@/types/campaign';
import { DataTable } from '@/components/ui/data-table/data-table';
import { createColumns } from '@/components/ui/data-table/columns';
import { DataTableColumn } from '@/components/ui/data-table/columns';
import { useCampaignEvents } from '@/hooks/admin/useCampaignEvents';
import { CampaignEventDialog } from './components/campaign-event-dialog';
import { DeleteEventDialog } from './components/delete-event-dialog';

// Extended CampaignEvent type with additional field for actions
type CampaignEventWithActions = CampaignEvent & {
  actions?: string // This field is not used, but is necessary for typing
}

export default function CampaignDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  
  const { campaign, loading, error, refetch } = useCampaign(id);
  const { saveEvent, deleteEvent } = useCampaignEvents();

  const [addEventOpen, setAddEventOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CampaignEvent | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<CampaignEvent | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!campaign) return <div>Campaign not found</div>;

  // Event handlers
  const handleEditEvent = (event: CampaignEvent) => {
    setEditingEvent(event);
  };
  
  const handleDeleteEvent = (event: CampaignEvent) => {
    setDeletingEvent(event);
    setDeleteDialogOpen(true);
  };

  const handleSubmitEvent = async (campaignId: string, eventData: CampaignEventInput, eventId?: string) => {
    try {
      await saveEvent(campaignId, eventData, eventId);
      refetch();
    } catch (error) {
      throw error;
    }
  };

  const handleDeleteEventConfirm = async (campaignId: string, eventId: string) => {
    try {
      await deleteEvent(campaignId, eventId);
      refetch();
    } catch (error) {
      throw error;
    }
  };

  // Add empty 'actions' field to events to match the type
  const eventsWithActions: CampaignEventWithActions[] = campaign.events.map(event => ({
    ...event,
    actions: ''
  }));

  // Define columns for the events table
  const eventColumns: DataTableColumn<CampaignEventWithActions>[] = [
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => {
        const description = row.original.description;
        return description.length > 100 
          ? `${description.substring(0, 100)}...`
          : description;
      }
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => format(new Date(row.original.date), "dd.MM.yyyy"),
    },
    {
      accessorKey: "location",
      header: "Location",
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => handleEditEvent(row.original)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleDeleteEvent(row.original)}>
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto py-10">
      <Link href="/admin/campaigns">
        <Button variant="outline" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to campaigns
        </Button>
      </Link>
      
      <div className="flex justify-between items-start mb-4">
        <h1 className="text-2xl font-bold">{campaign.title}</h1>
        <div className="bg-muted p-2 rounded-md">
          <p className="text-sm font-medium">Campaign progress</p>
          <div className="flex items-center gap-4 mt-1">
            <span className="text-lg font-bold">{Math.round((campaign.currentAmount / campaign.goal) * 100)}%</span>
            <div>
              <span className="text-sm">{campaign.currentAmount.toLocaleString()} BGN / {campaign.goal.toLocaleString()} BGN</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-card p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Start date</h3>
          <p className="text-base font-medium">{format(new Date(campaign.startDate), 'PPP', { locale: enUS })}</p>
        </div>
        
        <div className="bg-card p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">End date</h3>
          <p className="text-base font-medium">
            {campaign.endDate ? format(new Date(campaign.endDate), 'PPP', { locale: enUS }) : 'No end date'}
          </p>
        </div>
        
        <div className="bg-card p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Participants</h3>
          <p className="text-base font-medium">
            {campaign.participantsCount} approved / {campaign.pendingParticipantsCount} pending
          </p>
        </div>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Description</h2>
        <p className="whitespace-pre-wrap">{campaign.description}</p>
      </div>
      
      <Separator className="my-6" />
      
      {/* Events section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Campaign events</h2>
          <Button variant="outline" onClick={() => setAddEventOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add event
          </Button>
        </div>

        <DataTable
          columns={createColumns(eventColumns)}
          data={eventsWithActions}
        />

        {/* Dialog for adding/editing an event */}
        <CampaignEventDialog
          campaignId={campaign.id}
          event={editingEvent}
          open={addEventOpen || !!editingEvent}
          onOpenChange={(open) => {
            if (!open) {
              setEditingEvent(null);
              setAddEventOpen(false);
            }
          }}
          onSuccess={refetch}
          onSubmit={handleSubmitEvent}
        />

        {/* Dialog for deleting an event */}
        <DeleteEventDialog
          campaignId={campaign.id}
          event={deletingEvent}
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onDelete={handleDeleteEventConfirm}
          onSuccess={refetch}
        />
      </div>
    </div>
  );
} 