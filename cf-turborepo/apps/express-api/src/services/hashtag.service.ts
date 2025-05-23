import Hashtag, { IHashtagDocument } from '../models/hashtag.model';

export class HashtagService {
  /**
   * Извлича хаштагове от текст
   */
  static extractHashtags(text: string): string[] {
    const hashtagRegex = /#[\wа-яА-Я]+/g;
    const matches = text.match(hashtagRegex);
    return matches ? [...new Set(matches)] : [];
  }

  /**
   * Създава или обновява хаштаг
   */
  static async createOrUpdateHashtag(name: string, category: string): Promise<IHashtagDocument> {
    const formattedName = name.startsWith('#') ? name.substring(1).toLowerCase() : name.toLowerCase();
    
    const hashtag = await Hashtag.findOne({ name: formattedName });
    
    if (hashtag) {
      if (!hashtag.categories.includes(category)) {
        hashtag.categories.push(category);
      }
      hashtag.count += 1;
      return await hashtag.save();
    }

    return await Hashtag.create({
      name: formattedName,
      count: 1,
      categories: [category]
    });
  }

  /**
   * Обработва масив от хаштагове за даден контент
   */
  static async processHashtags(hashtags: string[], category: string): Promise<IHashtagDocument[]> {
    const processedHashtags = [];
    
    for (const tag of hashtags) {
      const hashtag = await this.createOrUpdateHashtag(tag, category);
      processedHashtags.push(hashtag);
    }
    
    return processedHashtags;
  }

  /**
   * Намалява брояча на хаштаг
   */
  static async decrementHashtagCount(name: string, category: string): Promise<void> {
    const formattedName = name.startsWith('#') ? name.substring(1).toLowerCase() : name.toLowerCase();
    
    const hashtag = await Hashtag.findOne({ name: formattedName });
    
    if (hashtag) {
      hashtag.count -= 1;
      
      if (hashtag.count <= 0) {
        // Ако хаштагът не се използва никъде, го премахваме от категорията
        hashtag.categories = hashtag.categories.filter(cat => cat !== category);
        
        if (hashtag.categories.length === 0) {
          // Ако хаштагът не се използва в никоя категория, го изтриваме
          await Hashtag.deleteOne({ _id: hashtag._id });
        } else {
          await hashtag.save();
        }
      } else {
        await hashtag.save();
      }
    }
  }

  /**
   * Търси хаштагове по име
   */
  static async searchHashtags(query: string, category?: string): Promise<IHashtagDocument[]> {
    const searchQuery: any = {
      name: { $regex: query, $options: 'i' }
    };
    
    if (category) {
      searchQuery.categories = category;
    }
    
    return await Hashtag.find(searchQuery)
      .sort({ count: -1 })
      .limit(10);
  }

  /**
   * Взима най-популярните хаштагове
   */
  static async getTrendingHashtags(category?: string, limit: number = 10): Promise<IHashtagDocument[]> {
    const query = category ? { categories: category } : {};
    
    return await Hashtag.find(query)
      .sort({ count: -1 })
      .limit(limit);
  }

  /**
   * Взима всички хаштагове за дадена категория
   */
  static async getHashtagsByCategory(category: string): Promise<IHashtagDocument[]> {
    return await Hashtag.find({ categories: category })
      .sort({ count: -1 });
  }
} 