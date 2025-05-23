'use client';

import Link from 'next/link';
import { useState } from 'react';

// Предефинирани категории кампании с изображения от интернет и правилни хаштагове
const staticCategories = [
  {
    id: 'cysticfibrosis',
    title: 'Кистична фиброза',
    image: 'https://cdn.pixabay.com/photo/2017/08/07/18/46/lung-2606746_1280.jpg',
    link: '/campaigns/all?category=cysticfibrosis',
    count: 24,
    hashtag: 'cysticfibrosis'
  },
  {
    id: 'donate',
    title: 'Дарение',
    image: 'https://cdn.pixabay.com/photo/2017/09/07/08/54/money-2724241_1280.jpg',
    link: '/campaigns/all?category=donate',
    count: 18,
    hashtag: 'donate'
  },
  {
    id: 'support',
    title: 'Подкрепа',
    image: 'https://cdn.pixabay.com/photo/2017/05/04/16/37/meeting-2284501_1280.jpg',
    link: '/campaigns/all?category=support',
    count: 14,
    hashtag: 'support'
  },
  {
    id: 'financialsupport',
    title: 'Финансова помощ',
    image: 'https://cdn.pixabay.com/photo/2016/12/17/07/40/hand-1913337_1280.jpg',
    link: '/campaigns/all?category=financialsupport',
    count: 10,
    hashtag: 'financialsupport'
  }
];

interface CategoryCardsProps {
  title?: string;
  subtitle?: string;
}

export default function CategoryCards({ title, subtitle }: CategoryCardsProps) {
  const [topCategories] = useState(staticCategories);
  
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            {title ? (
              <>
                <h2 className="text-3xl font-bold">{title}</h2>
                {subtitle && <p className="text-gray-600 mt-2">{subtitle}</p>}
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold">Категории кампании</h2>
                <p className="text-gray-600 mt-2">Разгледайте кампаниите по вид</p>
              </>
            )}
          </div>
          
          <Link 
            href="/campaigns/all" 
            className="text-primary hover:underline flex items-center font-medium"
          >
            Вижте всички
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 justify-items-center">
          {topCategories.map((category) => (
            <Link
              key={category.id}
              href={`/campaigns/all?category=${category.hashtag}`}
              className="flex flex-col items-center transition-transform hover:scale-105"
            >
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden mb-4 shadow-lg">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-semibold text-center">{category.title}</h3>
              {category.count !== undefined && (
                <p className="text-sm text-gray-500">{category.count} кампании</p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
} 