import { Document, Types } from 'mongoose';
import { IUserDocument } from './user.types';

export interface ICampaignEvent {
  _id?: Types.ObjectId;
  title: string;
  description: string;
  date: Date;
  location: string;
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
  createdBy: IUserDocument['_id'];
  createdAt: Date;
  updatedAt: Date;
} 