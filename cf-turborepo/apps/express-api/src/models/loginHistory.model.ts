import mongoose, { Schema, Document } from 'mongoose';

export interface ILoginHistory extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  ip: string;
  userAgent: string;
  status: 'success' | 'failed';
  loggedInAt: Date;
}

const LoginHistorySchema = new Schema({
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
  status: {
    type: String,
    enum: ['success', 'failed'],
    required: true,
  },
  loggedInAt: {
    type: Date,
    default: Date.now,
  }
});

// Индекси за по-бързи заявки
LoginHistorySchema.index({ userId: 1 });
LoginHistorySchema.index({ loggedInAt: -1 });

const LoginHistory = mongoose.model<ILoginHistory>('LoginHistory', LoginHistorySchema);

export default LoginHistory; 