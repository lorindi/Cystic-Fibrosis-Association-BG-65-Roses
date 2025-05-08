import mongoose, { Schema } from 'mongoose';
import { IInitiativeDocument, IInitiativeItem } from '../types/initiative.types';

const InitiativeItemSchema = new Schema<IInitiativeItem>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  quantity: { 
    type: Number, 
    required: true,
    min: [1, 'The quantity must be a positive number']
  },
  distributedQuantity: { 
    type: Number, 
    default: 0,
    min: 0
  }
}, { _id: true });

const InitiativeSchema = new Schema<IInitiativeDocument>({
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
    type: Date 
  },
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
  items: [InitiativeItemSchema]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Индекси за по-бързи заявки
InitiativeSchema.index({ startDate: 1 });
InitiativeSchema.index({ endDate: 1 });
InitiativeSchema.index({ createdBy: 1 });
InitiativeSchema.index({ participants: 1 });
InitiativeSchema.index({ pendingParticipants: 1 });

// Виртуално поле, което показва колко души участват
InitiativeSchema.virtual('participantsCount').get(function() {
  return this.participants.length;
});

// Виртуално поле, което показва колко души чакат одобрение
InitiativeSchema.virtual('pendingParticipantsCount').get(function() {
  return this.pendingParticipants.length;
});

// Виртуално поле, което проверява дали инициативата е активна
InitiativeSchema.virtual('isActive').get(function() {
  const now = new Date();
  if (this.endDate) {
    return now >= this.startDate && now <= this.endDate;
  }
  return now >= this.startDate;
});

const Initiative = mongoose.model<IInitiativeDocument>('Initiative', InitiativeSchema);

export default Initiative; 