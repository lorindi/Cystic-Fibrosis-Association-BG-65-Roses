import { HashtagService } from '../../services/hashtag.service';
import { AuthenticationError } from '../utils/errors';
import { ContextType, checkAuth } from '../utils/auth';
import { UserRole } from '../../types/user.types';
import Campaign from '../../models/campaign.model';
import { News, BlogPost, Recipe, Story } from '../../models/content.model';
import Initiative from '../../models/initiative.model';
import Event from '../../models/event.model';
import Conference from '../../models/conference.model';
import { StoreItem } from '../../models/store.model';
import Hashtag from '../../models/hashtag.model';
import { Model, Document } from 'mongoose';

// Интерфейс за общите свойства на моделите
interface BaseDocument extends Document {
  _id: any;
  title?: string;
  name?: string;
  description?: string;
  content?: string;
  hashtags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Интерфейс за колекцията
interface CollectionInfo {
  model: Model<any>;
  type: string;
  additionalFilter?: Record<string, any>;
}

export const hashtagResolvers = {
  Query: {
    searchHashtags: async (_: unknown, { query, category }: { query: string; category?: string }) => {
      return await HashtagService.searchHashtags(query, category);
    },

    getTrendingHashtags: async (_: unknown, { category, limit }: { category?: string; limit?: number }) => {
      return await HashtagService.getTrendingHashtags(category, limit);
    },

    getHashtagsByCategory: async (_: unknown, { category }: { category: string }) => {
      return await HashtagService.getHashtagsByCategory(category);
    },

    getAllHashtags: async (_: unknown, { page, limit }: { page: number; limit: number }) => {
      const skip = (page - 1) * limit;
      const [hashtags, totalCount] = await Promise.all([
        Hashtag.find().sort({ count: -1 }).skip(skip).limit(limit),
        Hashtag.countDocuments()
      ]);

      return {
        hashtags,
        totalCount,
        hasNextPage: skip + hashtags.length < totalCount
      };
    },

    searchByTag: async (
      _: unknown,
      { 
        tag, 
        page, 
        limit,
        categories 
      }: { 
        tag: string; 
        page: number; 
        limit: number;
        categories?: string[];
      }
    ) => {
      const skip = (page - 1) * limit;
      const query = { hashtags: tag };

      // Ако са подадени категории, ще търсим само в тях
      const categoryFilter = categories?.length ? { categories: { $in: categories } } : {};

      // Колекции, които ще търсим
      const collections: CollectionInfo[] = [
        { model: Campaign, type: 'campaign' },
        { model: News, type: 'news', additionalFilter: { ...categoryFilter } },
        { model: BlogPost, type: 'blog', additionalFilter: { ...categoryFilter } },
        { model: Story, type: 'story', additionalFilter: { ...categoryFilter } },
        { model: Recipe, type: 'recipe', additionalFilter: { ...categoryFilter } },
        { model: Initiative, type: 'initiative' },
        { model: Event, type: 'event' },
        { model: Conference, type: 'conference' },
        { model: StoreItem, type: 'product' }
      ];

      // Резултати от всички колекции
      const results = await Promise.all(
        collections.map(async ({ model, type, additionalFilter = {} }) => {
          const items = await model.find({ ...query, ...additionalFilter }).skip(skip).limit(limit) as BaseDocument[];
          return items.map((item: BaseDocument) => ({
            id: item._id.toString(),
            title: item.title || item.name || 'Без заглавие',
            description: item.description || item.content || '',
            hashtags: item.hashtags || [],
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            type
          }));
        })
      );

      // Обединяваме всички резултати
      const allItems = results.flat();

      // Общ брой резултати
      const totalCount = allItems.length;

      return {
        items: allItems,
        totalCount
      };
    }
  },

  Mutation: {
    createHashtag: async (
      _: unknown,
      { name, category }: { name: string; category: string },
      context: ContextType
    ) => {
      const user = checkAuth(context);
      
      // Само администратори могат да създават хаштагове ръчно
      if (user.role !== UserRole.ADMIN) {
        throw new AuthenticationError('Only administrators can create hashtags manually');
      }

      return await HashtagService.createOrUpdateHashtag(name, category);
    },

    removeHashtagFromCategory: async (
      _: unknown,
      { name, category }: { name: string; category: string },
      context: ContextType
    ) => {
      const user = checkAuth(context);
      
      // Само администратори могат да премахват хаштагове от категории
      if (user.role !== UserRole.ADMIN) {
        throw new AuthenticationError('Only administrators can remove hashtags from categories');
      }

      await HashtagService.decrementHashtagCount(name, category);
      return true;
    },

    addHashtagsToCampaign: async (
      _: unknown,
      { campaignId, hashtagIds }: { campaignId: string; hashtagIds: string[] },
      context: ContextType
    ) => {
      const user = checkAuth(context);
      
      // Намираме кампанията
      const campaign = await Campaign.findById(campaignId);
      if (!campaign) {
        throw new Error('Campaign not found');
      }

      // Проверяваме дали потребителят има права да редактира кампанията
      if (campaign.createdBy.toString() !== user.id && user.role !== UserRole.ADMIN) {
        throw new AuthenticationError('You do not have permission to edit this campaign');
      }

      // Намираме хаштаговете
      const hashtags = await Hashtag.find({ _id: { $in: hashtagIds } });
      if (hashtags.length !== hashtagIds.length) {
        throw new Error('Some hashtags were not found');
      }

      // Добавяме хаштаговете към кампанията
      const hashtagNames = hashtags.map(h => h.name);
      campaign.hashtags = [...new Set([...campaign.hashtags, ...hashtagNames])];

      // Увеличаваме броячите на хаштаговете
      await Promise.all(
        hashtags.map(hashtag => 
          HashtagService.createOrUpdateHashtag(hashtag.name, 'campaign')
        )
      );

      // Запазваме промените
      await campaign.save();
      return campaign;
    },

    removeHashtagsFromCampaign: async (
      _: unknown,
      { campaignId, hashtagIds }: { campaignId: string; hashtagIds: string[] },
      context: ContextType
    ) => {
      const user = checkAuth(context);
      
      // Намираме кампанията
      const campaign = await Campaign.findById(campaignId);
      if (!campaign) {
        throw new Error('Campaign not found');
      }

      // Проверяваме дали потребителят има права да редактира кампанията
      if (campaign.createdBy.toString() !== user.id && user.role !== UserRole.ADMIN) {
        throw new AuthenticationError('You do not have permission to edit this campaign');
      }

      // Намираме хаштаговете
      const hashtags = await Hashtag.find({ _id: { $in: hashtagIds } });
      const hashtagNames = hashtags.map(h => h.name);

      // Премахваме хаштаговете от кампанията
      campaign.hashtags = campaign.hashtags.filter(tag => !hashtagNames.includes(tag));

      // Намаляваме броячите на хаштаговете
      await Promise.all(
        hashtagNames.map(name => 
          HashtagService.decrementHashtagCount(name, 'campaign')
        )
      );

      // Запазваме промените
      await campaign.save();
      return campaign;
    }
  }
}; 