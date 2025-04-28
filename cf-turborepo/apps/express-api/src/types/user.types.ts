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

// Интерфейс за платежен метод
export interface IPaymentMethod {
  paymentMethodId: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
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
  stripeCustomerId?: string;
  paymentMethods?: IPaymentMethod[];
  createdAt: Date;
  updatedAt: Date;
}

// Интерфейс за методите на документа
export interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
  generatePasswordResetToken(): string;
  generateEmailVerificationToken(): string;
  generateRefreshToken(ip: string, userAgent: string): Promise<string>;
}

// Комбиниран интерфейс за модела
export interface IUserDocument extends IUser, Document, IUserMethods {
  _id: any;
  isModified(path: string): boolean;
}