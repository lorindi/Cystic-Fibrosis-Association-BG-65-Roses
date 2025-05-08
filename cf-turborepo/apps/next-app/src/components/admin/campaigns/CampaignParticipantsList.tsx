import { useCampaign } from '@/hooks/admin/useCampaigns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CampaignParticipantsListProps {
  campaignId: string;
}

export const CampaignParticipantsList = ({ campaignId }: CampaignParticipantsListProps) => {
  const { campaign, loading, error } = useCampaign(campaignId);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Error loading campaign participants: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (!campaign) {
    return (
      <Alert>
        <AlertDescription>
          Campaign not found.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{campaign.title} - Participants</h2>
      
      <Tabs defaultValue="approved" className="space-y-4">
        <TabsList>
          <TabsTrigger value="approved">
            Approved ({campaign.participantsCount})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({campaign.pendingParticipantsCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="approved">
          <Card>
            <CardHeader>
              <CardTitle>Approved Participants</CardTitle>
            </CardHeader>
            <CardContent>
              {campaign.participants.length === 0 ? (
                <Alert>
                  <AlertDescription>
                    No approved participants yet.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  {campaign.participants.map((participant) => (
                    <div
                      key={participant._id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{participant.name}</p>
                        <p className="text-sm text-gray-500">{participant.email}</p>
                        <Badge variant="outline">{participant.role}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Participants</CardTitle>
            </CardHeader>
            <CardContent>
              {campaign.pendingParticipants.length === 0 ? (
                <Alert>
                  <AlertDescription>
                    No pending participants.
                  </AlertDescription>
                </Alert>
              ) : (
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
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}; 