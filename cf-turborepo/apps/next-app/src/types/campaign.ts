export interface CampaignEvent {
  id: string;
  title: string;
  date: string;
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  goal: number;
  currentAmount: number;
  startDate: string;
  endDate: string;
  events?: CampaignEvent[];
  participantsCount?: number;
} 