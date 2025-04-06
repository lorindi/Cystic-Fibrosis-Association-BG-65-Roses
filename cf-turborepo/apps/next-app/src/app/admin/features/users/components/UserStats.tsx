import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users as UsersIcon } from "lucide-react";

interface UserStatsProps {
  totalUsers: number;
  patientCount: number;
  parentCount: number;
  donorCount: number;
  getPercentage: (count: number) => number;
}

export const UserStats: React.FC<UserStatsProps> = ({
  totalUsers,
  patientCount,
  parentCount,
  donorCount,
  getPercentage
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="flex justify-center">
              <div className="p-3 rounded-full bg-primary/10">
                <UsersIcon className="h-6 w-6 text-primary" />
              </div>
            </div>
            <h3 className="mt-3 text-xl font-semibold">Total Users</h3>
            <p className="text-3xl font-bold mt-1">{totalUsers}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="flex justify-center">
              <div className="p-3 rounded-full bg-blue-100">
                <UsersIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <h3 className="mt-3 text-xl font-semibold">Patients</h3>
            <p className="text-3xl font-bold mt-1">{patientCount}</p>
            <p className="text-xs text-muted-foreground mt-1">{getPercentage(patientCount)}% of all users</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="flex justify-center">
              <div className="p-3 rounded-full bg-purple-100">
                <UsersIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <h3 className="mt-3 text-xl font-semibold">Parents</h3>
            <p className="text-3xl font-bold mt-1">{parentCount}</p>
            <p className="text-xs text-muted-foreground mt-1">{getPercentage(parentCount)}% of all users</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="flex justify-center">
              <div className="p-3 rounded-full bg-amber-100">
                <UsersIcon className="h-6 w-6 text-amber-600" />
              </div>
            </div>
            <h3 className="mt-3 text-xl font-semibold">Donors</h3>
            <p className="text-3xl font-bold mt-1">{donorCount}</p>
            <p className="text-xs text-muted-foreground mt-1">{getPercentage(donorCount)}% of all users</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 