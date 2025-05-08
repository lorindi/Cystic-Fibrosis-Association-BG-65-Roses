// Admin dashboard types

export interface User {
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

export interface Campaign {
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

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  createdAt: string;
  participants?: { id: string; name: string }[];
}

export interface Donation {
  id: string;
  name: string;
  amount: number;
  date: string;
  campaign?: {
    id: string;
    title: string;
  };
}

export interface RoleData {
  name: string;
  value: number;
  percentage: number;
}

export interface MonthlyDonation {
  month: string;
  amount: number;
}

export interface IconData {
  type: string;
  className: string;
}

export interface RecentActivity {
  type: string;
  icon: IconData;
  title: string;
  description: string;
  date: Date;
} 