import { AuthenticationError } from '../utils/errors';
import { UserRole } from '../../types/user.types';
import { Story } from '../../models/content.model';
import { ContextType, checkAuth } from '../utils/auth';

export const storyResolvers = {
  Query: {
    getStories: async () => {
      try {
        return await Story.find()
          .populate('author')
          .sort({ createdAt: -1 });
      } catch (err) {
        throw new Error('Error fetching stories');
      }
    },
    
    getStory: async (_: unknown, { id }: { id: string }) => {
      try {
        const story = await Story.findById(id).populate('author');
        if (!story) {
          throw new Error('Story not found');
        }
        return story;
      } catch (err) {
        throw new Error('Error fetching story');
      }
    }
  },

  Mutation: {
    createStory: async (
      _: unknown, 
      { input }: { input: any }, 
      context: ContextType
    ) => {
      const user = checkAuth(context);
      // Всички потребители могат да създават истории, но те изискват одобрение
      
      try {
        const newStory = new Story({
          ...input,
          author: user.id,
          approved: user.role === UserRole.ADMIN // Само админите автоматично одобряват истории
        });
        
        const savedStory = await newStory.save();
        return await Story.findById(savedStory._id).populate('author');
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Error creating story: ${err.message}`);
        }
        throw new Error('Unexpected error during story creation');
      }
    },
    
    updateStory: async (
      _: unknown, 
      { id, input }: { id: string; input: any }, 
      context: ContextType
    ) => {
      const user = checkAuth(context);
      
      try {
        const story = await Story.findById(id);
        if (!story) {
          throw new Error('Story not found');
        }
        
        // Проверка дали потребителят е автор на историята или админ
        if (story.author.toString() !== user.id && user.role !== UserRole.ADMIN) {
          throw new AuthenticationError('You do not have permission to edit this story');
        }
        
        // Ако потребителят не е админ, историята остава неодобрена след редактиране
        const approved = user.role === UserRole.ADMIN ? story.approved : false;
        
        const updatedStory = await Story.findByIdAndUpdate(
          id,
          { ...input, approved },
          { new: true, runValidators: true }
        ).populate('author');
          
        return updatedStory;
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Error updating story: ${err.message}`);
        }
        throw new Error('Unexpected error during story update');
      }
    },
    
    deleteStory: async (_: unknown, { id }: { id: string }, context: ContextType) => {
      const user = checkAuth(context);
      
      try {
        const story = await Story.findById(id);
        if (!story) {
          throw new Error('Story not found');
        }
        
        // Проверка дали потребителят е автор на историята или админ
        if (story.author.toString() !== user.id && user.role !== UserRole.ADMIN) {
          throw new AuthenticationError('You do not have permission to delete this story');
        }
        
        await Story.findByIdAndDelete(id);
        return true;
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Error deleting story: ${err.message}`);
        }
        throw new Error('Unexpected error during story deletion');
      }
    },
    
    approveStory: async (_: unknown, { id }: { id: string }, context: ContextType) => {
      const user = checkAuth(context);
      // Само админи могат да одобряват истории
      if (user.role !== UserRole.ADMIN) {
        throw new AuthenticationError('You do not have permission to approve stories');
      }
      
      try {
        const story = await Story.findById(id);
        if (!story) {
          throw new Error('Story not found');
        }
        
        const updatedStory = await Story.findByIdAndUpdate(
          id,
          { approved: true },
          { new: true }
        ).populate('author');
          
        return updatedStory;
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Error approving story: ${err.message}`);
        }
        throw new Error('Unexpected error during story approval');
      }
    }
  }
};