import { Document } from 'mongoose';
import { IUserDocument } from './user.types';

export interface IEventDocument extends Document {
  title: string;
  description: string;
  type: string;
  date: Date;
  location: string;
  participants: IUserDocument['_id'][];
  createdBy: IUserDocument['_id'];
  createdAt: Date;
  updatedAt: Date;
} 