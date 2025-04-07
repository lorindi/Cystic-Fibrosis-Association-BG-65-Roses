import { User } from "@/lib/apollo/types";

export interface InitiativeItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  distributedQuantity: number;
}

export interface Initiative {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  participants: User[];
  createdBy: User;
  items: InitiativeItem[];
  createdAt: string;
  updatedAt: string;
} 