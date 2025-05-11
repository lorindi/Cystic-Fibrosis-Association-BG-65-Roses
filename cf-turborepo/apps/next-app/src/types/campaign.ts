export interface CampaignEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  goal: number;
  currentAmount: number;
  startDate: string;
  endDate?: string | null;
  events: CampaignEvent[];
  participantsCount: number;
  pendingParticipantsCount: number;
  createdBy?: any;
  createdAt?: string;
  updatedAt?: string;
  images: string[];
  imagesCaptions?: string[];
}

export interface CampaignInput {
  title: string;
  description: string;
  goal: number;
  startDate: string;
  endDate?: string | null;
  events?: CampaignEventInput[];
  images: string[];
  imagesCaptions?: string[];
}

export interface CampaignEventInput {
  title: string;
  description: string;
  date: string;
  location: string;
} 