import { Document } from 'mongoose';
import { IUserDocument } from './user.types';
import { ICampaignDocument } from './campaign.types';

export interface IStoreItemDocument extends Document {
  name: string;
  description: string;
  price: number;
  image?: string;
  category: string;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDonorDocument extends Document {
  user?: IUserDocument['_id'];
  name: string;
  description?: string;
  logo?: string;
  website?: string;
  totalDonations: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDonationDocument extends Document {
  amount: number;
  donor: IDonorDocument['_id'];
  campaign?: ICampaignDocument['_id'];
  items?: IStoreItemDocument['_id'][];
  date: Date;
} 