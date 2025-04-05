import { AuthenticationError } from '../utils/errors';
import { UserRole, UserGroup } from '../../types/user.types';
import { News } from '../../models/content.model';
import { ContextType, checkAuth, checkPermissions } from '../utils/auth';

export const newsResolvers = {
  Query: {
    getNews: async () => {
      try {
        return await News.find()
          .populate('author')
          .sort({ createdAt: -1 });
      } catch (err) {
        throw new Error('Error fetching news');
      }
    },
    
    getNewsItem: async (_: unknown, { id }: { id: string }) => {
      try {
        const newsItem = await News.findById(id).populate('author');
        if (!newsItem) {
          throw new Error('News item not found');
        }
        return newsItem;
      } catch (err) {
        throw new Error('Error fetching news item');
      }
    }
  },

  Mutation: {
    createNews: async (
      _: unknown, 
      { input }: { input: any }, 
      context: ContextType
    ) => {
      const user = checkAuth(context);
      // Проверка дали потребителят е админ или е в група "новини"
      if (user.role !== UserRole.ADMIN && (!user.groups || !user.groups.includes(UserGroup.NEWS))) {
        throw new AuthenticationError('You do not have permission to create news');
      }
      
      try {
        const newNews = new News({
          ...input,
          author: user.id
        });
        
        const savedNews = await newNews.save();
        return await News.findById(savedNews._id).populate('author');
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Error creating news: ${err.message}`);
        }
        throw new Error('Unexpected error during news creation');
      }
    },
    
    updateNews: async (
      _: unknown, 
      { id, input }: { id: string; input: any }, 
      context: ContextType
    ) => {
      const user = checkAuth(context);
      // Проверка дали потребителят е админ или е в група "новини"
      if (user.role !== UserRole.ADMIN && (!user.groups || !user.groups.includes(UserGroup.NEWS))) {
        throw new AuthenticationError('You do not have permission to edit news');
      }
      
      try {
        const news = await News.findById(id);
        if (!news) {
          throw new Error('News item not found');
        }
        
        // Ако не е админ, проверяваме дали е автор на новината
        if (user.role !== UserRole.ADMIN && news.author.toString() !== user.id) {
          throw new AuthenticationError('You can only edit news you have created');
        }
        
        const updatedNews = await News.findByIdAndUpdate(
          id,
          { ...input },
          { new: true, runValidators: true }
        ).populate('author');
          
        return updatedNews;
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Error updating news: ${err.message}`);
        }
        throw new Error('Unexpected error during news update');
      }
    },
    
    deleteNews: async (_: unknown, { id }: { id: string }, context: ContextType) => {
      const user = checkAuth(context);
      // Проверка дали потребителят е админ или е в група "новини"
      if (user.role !== UserRole.ADMIN && (!user.groups || !user.groups.includes(UserGroup.NEWS))) {
        throw new AuthenticationError('You do not have permission to delete news');
      }
      
      try {
        const news = await News.findById(id);
        if (!news) {
          throw new Error('News item not found');
        }
        
        // Ако не е админ, проверяваме дали е автор на новината
        if (user.role !== UserRole.ADMIN && news.author.toString() !== user.id) {
          throw new AuthenticationError('You can only delete news you have created');
        }
        
        await News.findByIdAndDelete(id);
        return true;
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Error deleting news: ${err.message}`);
        }
        throw new Error('Unexpected error during news deletion');
      }
    }
  }
};