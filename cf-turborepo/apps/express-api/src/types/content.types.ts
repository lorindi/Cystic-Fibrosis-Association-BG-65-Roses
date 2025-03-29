import { Document } from 'mongoose';
import { IUserDocument } from './user.types';

export interface INewsDocument extends Document {
  title: string;
  content: string;
  image?: string;
  author: IUserDocument['_id'];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ICommentDocument extends Document {
  content: string;
  author: IUserDocument['_id'];
  createdAt: Date;
  updatedAt: Date;
}

export interface IBlogPostDocument extends Document {
  title: string;
  content: string;
  image?: string;
  author: IUserDocument['_id'];
  approved: boolean;
  comments: ICommentDocument['_id'][];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IVitamin {
  name: string;
  amount: number;
  unit: string;
}

export interface INutritionalInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  vitamins?: IVitamin[];
}

export interface IRecipeDocument extends Document {
  title: string;
  description: string;
  image?: string;
  preparationTime: number;
  cookingTime: number;
  servings: number;
  ingredients: string[];
  instructions: string[];
  nutritionalInfo: INutritionalInfo;
  author: IUserDocument['_id'];
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IStoryDocument extends Document {
  title: string;
  content: string;
  image?: string;
  author: IUserDocument['_id'];
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
} 