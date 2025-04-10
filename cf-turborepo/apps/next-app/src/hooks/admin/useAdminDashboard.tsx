import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { formatDistanceToNow } from 'date-fns';

// Import GraphQL queries
import { 
  GET_USERS, 
  GET_CAMPAIGNS, 
  GET_EVENTS, 
  GET_DONATIONS 
} from '@/graphql/queries/admin';

// Import types
import {
  User,
  Campaign,
  Event,
  Donation,
  RoleData,
  MonthlyDonation,
  RecentActivity,
  IconData
} from '@/graphql/types';

// Colors for charts
export const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

export function useAdminDashboard() {
  // State for stats
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [usersByRole, setUsersByRole] = useState<RoleData[]>([]);
  const [totalCampaigns, setTotalCampaigns] = useState<number>(0);
  const [activeCampaigns, setActiveCampaigns] = useState<any[]>([]);
  const [totalDonations, setTotalDonations] = useState<number>(0);
  const [monthlyDonations, setMonthlyDonations] = useState<MonthlyDonation[]>([]);
  const [totalEvents, setTotalEvents] = useState<number>(0);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [userRegistrationsData, setUserRegistrationsData] = useState<any[]>([]);
  
  // GraphQL queries
  const { data: usersData, loading: usersLoading } = useQuery(GET_USERS, { 
    variables: { noLimit: true } 
  });
  
  const { data: campaignsData, loading: campaignsLoading } = useQuery(GET_CAMPAIGNS, { 
    variables: { noLimit: true } 
  });
  
  const { data: eventsData, loading: eventsLoading } = useQuery(GET_EVENTS, { 
    variables: { noLimit: true } 
  });
  
  const { data: donationsData, loading: donationsLoading } = useQuery(GET_DONATIONS, { 
    variables: { noLimit: true } 
  });
  
  // Process user data
  useEffect(() => {
    if (usersData?.getUsers) {
      const users = usersData.getUsers as User[];
      setTotalUsers(users.length);
      
      // Process user roles
      const roleCount: Record<string, number> = {
        admin: 0,
        patient: 0,
        parent: 0,
        donor: 0
      };
      
      users.forEach((user: User) => {
        if (roleCount[user.role] !== undefined) {
          roleCount[user.role]++;
        }
      });
      
      const roleData = Object.entries(roleCount).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
        percentage: Math.round((value / users.length) * 100)
      }));
      
      setUsersByRole(roleData);
      
      // Create user registrations data for area chart
      // Group users by month of registration
      const usersByMonth: Record<string, number> = {};
      const now = new Date();
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      
      users.forEach((user: User) => {
        const createdAt = new Date(user.createdAt);
        if (createdAt >= sixMonthsAgo && createdAt <= now) {
          const month = createdAt.toLocaleString('default', { month: 'short' });
          usersByMonth[month] = (usersByMonth[month] || 0) + 1;
        }
      });
      
      // Convert to array for Recharts
      const registrationsData = Object.entries(usersByMonth).map(([month, count]) => ({
        month,
        count
      }));
      
      setUserRegistrationsData(registrationsData);
    }
  }, [usersData]);
  
  // Process campaign data
  useEffect(() => {
    if (campaignsData?.getCampaigns) {
      const campaigns = campaignsData.getCampaigns as Campaign[];
      setTotalCampaigns(campaigns.length);
      
      // Get active campaigns (current date between start and end date)
      const now = new Date();
      const active = campaigns
        .filter((c: Campaign) => {
          const startDate = new Date(c.startDate);
          const endDate = new Date(c.endDate);
          return startDate <= now && endDate >= now;
        })
        .map((c: Campaign) => ({
          id: c.id,
          name: c.title,
          donors: c.participantsCount || 0,
          progress: c.goal > 0 ? Math.round((c.currentAmount / c.goal) * 100) : 0,
          currentAmount: c.currentAmount,
          goal: c.goal
        }))
        .slice(0, 4); // Limit to 4 for the dashboard
      
      setActiveCampaigns(active);
    }
  }, [campaignsData]);
  
  // Process events data
  useEffect(() => {
    if (eventsData?.getEvents) {
      const events = eventsData.getEvents as Event[];
      setTotalEvents(events.length);
      
      // Get upcoming events (date is in the future)
      const now = new Date();
      const upcoming = events
        .filter((e: Event) => new Date(e.date) > now)
        .length;
      
      // Add to recent activity
      const eventActivities = events
        .slice(0, 3)
        .map((event: Event) => ({
          type: 'event',
          icon: { type: 'calendar', className: 'h-4 w-4 text-primary' } as IconData,
          title: 'New event created',
          description: `${event.title} • ${formatDistanceToNow(new Date(event.createdAt), { addSuffix: true })}`,
          date: new Date(event.createdAt)
        }));
      
      // Update recent activity
      setRecentActivity(prev => [...prev, ...eventActivities]);
    }
  }, [eventsData]);
  
  // Process donations data
  useEffect(() => {
    if (donationsData?.getDonors) {
      const donations = donationsData.getDonors as Donation[];
      
      // Calculate total donations
      const total = donations.reduce((sum: number, donation: Donation) => sum + (donation.amount || 0), 0);
      setTotalDonations(total);
      
      // Process monthly donations
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];
      const currentYear = new Date().getFullYear();
      
      const monthlyAmounts = months.map((month, idx) => {
        const monthDonations = donations.filter((d: Donation) => {
          const date = new Date(d.date);
          return date.getMonth() === idx && date.getFullYear() === currentYear;
        });
        
        const amount = monthDonations.reduce((sum: number, d: Donation) => sum + (d.amount || 0), 0);
        return { month, amount };
      });
      
      setMonthlyDonations(monthlyAmounts);
      
      // Add to recent activity
      const donationActivities = donations
        .slice(0, 3)
        .map((donation: Donation) => ({
          type: 'donation',
          icon: { type: 'heart', className: 'h-4 w-4 text-primary' } as IconData,
          title: 'New donation received',
          description: `$${donation.amount} ${donation.campaign ? `for ${donation.campaign.title}` : ''} • ${formatDistanceToNow(new Date(donation.date), { addSuffix: true })}`,
          date: new Date(donation.date)
        }));
      
      // Update recent activity
      setRecentActivity(prev => [...prev, ...donationActivities]);
    }
  }, [donationsData]);
  
  // Sort recent activity by date
  useEffect(() => {
    if (recentActivity.length > 0) {
      const sorted = [...recentActivity].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5);
      setRecentActivity(sorted);
    }
  }, [usersData, campaignsData, eventsData, donationsData]);
  
  // Get upcoming events count
  const getUpcomingEventsCount = (): number => {
    if (!eventsData?.getEvents) return 0;
    
    const now = new Date();
    return (eventsData.getEvents as Event[])
      .filter((e: Event) => new Date(e.date) > now)
      .length;
  };
  
  const donorsCount = donationsData?.getDonors?.length || 0;
  
  return {
    // Stats
    totalUsers,
    usersByRole,
    totalCampaigns,
    activeCampaigns,
    totalDonations,
    monthlyDonations,
    totalEvents,
    recentActivity,
    userRegistrationsData,
    donorsCount,
    
    // Loading states
    loading: {
      users: usersLoading,
      campaigns: campaignsLoading,
      events: eventsLoading,
      donations: donationsLoading,
      all: usersLoading && campaignsLoading && eventsLoading && donationsLoading
    },
    
    // Raw data
    data: {
      users: usersData?.getUsers,
      campaigns: campaignsData?.getCampaigns,
      events: eventsData?.getEvents,
      donations: donationsData?.getDonors
    },
    
    // Helper functions
    getUpcomingEventsCount
  };
} 