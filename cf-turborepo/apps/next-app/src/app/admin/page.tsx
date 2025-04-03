'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AdminDashboard() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
          <CardDescription>Welcome to your admin dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Your main dashboard content goes here</p>
        </CardContent>
        <CardFooter>
          <Button>View Details</Button>
        </CardFooter>
      </Card>
    </div>
  );
}