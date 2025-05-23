import { useQuery } from '@apollo/client';
import { GET_HASHTAGS_BY_CATEGORY } from '../graphql/queries';
import { useState, useEffect } from 'react';

// Дефиниране на интерфейс за хаштаг от бекенда
interface Hashtag {
  name: string;
  count: number;
}

// Типизиране на групите хаштагове
const hashtagGroups: Record<string, string[]> = {
  'Медицински': ['treatment', 'therapy', 'rehabilitation', 'medicalequipment', 'medicalsupplies', 'physiotherapy', 'breathingexercises'],
  'Образование': ['education', 'educationalinitiative', 'educationalmeetings', 'educationalcontent'],
  'Събития': ['event', 'charityevent', 'sportsevent', 'communityevents'],
  'Научни изследвания': ['research', 'clinicaltrials', 'scientificresults', 'medicaldiscoveries'],
  'Подкрепа': ['support', 'donate', 'charity', 'volunteer', 'fundraising', 'help', 'together'],
  'Кистична фиброза': ['cysticfibrosis', '65roses', 'lunghealth', 'qualityoflife', 'raredisease', 'geneticdisease'],
  'Финансови': ['emergencyhelp', 'financialsupport', 'medicalexpenses', 'equipmentpurchase', 'fundraiser', 'donationaccount', 'transparency', 'accountability']
};

// Типизиране на картинки за групите - тези стойности ще бъдат заменени в CategoryCards.tsx
const groupImages: Record<string, string> = {
  'Медицински': '/images/default.jpg',
  'Образование': '/images/default.jpg',
  'Събития': '/images/default.jpg',
  'Научни изследвания': '/images/default.jpg',
  'Подкрепа': '/images/default.jpg',
  'Кистична фиброза': '/images/default.jpg',
  'Финансови': '/images/default.jpg'
};

export interface HashtagCategory {
  id: string;
  title: string;
  image: string;
  link: string;
  hashtags: string[];
  count?: number; // Общ брой на хаштаговете в тази категория
}

export function useHashtagCategories() {
  const [categories, setCategories] = useState<HashtagCategory[]>([]);
  
  // Извличаме хаштагове от категория campaign
  const { data, loading, error } = useQuery(GET_HASHTAGS_BY_CATEGORY, {
    variables: { category: 'campaign' },
    fetchPolicy: 'network-only',
    onError: (error) => {
      console.error('Error fetching hashtags:', error);
    }
  });

  useEffect(() => {
    if (data?.getHashtagsByCategory && Array.isArray(data.getHashtagsByCategory)) {
      try {
        // Събираме хаштагове по групи
        const hashtags = data.getHashtagsByCategory as Hashtag[];
        const groupedCategories: HashtagCategory[] = [];

        // За всяка група от хаштагове
        Object.entries(hashtagGroups).forEach(([groupName, groupTags]) => {
          // Филтрираме хаштаговете, които принадлежат на тази група
          const matchingHashtags = hashtags.filter(
            (hashtag: Hashtag) => groupTags.includes(hashtag.name)
          );

          // Ако има хаштагове в тази група, създаваме категория
          if (matchingHashtags.length > 0) {
            // Намираме хаштага с най-висок count, за да го използваме като основен за категорията
            const primaryHashtag = matchingHashtags.reduce(
              (max: Hashtag, tag: Hashtag) => (tag.count > max.count ? tag : max),
              matchingHashtags[0]
            );

            // Добавяме категория
            groupedCategories.push({
              id: primaryHashtag.name,
              title: groupName,
              image: groupImages[groupName] || '/images/categories/default.jpg',
              link: `/campaigns/all?category=${primaryHashtag.name}`,
              hashtags: matchingHashtags.map((tag: Hashtag) => tag.name),
              count: matchingHashtags.reduce((sum: number, tag: Hashtag) => sum + tag.count, 0)
            });
          }
        });

        // Сортираме категориите по общ брой хаштагове (от най-популярните към най-малко популярните)
        groupedCategories.sort((a, b) => (b.count || 0) - (a.count || 0));
        
        setCategories(groupedCategories);
      } catch (err) {
        console.error('Error processing hashtags:', err);
      }
    }
  }, [data]);

  return {
    categories,
    loading,
    error
  };
} 