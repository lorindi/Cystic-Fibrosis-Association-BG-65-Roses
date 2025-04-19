import mongoose, { Schema, Document } from 'mongoose';

export interface IRefreshToken extends Document {
  token: string;
  userId: mongoose.Schema.Types.ObjectId;
  ip: string;
  userAgent: string;
  isValid: boolean;
  expires: Date;
  createdAt: Date;
  updatedAt: Date;
}

const RefreshTokenSchema = new Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  ip: {
    type: String,
    required: true,
  },
  userAgent: {
    type: String,
    required: true,
  },
  isValid: {
    type: Boolean,
    default: true,
  },
  expires: {
    type: Date,
    required: true,
  }
}, { 
  timestamps: true 
});

// Индекси за по-бързи заявки
RefreshTokenSchema.index({ userId: 1 });
RefreshTokenSchema.index({ expires: 1 });

const RefreshToken = mongoose.model<IRefreshToken>('RefreshToken', RefreshTokenSchema);

export default RefreshToken; 