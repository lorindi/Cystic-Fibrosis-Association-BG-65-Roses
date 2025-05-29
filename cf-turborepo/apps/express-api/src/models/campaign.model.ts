import mongoose, { Schema } from 'mongoose';
import { ICampaignDocument, ICampaignEvent, ICampaignDonation } from '../types/campaign.types';
import { HashtagService } from '../services/hashtag.service';

const CampaignEventSchema = new Schema<ICampaignEvent>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  image: { type: String },
  imageCaption: { type: String }
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
    validate: [arrayMaxLength, 'Campaigns cannot have more than 13 images.'],
    default: []
  },
  imagesCaptions: {
    type: [String],
    default: []
  },
  donations: [CampaignDonationSchema],
  hashtags: {
    type: [String],
    default: [],
    trim: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Валидатор за максимален брой изображения
function arrayMaxLength(val: any[]) {
  return val.length <= 13;
}

// Middleware за обработка на хаштагове преди запазване
CampaignSchema.pre('save', async function(this: ICampaignDocument, next) {
  // Извличаме хаштагове от заглавието и описанието
  const titleHashtags = HashtagService.extractHashtags(this.title);
  const descriptionHashtags = HashtagService.extractHashtags(this.description);
  
  // Обединяваме всички хаштагове и премахваме дубликатите
  const allHashtags = [...new Set([...titleHashtags, ...descriptionHashtags, ...this.hashtags])];
  
  // Актуализираме хаштаговете на кампанията
  this.hashtags = allHashtags;
  
  // Обработваме хаштаговете
  await HashtagService.processHashtags(allHashtags, 'campaign');
  
  next();
});

// Middleware за намаляване на броячите на хаштаговете при изтриване
CampaignSchema.pre('deleteOne', { document: true }, async function(this: ICampaignDocument, next) {
  // Намаляваме броячите на всички хаштагове
  for (const tag of this.hashtags) {
    await HashtagService.decrementHashtagCount(tag, 'campaign');
  }
  
  next();
});

// Индекси
CampaignSchema.index({ createdAt: -1 });
CampaignSchema.index({ startDate: 1 });
CampaignSchema.index({ endDate: 1 });
CampaignSchema.index({ currentAmount: -1 });
CampaignSchema.index({ hashtags: 1 });

// Виртуални полета
CampaignSchema.virtual('percentCompleted').get(function(this: ICampaignDocument) {
  if (this.goal === 0) return 0;
  return Math.min(100, (this.currentAmount / this.goal) * 100);
});

CampaignSchema.virtual('remainingAmount').get(function(this: ICampaignDocument) {
  return Math.max(0, this.goal - this.currentAmount);
});

CampaignSchema.virtual('isActive').get(function(this: ICampaignDocument) {
  const now = new Date();
  if (this.endDate) {
    return now >= this.startDate && now <= this.endDate;
  }
  return now >= this.startDate;
});

CampaignSchema.virtual('participantsCount').get(function(this: ICampaignDocument) {
  return this.participants.length;
});

CampaignSchema.virtual('pendingParticipantsCount').get(function(this: ICampaignDocument) {
  return this.pendingParticipants.length;
});

CampaignSchema.virtual('totalRating').get(function(this: ICampaignDocument) {
  if (!this.donations || this.donations.length === 0) return 0;
  
  const donations = this.donations.filter((d: ICampaignDonation) => d.rating && d.rating > 0);
  if (donations.length === 0) return 0;
  
  const totalRating = donations.reduce((sum: number, donation: ICampaignDonation) => sum + (donation.rating || 0), 0);
  return totalRating / donations.length;
});

CampaignSchema.virtual('ratingCount').get(function(this: ICampaignDocument) {
  if (!this.donations) return 0;
  return this.donations.filter((d: ICampaignDonation) => d.rating && d.rating > 0).length;
});

CampaignSchema.virtual('donationsCount').get(function(this: ICampaignDocument) {
  if (!this.donations) return 0;
  return this.donations.length;
});

CampaignSchema.virtual('uniqueDonorsCount').get(function(this: ICampaignDocument) {
  if (!this.donations || this.donations.length === 0) return 0;
  
  const uniqueUsers = new Set();
  this.donations.forEach((donation: ICampaignDonation) => {
    uniqueUsers.add(donation.user.toString());
  });
  
  return uniqueUsers.size;
});

const Campaign = mongoose.model<ICampaignDocument>('Campaign', CampaignSchema);

export default Campaign; 