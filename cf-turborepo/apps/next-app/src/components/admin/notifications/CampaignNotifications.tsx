import { useEffect, useState } from 'react';
import { useSubscription, useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { Bell } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CampaignNotification } from '@/graphql/generated/graphql';

const CAMPAIGN_PARTICIPANT_PENDING_SUBSCRIPTION = gql`
  subscription OnCampaignParticipantPending {
    campaignParticipantPending {
      id
      title
      pendingParticipants {
        _id
        name
        email
        role
      }
      pendingParticipantsCount
    }
  }
`;

const GET_CAMPAIGN_NOTIFICATIONS = gql`
  query GetCampaignNotifications {
    getCampaignNotifications {
      id
      title
      pendingParticipants {
        _id
        name
        email
        role
      }
      pendingParticipantsCount
    }
  }
`;

export const CampaignNotifications = () => {
  const [notifications, setNotifications] = useState<CampaignNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // Query for all current notifications
  const { data: initialData } = useQuery(GET_CAMPAIGN_NOTIFICATIONS);

  // Subscription for real-time notifications
  const { data } = useSubscription(CAMPAIGN_PARTICIPANT_PENDING_SUBSCRIPTION);

  // Load initial notifications on mount
  useEffect(() => {
    if (initialData?.getCampaignNotifications) {
      setNotifications(initialData.getCampaignNotifications);
      setUnreadCount(initialData.getCampaignNotifications.length);
    }
  }, [initialData]);

  // Add new notification from subscription
  useEffect(() => {
    if (data?.campaignParticipantPending) {
      const notification = data.campaignParticipantPending;
      setNotifications(prev => {
        // Replace if already exists, else add to top
        const filtered = prev.filter(n => n.id !== notification.id);
        return [notification, ...filtered];
      });
      setUnreadCount(prev => prev + 1);
      // Play notification sound
      const audio = new Audio('/sounds/notification.mp3');
      audio.volume = 0.5; // Set volume to 50%
      audio.play().catch(error => {
        console.error('Error playing notification sound:', error);
      });
    }
  }, [data]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setUnreadCount(0);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Campaign Notifications</h4>
            {notifications.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setNotifications([])}
              >
                Clear all
              </Button>
            )}
          </div>
          <ScrollArea className="h-[300px]">
            {notifications.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No notifications
              </p>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="p-3 rounded-lg border bg-card"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">{notification.title}</p>
                      <Badge variant="secondary">
                        {notification.pendingParticipantsCount} new
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      {notification.pendingParticipants.map((participant) => (
                        <div
                          key={participant._id}
                          className="text-sm text-muted-foreground"
                        >
                          {participant.name} ({participant.email})
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
}; 