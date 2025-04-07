import { Document, Types } from 'mongoose';
import { IUserDocument } from './user.types';

export interface IInitiativeItem {
  _id?: Types.ObjectId;
  name: string;
  description: string;
  quantity: number;
  distributedQuantity: number;
}

export interface IInitiativeDocument extends Document {
  title: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  participants: IUserDocument['_id'][];
  pendingParticipants: IUserDocument['_id'][];
  createdBy: IUserDocument['_id'];
  items: IInitiativeItem[];
  createdAt: Date;
  updatedAt: Date;
} 