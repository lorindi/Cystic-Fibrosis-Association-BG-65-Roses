import mongoose, { Schema } from 'mongoose';
import { IEventDocument } from '../types/event.types';

const EventSchema = new Schema<IEventDocument>({
  title: { 
    type: String, 
    required: [true, 'The title is required'],
    trim: true
  },
  description: { 
    type: String, 
    required: [true, 'The description is required'] 
  },
  type: { 
    type: String, 
    required: [true, 'The event type is required'],
    enum: ['sport', 'hiking', 'swimming', 'other']
  },
  date: { 
    type: Date, 
    required: [true, 'The date is required'] 
  },
  location: { 
    type: String, 
    required: [true, 'The location is required'] 
  },
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
EventSchema.index({ date: 1 });
EventSchema.index({ type: 1 });
EventSchema.index({ createdBy: 1 });
EventSchema.index({ participants: 1 });

// Виртуално поле, което показва колко души участват
EventSchema.virtual('participantsCount').get(function() {
  return this.participants.length;
});

// Виртуално поле, което проверява дали събитието е приключило
EventSchema.virtual('isCompleted').get(function() {
  return new Date() > this.date;
});

// Виртуално поле, което проверява дали събитието предстои
EventSchema.virtual('isUpcoming').get(function() {
  return new Date() < this.date;
});

const Event = mongoose.model<IEventDocument>('Event', EventSchema);

export default Event; 