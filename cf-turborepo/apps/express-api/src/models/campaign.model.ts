import mongoose, { Schema } from 'mongoose';
import { ICampaignDocument, ICampaignEvent, ICampaignDonation } from '../types/campaign.types';

const CampaignEventSchema = new Schema<ICampaignEvent>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true }
}, { _id: true });

const CampaignDonationSchema = new Schema<ICampaignDonation>({
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  amount: { 
    type: Number, 
    required: true,
    min: 0.01
  },
  comment: { type: String },
  rating: { 
    type: Number, 
    min: 1, 
    max: 5 
  },
  date: { 
    type: Date, 
    default: Date.now,
    required: true 
  }
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
  },
  images: {
    type: [String],
    validate: [arrayMaxLength, 'Campaigns cannot have more than 10 images.']
  },
  imagesCaptions: {
    type: [String],
    validate: [captionsArrayLength, 'The number of captions must match the number of images.']
  },
  donations: [CampaignDonationSchema]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Валидатор за максимален брой изображения
function arrayMaxLength(val: any[]) {
  return val.length <= 10;
}

// Валидатор за заглавията - трябва да са толкова на брой, колкото са изображенията
function captionsArrayLength(this: any, val: any[]) {
  // Ако няма заглавия, това е ок (не са задължителни)
  if (!val || val.length === 0) return true;
  // Трябва да имаме достъп до this, където this е документа
  return !this.images || val.length === this.images.length;
}

// Индекси за по-бързи заявки
CampaignSchema.index({ startDate: 1 });
CampaignSchema.index({ endDate: 1 });
CampaignSchema.index({ createdBy: 1 });
CampaignSchema.index({ participants: 1 });
CampaignSchema.index({ pendingParticipants: 1 });
CampaignSchema.index({ goal: -1 }); // За сортиране по най-висока цел
CampaignSchema.index({ currentAmount: -1 }); // За сортиране по набрани средства

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

// Виртуално поле за общия рейтинг
CampaignSchema.virtual('totalRating').get(function() {
  if (!this.donations || this.donations.length === 0) return 0;
  
  const donations = this.donations.filter(d => d.rating && d.rating > 0);
  if (donations.length === 0) return 0;
  
  const totalRating = donations.reduce((sum, donation) => sum + (donation.rating || 0), 0);
  return totalRating / donations.length;
});

// Виртуално поле за броя на рейтингите
CampaignSchema.virtual('ratingCount').get(function() {
  if (!this.donations) return 0;
  return this.donations.filter(d => d.rating && d.rating > 0).length;
});

const Campaign = mongoose.model<ICampaignDocument>('Campaign', CampaignSchema);

export default Campaign; 