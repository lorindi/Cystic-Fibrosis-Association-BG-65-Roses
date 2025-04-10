import React from "react";
import { Users as UsersIcon } from "lucide-react";

interface CompactUserStatsProps {
  totalUsers: number;
  patientCount: number;
  parentCount: number;
  donorCount: number;
  getPercentage: (count: number) => number;
}

export const CompactUserStats: React.FC<CompactUserStatsProps> = ({
  totalUsers,
  patientCount,
  parentCount,
  donorCount,
  getPercentage
}) => {
  return (
    <div className="flex flex-wrap gap-3 mb-4">
      <div className="flex items-center bg-muted/20 rounded-md px-2 py-1">
        <div className="p-1 rounded-full bg-primary/10 mr-2">
          <UsersIcon className="h-3 w-3 text-primary" />
        </div>
        <div className="text-xs">
          <span className="font-semibold mr-1">Total:</span>
          <span className="font-bold">{totalUsers}</span>
        </div>
      </div>
      
      <div className="flex items-center bg-muted/20 rounded-md px-2 py-1">
        <div className="p-1 rounded-full bg-blue-100 mr-2">
          <UsersIcon className="h-3 w-3 text-blue-600" />
        </div>
        <div className="text-xs">
          <span className="font-semibold mr-1">Patients:</span>
          <span className="font-bold">{patientCount}</span>
          <span className="text-muted-foreground ml-1">({getPercentage(patientCount)}%)</span>
        </div>
      </div>
      
      <div className="flex items-center bg-muted/20 rounded-md px-2 py-1">
        <div className="p-1 rounded-full bg-purple-100 mr-2">
          <UsersIcon className="h-3 w-3 text-purple-600" />
        </div>
        <div className="text-xs">
          <span className="font-semibold mr-1">Parents:</span>
          <span className="font-bold">{parentCount}</span>
          <span className="text-muted-foreground ml-1">({getPercentage(parentCount)}%)</span>
        </div>
      </div>
      
      <div className="flex items-center bg-muted/20 rounded-md px-2 py-1">
        <div className="p-1 rounded-full bg-amber-100 mr-2">
          <UsersIcon className="h-3 w-3 text-amber-600" />
        </div>
        <div className="text-xs">
          <span className="font-semibold mr-1">Donors:</span>
          <span className="font-bold">{donorCount}</span>
          <span className="text-muted-foreground ml-1">({getPercentage(donorCount)}%)</span>
        </div>
      </div>
    </div>
  );
}; 