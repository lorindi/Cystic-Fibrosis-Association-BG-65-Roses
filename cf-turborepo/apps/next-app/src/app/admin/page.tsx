'use client';

import { 
  UsersIcon, 
  BarChartIcon,
  DollarSignIcon,
  CalendarIcon,
} from "lucide-react";

// Import the admin dashboard hook
import { useAdminDashboard } from '@/hooks/admin/useAdminDashboard';

// Import custom dashboard components
import {
  StatCard,
  UserDistributionChart,
  DonationsChart,
  RegistrationsChart,
  CampaignPerformanceChart,
  ActivityList,
} from './dashboard';

// Define colors locally
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

export default function AdminDashboard() {
  // Use the custom hook for all dashboard data and logic
  const {
    totalUsers,
    usersByRole,
    totalCampaigns,
    activeCampaigns,
    totalDonations,
    monthlyDonations,
    totalEvents,
    recentActivity,
    userRegistrationsData,
    loading,
    donorsCount,
    getUpcomingEventsCount
  } = useAdminDashboard();
  
  // If all data is loading, show loading state
  if (loading.all) {
    return <div className="p-6">Loading dashboard data...</div>;
  }
  
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
      
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={totalUsers}
          description={`${usersByRole.find((r: any) => r.name === 'Patient')?.value || 0} patients`}
          icon={<UsersIcon className="h-4 w-4 text-muted-foreground" />}
          isLoading={loading.users}
        />
        
        <StatCard
          title="Campaigns"
          value={totalCampaigns}
          description={`${activeCampaigns.length} active campaigns`}
          icon={<BarChartIcon className="h-4 w-4 text-muted-foreground" />}
          isLoading={loading.campaigns}
        />
        
        <StatCard
          title="Total Donations"
          value={`$${totalDonations.toLocaleString()}`}
          description={`${donorsCount} donors`}
          icon={<DollarSignIcon className="h-4 w-4 text-muted-foreground" />}
          isLoading={loading.donations}
        />
        
        <StatCard
          title="Events"
          value={totalEvents}
          description={`${getUpcomingEventsCount()} upcoming`}
          icon={<CalendarIcon className="h-4 w-4 text-muted-foreground" />}
          isLoading={loading.events}
        />
      </div>
      
      {/* Visualizations Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <UserDistributionChart 
          usersByRole={usersByRole} 
          colors={COLORS} 
        />
        
        <DonationsChart 
          monthlyDonations={monthlyDonations} 
        />
      </div>
      
      {/* Additional Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <RegistrationsChart 
          registrationsData={userRegistrationsData} 
        />
        
        <CampaignPerformanceChart 
          campaigns={activeCampaigns} 
        />
      </div>
      
      {/* Recent Activity Section */}
      <ActivityList 
        activities={recentActivity} 
      />
    </div>
  );
}

