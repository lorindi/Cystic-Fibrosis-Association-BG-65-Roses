import { User } from "./user";

export interface CampaignEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  location?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Campaign {
  id: string;
  title: string;
  description?: string;
  goal: number;
  currentAmount: number;
  startDate?: string;
  endDate?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: User;
  events?: CampaignEvent[];
  participants?: User[];
  pendingParticipants?: User[];
  participantsCount?: number;
  pendingParticipantsCount?: number;
} 