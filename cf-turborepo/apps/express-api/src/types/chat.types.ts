import { Document } from 'mongoose';
import { IUserDocument } from './user.types';

export interface IChatMessageDocument extends Document {
  content: string;
  sender: IUserDocument['_id'];
  receiver?: IUserDocument['_id'];
  roomId?: string;
  createdAt: Date;
}

export interface IAIResponseDocument extends Document {
  query: string;
  response: string;
  createdAt: Date;
} 