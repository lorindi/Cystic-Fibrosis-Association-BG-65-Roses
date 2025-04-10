"use client";

import * as React from "react";
import { useQuery, useSubscription } from "@apollo/client";
import { Bell } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  GET_CAMPAIGN_NOTIFICATIONS,
  CAMPAIGN_PARTICIPANT_PENDING_SUBSCRIPTION 
} from "../../../graphql/campaigns";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

export function CampaignNotificationsIndicator() {
  const router = useRouter();
  const [notifications, setNotifications] = React.useState<any[]>([]);
  const [hasNewNotifications, setHasNewNotifications] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  // Get initial notifications
  const { data, loading, error } = useQuery(GET_CAMPAIGN_NOTIFICATIONS, {
    onCompleted: (data) => {
      if (data?.getCampaignNotifications) {
        setNotifications(data.getCampaignNotifications);
        setHasNewNotifications(data.getCampaignNotifications.length > 0);
      }
    },
    fetchPolicy: "network-only",
  });

  // Subscribe to new notifications
  const { data: subscriptionData } = useSubscription(CAMPAIGN_PARTICIPANT_PENDING_SUBSCRIPTION, {
    onData: ({ data }) => {
      if (data?.data?.campaignParticipantPending) {
        const newNotification = data.data.campaignParticipantPending;
        
        // Check if this notification already exists
        const existingIndex = notifications.findIndex(n => n.id === newNotification.id);
        
        if (existingIndex >= 0) {
          // Update existing notification
          const updatedNotifications = [...notifications];
          updatedNotifications[existingIndex] = {
            ...updatedNotifications[existingIndex],
            pendingParticipantsCount: newNotification.pendingParticipantsCount,
            pendingParticipants: newNotification.pendingParticipants,
            timestamp: new Date().toISOString(),
          };
          setNotifications(updatedNotifications);
        } else {
          // Add new notification
          setNotifications(prev => [
            {
              ...newNotification,
              timestamp: new Date().toISOString(),
            },
            ...prev,
          ]);
        }
        
        setHasNewNotifications(true);
      }
    },
  });

  // Mark as read when opening popover
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setHasNewNotifications(false);
    }
  };

  // Navigate to pending tab when clicking on a notification
  const handleNotificationClick = () => {
    router.push("/admin/campaigns?tab=pending");
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {hasNewNotifications && (
            <span className="absolute top-0 right-0 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 max-h-[400px] overflow-y-auto p-0">
        <div className="p-4 font-medium">Campaign Notifications</div>
        <Separator />
        
        {loading ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Loading notifications...
          </div>
        ) : notifications.length > 0 ? (
          <div>
            {notifications.map((notification, index) => (
              <div 
                key={`${notification.id}-${index}`}
                className="p-4 hover:bg-muted cursor-pointer"
                onClick={handleNotificationClick}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium">{notification.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {notification.pendingParticipantsCount} pending {notification.pendingParticipantsCount === 1 ? 'participant' : 'participants'}
                    </div>
                    {notification.timestamp && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                      </div>
                    )}
                  </div>
                  <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                    {notification.pendingParticipantsCount}
                  </Badge>
                </div>
                {notification.pendingParticipants && notification.pendingParticipants.length > 0 && (
                  <div className="mt-2">
                    <div className="text-xs font-medium">Recent requests:</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {notification.pendingParticipants.slice(0, 3).map((p: any) => (
                        <Badge 
                          key={p._id} 
                          variant="outline" 
                          className="text-xs"
                        >
                          {p.name}
                        </Badge>
                      ))}
                      {notification.pendingParticipants.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{notification.pendingParticipants.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No new notifications
          </div>
        )}
        {notifications.length > 0 && (
          <div className="p-2 border-t">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs"
              onClick={handleNotificationClick}
            >
              View all pending requests
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
} 