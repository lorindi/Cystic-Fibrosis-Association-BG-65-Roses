import { Document } from 'mongoose';
import { IUserDocument } from './user.types';

export interface IInitiativeItem {
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
  createdBy: IUserDocument['_id'];
  items: IInitiativeItem[];
  createdAt: Date;
  updatedAt: Date;
} 