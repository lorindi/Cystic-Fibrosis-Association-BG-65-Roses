import mongoose, { Schema, Document } from 'mongoose';

export interface IHashtagDocument extends Document {
  name: string;
  count: number;
  categories: string[];
  createdAt: Date;
  updatedAt: Date;
}

const HashtagSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Hashtag name is required'],
    unique: true,
    trim: true,
    lowercase: true,
    index: true
  },
  count: {
    type: Number,
    default: 0,
    min: 0
  },
  categories: [{
    type: String,
    enum: ['campaign', 'news', 'blog', 'recipe', 'story'],
    required: true
  }]
}, {
  timestamps: true
});

// Индекси за по-бързи заявки
HashtagSchema.index({ count: -1 });
HashtagSchema.index({ categories: 1 });

// Middleware за форматиране на хаштаг
HashtagSchema.pre('save', function(next) {
  // Премахваме # от началото ако съществува
  if (this.name.startsWith('#')) {
    this.name = this.name.substring(1);
  }
  // Конвертираме в lowercase
  this.name = this.name.toLowerCase();
  next();
});

const Hashtag = mongoose.model<IHashtagDocument>('Hashtag', HashtagSchema);

export default Hashtag; 