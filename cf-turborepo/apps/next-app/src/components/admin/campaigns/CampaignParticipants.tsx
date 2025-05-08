import { useState } from 'react';
import { useCampaignParticipants } from '@/hooks/admin/useCampaignParticipants';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

export const CampaignParticipants = () => {
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const { 
    pendingCampaigns, 
    pendingLoading, 
    pendingError,
    approveParticipant,
    rejectParticipant,
    approveParticipantResult,
    rejectParticipantResult
  } = useCampaignParticipants();

  const handleApprove = async (campaignId: string, userId: string) => {
    try {
      await approveParticipant({
        variables: {
          campaignId,
          userId
        }
      });
    } catch (error) {
      console.error('Error approving participant:', error);
    }
  };

  const handleReject = async (campaignId: string, userId: string) => {
    try {
      await rejectParticipant({
        variables: {
          campaignId,
          userId
        }
      });
    } catch (error) {
      console.error('Error rejecting participant:', error);
    }
  };

  if (pendingLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (pendingError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Error loading pending participants: {pendingError.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Pending Campaign Participants</h2>
      
      {pendingCampaigns.length === 0 ? (
        <Alert>
          <AlertDescription>
            No pending campaign participants at the moment.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid gap-4">
          {pendingCampaigns.map((campaign) => (
            <Card key={campaign.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{campaign.title}</span>
                  <Badge variant="secondary">
                    {campaign.pendingParticipantsCount} pending
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campaign.pendingParticipants.map((participant) => (
                    <div
                      key={participant._id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{participant.name}</p>
                        <p className="text-sm text-gray-500">{participant.email}</p>
                        <Badge variant="outline">{participant.role}</Badge>
                      </div>
                      <div className="space-x-2">
                        <Button
                          variant="default"
                          onClick={() => handleApprove(campaign.id, participant._id)}
                          disabled={approveParticipantResult.loading}
                        >
                          {approveParticipantResult.loading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            'Approve'
                          )}
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleReject(campaign.id, participant._id)}
                          disabled={rejectParticipantResult.loading}
                        >
                          {rejectParticipantResult.loading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            'Reject'
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}; 