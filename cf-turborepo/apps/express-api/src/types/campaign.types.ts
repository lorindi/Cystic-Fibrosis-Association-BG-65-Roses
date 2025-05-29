import { Document, Types } from 'mongoose';
import { IUserDocument } from './user.types';

export interface ICampaignEvent {
  _id?: Types.ObjectId;
  title: string;
  description: string;
  date: Date;
  location: string;
  image?: string;
  imageCaption?: string;
}

export interface ICampaignDonation {
  _id?: Types.ObjectId;
  user: Types.ObjectId | IUserDocument;
  amount: number;
  comment?: string;
  rating?: number; // рейтинг от 1 до 5
  date: Date;
}

export interface ICampaignDocument extends Document {
  title: string;
  description: string;
  goal: number;
  currentAmount: number;
  startDate: Date;
  endDate?: Date;
  events: ICampaignEvent[];
  participants: IUserDocument['_id'][];
  pendingParticipants: IUserDocument['_id'][];
  createdBy: IUserDocument['_id'];
  createdAt: Date;
  updatedAt: Date;
  images: string[]; // масив с URL адреси на изображения (максимум 13)
  imagesCaptions?: string[]; // опционални заглавия за изображенията, вече не са задължителни
  donations: ICampaignDonation[]; // масив от донации с коментари и рейтинги
  totalRating?: number; // средна оценка на кампанията
  hashtags: string[]; // масив от хаштагове
}

// Филтриране на кампании
export enum CampaignSortOption {
  HIGHEST_GOAL = 'highest_goal',
  LOWEST_GOAL = 'lowest_goal',
  MOST_FUNDED = 'most_funded',
  LEAST_FUNDED = 'least_funded',
  NEWEST = 'newest',
  OLDEST = 'oldest',
  HIGHEST_RATED = 'highest_rated'
} 