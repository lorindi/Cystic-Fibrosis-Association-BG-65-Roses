import mongoose, { Schema } from 'mongoose';
import { IConferenceDocument, IConferenceSession } from '../types/conference.types';

const ConferenceSessionSchema = new Schema<IConferenceSession>({
  title: { type: String, required: true },
  speaker: { type: String, required: true },
  description: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true }
}, { _id: true });

const ConferenceSchema = new Schema<IConferenceDocument>({
  title: { 
    type: String, 
    required: [true, 'The title is required'],
    trim: true
  },
  description: { 
    type: String, 
    required: [true, 'The description is required'] 
  },
  startDate: { 
    type: Date, 
    required: [true, 'The start date is required'] 
  },
  endDate: { 
    type: Date,
    required: [true, 'The end date is required']
  },
  location: { 
    type: String, 
    required: [true, 'The location is required'] 
  },
  agenda: [ConferenceSessionSchema],
  participants: [{ 
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
ConferenceSchema.index({ startDate: 1 });
ConferenceSchema.index({ endDate: 1 });
ConferenceSchema.index({ createdBy: 1 });
ConferenceSchema.index({ participants: 1 });

// Виртуално поле, което показва колко души участват
ConferenceSchema.virtual('participantsCount').get(function() {
  return this.participants.length;
});

// Виртуално поле, което показва броя на сесиите
ConferenceSchema.virtual('sessionsCount').get(function() {
  return this.agenda.length;
});

// Виртуално поле, което показва продължителността на конференцията в дни
ConferenceSchema.virtual('durationDays').get(function() {
  const start = new Date(this.startDate).getTime();
  const end = new Date(this.endDate).getTime();
  return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
});

// Виртуално поле, което проверява дали конференцията е приключила
ConferenceSchema.virtual('isCompleted').get(function() {
  return new Date() > this.endDate;
});

// Виртуално поле, което проверява дали конференцията е активна
ConferenceSchema.virtual('isActive').get(function() {
  const now = new Date();
  return now >= this.startDate && now <= this.endDate;
});

// Виртуално поле, което проверява дали конференцията предстои
ConferenceSchema.virtual('isUpcoming').get(function() {
  return new Date() < this.startDate;
});

const Conference = mongoose.model<IConferenceDocument>('Conference', ConferenceSchema);

export default Conference; 