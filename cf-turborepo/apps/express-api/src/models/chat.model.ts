import mongoose, { Schema } from 'mongoose';
import { IChatMessageDocument, IAIResponseDocument } from '../types/chat.types';

// Схема за чат съобщения
const ChatMessageSchema = new Schema<IChatMessageDocument>({
  content: { 
    type: String, 
    required: [true, 'The content is required']
  },
  sender: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  receiver: { 
    type: Schema.Types.ObjectId, 
    ref: 'User'
  },
  roomId: { 
    type: String 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Валидация, че или receiver или roomId трябва да бъде предоставен
ChatMessageSchema.pre('validate', function(next) {
  if (!this.receiver && !this.roomId) {
    next(new Error('Either recipient or room ID must be provided'));
  } else {
    next();
  }
});

// Индекси за чат съобщения
ChatMessageSchema.index({ sender: 1 });
ChatMessageSchema.index({ receiver: 1 });
ChatMessageSchema.index({ roomId: 1 });
ChatMessageSchema.index({ createdAt: -1 });

// Схема за AI отговори
const AIResponseSchema = new Schema<IAIResponseDocument>({
  query: { 
    type: String, 
    required: [true, 'The query is required']
  },
  response: { 
    type: String, 
    required: [true, 'The response is required'] 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Индекси за AI отговори
AIResponseSchema.index({ createdAt: -1 });

// Създаване на моделите
const ChatMessage = mongoose.model<IChatMessageDocument>('ChatMessage', ChatMessageSchema);
const AIResponse = mongoose.model<IAIResponseDocument>('AIResponse', AIResponseSchema);

export { ChatMessage, AIResponse };