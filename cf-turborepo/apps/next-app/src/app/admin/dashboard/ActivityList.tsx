import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, HeartIcon } from "lucide-react";
import { RecentActivity } from "@/graphql/types";

interface ActivityListProps {
  activities: RecentActivity[];
}

export function ActivityList({ activities }: ActivityListProps) {
  if (!activities || activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest user and system activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-4 text-center text-muted-foreground">
            No recent activity to display
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest user and system activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <ActivityItem key={index} activity={activity} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface ActivityItemProps {
  activity: RecentActivity;
}

function ActivityItem({ activity }: ActivityItemProps) {
  return (
    <div className="flex items-center">
      <div className="mr-4 p-2 bg-primary/10 rounded-full">
        {activity.icon.type === 'calendar' ? (
          <CalendarIcon className={activity.icon.className} />
        ) : activity.icon.type === 'heart' ? (
          <HeartIcon className={activity.icon.className} />
        ) : null}
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium">{activity.title}</p>
        <p className="text-xs text-muted-foreground">{activity.description}</p>
      </div>
    </div>
  );
} 