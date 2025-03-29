import { Document, Model } from 'mongoose';

export enum UserRole {
  PATIENT = 'patient',
  PARENT = 'parent',
  DONOR = 'donor',
  ADMIN = 'admin'
}

export enum UserGroup {
  CAMPAIGNS = 'campaigns',
  INITIATIVES = 'initiatives',
  CONFERENCES = 'conferences',
  EVENTS = 'events',
  NEWS = 'news',
  BLOG = 'blog',
  RECIPES = 'recipes'
}

export interface IAddress {
  city: string;
  postalCode?: string;
  street?: string;
}

export interface IContact {
  phone?: string;
  alternativeEmail?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
}

// Базов интерфейс за данни на потребителя
export interface IUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  groups: UserGroup[];
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  profile: {
    avatar?: string;
    bio?: string;
    birthDate?: Date;
    address?: IAddress;
    contact?: IContact;
    diagnosed?: boolean; // For patients
    diagnosisYear?: number; // For patients
    childName?: string; // For parents
    companyName?: string; // For donors
  };
  createdAt: Date;
  updatedAt: Date;
}

// Интерфейс за методите на документа
export interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
  generatePasswordResetToken(): string;
  generateEmailVerificationToken(): string;
}

// Комбиниран интерфейс за модела
export interface IUserDocument extends IUser, Document, IUserMethods {
  _id: any;
  isModified(path: string): boolean;
}