'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  UserIcon, 
  UsersIcon, 
  HeartIcon, 
  CalendarIcon, 
  TrendingUpIcon, 
  BarChartIcon,
  DollarSignIcon,
  ActivityIcon
} from "lucide-react";
import { gql, useQuery } from '@apollo/client';
import { formatDistanceToNow } from 'date-fns';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// GraphQL Queries
const GET_USERS = gql`
  query GetUsers($noLimit: Boolean) {
    getUsers(noLimit: $noLimit) {
      _id
      name
      email
      role
      groups
      isEmailVerified
      createdAt
      updatedAt
      profile {
        avatar
      }
    }
  }
`;

const GET_CAMPAIGNS = gql`
  query GetCampaigns($noLimit: Boolean) {
    getCampaigns(noLimit: $noLimit) {
      id
      title
      description
      goal
      currentAmount
      startDate
      endDate
      events {
        id
        title
        description
        date
        location
      }
      participantsCount
      pendingParticipantsCount
    }
  }
`;

const GET_EVENTS = gql`
  query GetEvents($noLimit: Boolean) {
    getEvents(noLimit: $noLimit) {
      id
      title
      description
      date
      location
      createdAt
      participants {
        id
        name
      }
    }
  }
`;

const GET_DONATIONS = gql`
  query GetDonations($noLimit: Boolean) {
    getDonors(noLimit: $noLimit) {
      id
      name
      amount
      date
      campaign {
        id
        title
      }
    }
  }
`;

// Define types
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  groups: string[];
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  profile?: {
    avatar?: string;
  };
}

interface Campaign {
  id: string;
  title: string;
  description: string;
  goal: number;
  currentAmount: number;
  startDate: string;
  endDate: string;
  events: Event[];
  participantsCount: number;
  pendingParticipantsCount: number;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  createdAt: string;
  participants?: { id: string; name: string }[];
}

interface Donation {
  id: string;
  name: string;
  amount: number;
  date: string;
  campaign?: {
    id: string;
    title: string;
  };
}

interface RoleData {
  name: string;
  value: number;
  percentage: number;
}

interface MonthlyDonation {
  month: string;
  amount: number;
}

interface RecentActivity {
  type: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  date: Date;
}

// Custom colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

export default function AdminDashboard() {
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
      
      users.forEach(user => {
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
      
      users.forEach(user => {
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
        .filter(c => {
          const startDate = new Date(c.startDate);
          const endDate = new Date(c.endDate);
          return startDate <= now && endDate >= now;
        })
        .map(c => ({
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
        .filter(e => new Date(e.date) > now)
        .length;
      
      // Add to recent activity
      const eventActivities = events
        .slice(0, 3)
        .map(event => ({
          type: 'event',
          icon: <CalendarIcon className="h-4 w-4 text-primary" />,
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
      const total = donations.reduce((sum, donation) => sum + (donation.amount || 0), 0);
      setTotalDonations(total);
      
      // Process monthly donations
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];
      const currentYear = new Date().getFullYear();
      
      const monthlyAmounts = months.map((month, idx) => {
        const monthDonations = donations.filter(d => {
          const date = new Date(d.date);
          return date.getMonth() === idx && date.getFullYear() === currentYear;
        });
        
        const amount = monthDonations.reduce((sum, d) => sum + (d.amount || 0), 0);
        return { month, amount };
      });
      
      setMonthlyDonations(monthlyAmounts);
      
      // Add to recent activity
      const donationActivities = donations
        .slice(0, 3)
        .map(donation => ({
          type: 'donation',
          icon: <HeartIcon className="h-4 w-4 text-primary" />,
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
  
  // If all data is loading, show loading state
  if (usersLoading && campaignsLoading && eventsLoading && donationsLoading) {
    return <div className="p-6">Loading dashboard data...</div>;
  }
  
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
      
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {usersLoading ? 'Loading...' : `${usersByRole.find(r => r.name === 'Patient')?.value || 0} patients`}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Campaigns</CardTitle>
            <BarChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCampaigns}</div>
            <p className="text-xs text-muted-foreground">
              {campaignsLoading ? 'Loading...' : `${activeCampaigns.length} active campaigns`}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
            <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalDonations.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {donationsLoading ? 'Loading...' : `${donationsData?.getDonors?.length || 0} donors`}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Events</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEvents}</div>
            <p className="text-xs text-muted-foreground">
              {eventsLoading ? 'Loading...' : `${eventsData?.getEvents?.filter(e => new Date(e.date) > new Date()).length || 0} upcoming`}
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Visualizations Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>User Distribution</CardTitle>
            <CardDescription>
              Breakdown of users by role
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={usersByRole}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {usersByRole.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} users`, 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Donations Overview</CardTitle>
            <CardDescription>
              Monthly donation amounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyDonations.slice(-6)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                  <Legend />
                  <Bar dataKey="amount" fill="#8884d8" name="Donations" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Additional Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>User Registrations</CardTitle>
            <CardDescription>
              New user sign-ups over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={userRegistrationsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    name="New Registrations"
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    fillOpacity={0.3} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Campaign Performance</CardTitle>
            <CardDescription>
              Progress towards fundraising goals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  layout="vertical" 
                  data={activeCampaigns}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Progress']} />
                  <Legend />
                  <Bar 
                    dataKey="progress" 
                    fill="#82ca9d" 
                    name="Progress (%)" 
                    label={{ position: 'right', formatter: (value) => `${value}%` }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Activity Section */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest user and system activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center">
                  <div className="mr-4 p-2 bg-primary/10 rounded-full">
                    {activity.icon}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-4 text-center text-muted-foreground">
                No recent activity to display
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

