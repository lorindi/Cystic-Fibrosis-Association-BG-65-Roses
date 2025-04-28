import mongoose, { Schema } from 'mongoose';
import { IPaymentDocument, PaymentStatus, PaymentType } from '../types/payment.types';

const PaymentSchema = new Schema<IPaymentDocument>({
  stripePaymentIntentId: {
    type: String,
    required: [true, 'Stripe payment intent ID is required'],
    unique: true
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0.01, 'Amount must be a positive value']
  },
  currency: {
    type: String,
    required: [true, 'Currency is required'],
    default: 'bgn'
  },
  status: {
    type: String,
    enum: Object.values(PaymentStatus),
    required: [true, 'Status is required'],
    default: PaymentStatus.PENDING
  },
  type: {
    type: String,
    enum: Object.values(PaymentType),
    required: [true, 'Payment type is required']
  },
  description: {
    type: String
  },
  metadata: {
    type: Map,
    of: String
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  campaign: {
    type: Schema.Types.ObjectId,
    ref: 'Campaign'
  },
  initiative: {
    type: Schema.Types.ObjectId,
    ref: 'Initiative'
  },
  items: [{
    type: Schema.Types.ObjectId,
    ref: 'StoreItem'
  }],
  donor: {
    type: Schema.Types.ObjectId,
    ref: 'Donor'
  }
}, {
  timestamps: true
});

// Индекси
PaymentSchema.index({ user: 1 });
PaymentSchema.index({ campaign: 1 });
PaymentSchema.index({ initiative: 1 });
PaymentSchema.index({ donor: 1 });
PaymentSchema.index({ status: 1 });
PaymentSchema.index({ type: 1 });
PaymentSchema.index({ createdAt: -1 });

// Експортиране на модела
export const Payment = mongoose.model<IPaymentDocument>('Payment', PaymentSchema); 