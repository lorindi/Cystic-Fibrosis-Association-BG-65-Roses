import { Document, Types } from 'mongoose';

export enum PaymentStatus {
  PENDING = 'pending',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
  CANCELED = 'canceled',
  REFUNDED = 'refunded'
}

export enum PaymentType {
  CAMPAIGN_DONATION = 'campaign_donation',
  INITIATIVE_DONATION = 'initiative_donation',
  STORE_PURCHASE = 'store_purchase',
  OTHER_DONATION = 'other_donation'
}

export interface IPayment {
  stripePaymentIntentId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  type: PaymentType;
  description?: string;
  metadata?: Record<string, string>;
  user?: Types.ObjectId;
  campaign?: Types.ObjectId;
  initiative?: Types.ObjectId;
  items?: Types.ObjectId[];
  donor?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPaymentDocument extends IPayment, Document {
  _id: Types.ObjectId;
}

// Типове за заявки към Stripe
export interface CreatePaymentIntentInput {
  amount: number;
  currency?: string;
  type: PaymentType;
  campaignId?: string;
  initiativeId?: string;
  items?: string[];
  description?: string;
  savePaymentMethod?: boolean;
}

export interface ProcessPaymentInput {
  paymentIntentId: string;
  paymentMethodId?: string;
}

export interface CustomerPaymentMethodInput {
  paymentMethodId: string;
  isDefault?: boolean;
}

// Типове за отговори от Stripe
export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
}

export interface SetupIntentResponse {
  clientSecret: string;
  setupIntentId: string;
}

export interface PaymentMethodResponse {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
} 