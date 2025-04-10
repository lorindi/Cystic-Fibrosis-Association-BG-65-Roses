import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: ReactNode;
  isLoading?: boolean;
}

export function StatCard({ 
  title, 
  value, 
  description, 
  icon, 
  isLoading = false 
}: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value}
        </div>
        <p className="text-xs text-muted-foreground">
          {isLoading ? 'Loading...' : description}
        </p>
      </CardContent>
    </Card>
  );
} 