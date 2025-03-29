import { Document, Types } from 'mongoose';
import { IUserDocument } from './user.types';

export interface IConferenceSession {
  _id?: Types.ObjectId;
  title: string;
  speaker: string;
  description: string;
  startTime: Date;
  endTime: Date;
}

export interface IConferenceDocument extends Document {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  agenda: IConferenceSession[];
  participants: IUserDocument['_id'][];
  createdBy: IUserDocument['_id'];
  createdAt: Date;
  updatedAt: Date;
} 