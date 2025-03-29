import mongoose, { Schema } from 'mongoose';
import { 
  INewsDocument, 
  IBlogPostDocument, 
  ICommentDocument,
  IRecipeDocument,
  IStoryDocument,
  INutritionalInfo,
  IVitamin
} from '../types/content.types';

// Схема за коментари
const CommentSchema = new Schema<ICommentDocument>({
  content: { 
    type: String, 
    required: [true, 'The content is required']
  },
  author: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Схема за новини
const NewsSchema = new Schema<INewsDocument>({
  title: { 
    type: String, 
    required: [true, 'The title is required'],
    trim: true
  },
  content: { 
    type: String, 
    required: [true, 'The content is required'] 
  },
  image: { 
    type: String 
  },
  author: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  tags: [{ 
    type: String, 
    trim: true 
  }]
}, {
  timestamps: true
});

// Схема за блог постове
const BlogPostSchema = new Schema<IBlogPostDocument>({
  title: { 
    type: String, 
    required: [true, 'The title is required'],
    trim: true
  },
  content: { 
    type: String, 
    required: [true, 'The content is required'] 
  },
  image: { 
    type: String 
  },
  author: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  approved: { 
    type: Boolean, 
    default: false 
  },
  comments: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Comment' 
  }],
  tags: [{ 
    type: String, 
    trim: true 
  }]
}, {
  timestamps: true
});

// Схема за витамини
const VitaminSchema = new Schema<IVitamin>({
  name: { 
    type: String, 
    required: true
  },
  amount: { 
    type: Number, 
    required: true,
    min: 0
  },
  unit: { 
    type: String, 
    required: true
  }
}, { _id: false });

// Схема за хранителна информация
const NutritionalInfoSchema = new Schema<INutritionalInfo>({
  calories: { 
    type: Number, 
    required: true,
    min: 0
  },
  protein: { 
    type: Number, 
    required: true,
    min: 0
  },
  carbs: { 
    type: Number, 
    required: true,
    min: 0
  },
  fat: { 
    type: Number, 
    required: true,
    min: 0
  },
  vitamins: [VitaminSchema]
}, { _id: false });

// Схема за рецепти
const RecipeSchema = new Schema<IRecipeDocument>({
  title: { 
    type: String, 
    required: [true, 'The title is required'],
    trim: true
  },
  description: { 
    type: String, 
    required: [true, 'The description is required'] 
  },
  image: { 
    type: String 
  },
  preparationTime: { 
    type: Number, 
    required: [true, 'The preparation time is required'],
    min: 1
  },
  cookingTime: { 
    type: Number, 
    required: [true, 'The cooking time is required'],
    min: 0
  },
  servings: { 
    type: Number, 
    required: [true, 'The number of servings is required'],
    min: 1
  },
  ingredients: [{ 
    type: String, 
    required: true 
  }],
  instructions: [{ 
    type: String, 
    required: true 
  }],
  nutritionalInfo: { 
    type: NutritionalInfoSchema, 
    required: true 
  },
  author: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  approved: { 
    type: Boolean, 
    default: false 
  }
}, {
  timestamps: true
});

// Схема за истории
const StorySchema = new Schema<IStoryDocument>({
  title: { 
    type: String, 
    required: [true, 'The title is required'],
    trim: true
  },
  content: { 
    type: String, 
    required: [true, 'The content is required'] 
  },
  image: { 
    type: String 
  },
  author: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  approved: { 
    type: Boolean, 
    default: false 
  }
}, {
  timestamps: true
});

// Индекси
NewsSchema.index({ createdAt: -1 });
NewsSchema.index({ author: 1 });
NewsSchema.index({ tags: 1 });

BlogPostSchema.index({ createdAt: -1 });
BlogPostSchema.index({ author: 1 });
BlogPostSchema.index({ approved: 1 });
BlogPostSchema.index({ tags: 1 });

RecipeSchema.index({ createdAt: -1 });
RecipeSchema.index({ author: 1 });
RecipeSchema.index({ approved: 1 });

StorySchema.index({ createdAt: -1 });
StorySchema.index({ author: 1 });
StorySchema.index({ approved: 1 });

// Създаване на моделите
const News = mongoose.model<INewsDocument>('News', NewsSchema);
const BlogPost = mongoose.model<IBlogPostDocument>('BlogPost', BlogPostSchema);
const Comment = mongoose.model<ICommentDocument>('Comment', CommentSchema);
const Recipe = mongoose.model<IRecipeDocument>('Recipe', RecipeSchema);
const Story = mongoose.model<IStoryDocument>('Story', StorySchema);

export { News, BlogPost, Comment, Recipe, Story }; 