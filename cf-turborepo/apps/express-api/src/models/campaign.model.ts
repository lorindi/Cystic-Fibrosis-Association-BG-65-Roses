import mongoose, { Schema } from 'mongoose';
import { ICampaignDocument, ICampaignEvent } from '../types/campaign.types';

const CampaignEventSchema = new Schema<ICampaignEvent>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true }
}, { _id: true });

const CampaignSchema = new Schema<ICampaignDocument>({
  title: { 
    type: String, 
    required: [true, 'The title is required'],
    trim: true
  },
  description: { 
    type: String, 
    required: [true, 'The description is required'] 
  },
  goal: { 
    type: Number, 
    required: [true, 'The goal is required'],
    min: [1, 'The goal must be a positive value']
  },
  currentAmount: { 
    type: Number,
    default: 0,
    min: 0
  },
  startDate: { 
    type: Date, 
    required: [true, 'The start date is required'] 
  },
  endDate: { 
    type: Date 
  },
  events: [CampaignEventSchema],
  participants: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'User'
  }],
  pendingParticipants: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'User'
  }],
  createdBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

  // Индекси за по-бързи заявки
CampaignSchema.index({ startDate: 1 });
CampaignSchema.index({ endDate: 1 });
CampaignSchema.index({ createdBy: 1 });
CampaignSchema.index({ participants: 1 });
CampaignSchema.index({ pendingParticipants: 1 });

// Виртуално поле за процента на изпълнение
CampaignSchema.virtual('percentCompleted').get(function() {
  if (this.goal === 0) return 0;
  return Math.min(100, (this.currentAmount / this.goal) * 100);
});

// Виртуално поле за оставащата сума
CampaignSchema.virtual('remainingAmount').get(function() {
  return Math.max(0, this.goal - this.currentAmount);
});

// Виртуално поле, което проверява дали кампанията е активна
CampaignSchema.virtual('isActive').get(function() {
  const now = new Date();
  if (this.endDate) {
    return now >= this.startDate && now <= this.endDate;
  }
  return now >= this.startDate;
});

// Виртуално поле за броя на участниците
CampaignSchema.virtual('participantsCount').get(function() {
  return this.participants.length;
});

// Виртуално поле за броя на чакащите
CampaignSchema.virtual('pendingParticipantsCount').get(function() {
  return this.pendingParticipants.length;
});

const Campaign = mongoose.model<ICampaignDocument>('Campaign', CampaignSchema);

export default Campaign; 