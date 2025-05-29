'use client';

import { Campaign } from '@/graphql/generated/graphql';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { useState } from 'react';

interface CampaignCardProps {
  campaign: Campaign;
}

export default function CampaignCard({ campaign }: CampaignCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  
  const {
    id,
    title,
    description,
    goal,
    currentAmount,
    percentCompleted,
    startDate,
    endDate,
    isActive,
    images,
    totalRating,
    ratingCount,
    hashtags
  } = campaign;

  // Съкратено описание за картата
  const truncatedDescription = description.length > 80
    ? `${description.substring(0, 80)}...`
    : description;

  // Форматиране на сумите
  const formattedGoal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(goal);

  const formattedCurrentAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(currentAmount);

  // Показване на максимум 2 хаштага
  const displayHashtags = hashtags && hashtags.length > 0 
    ? hashtags.slice(0, 2) 
    : [];
    
  // Предотвратяване на bubble-up на клика върху сърцето
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="card-container relative bg-white rounded-3xl shadow-md overflow-hidden w-full h-[350px] group">
      {/* Горна част с изображение */}
      <div className="relative w-full h-1/2">
        {images && images.length > 0 ? (
          <Image
            src={images[0]}
            alt={title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover"
            onError={(e) => {
              // Използваме резервно изображение, ако основното не се зареди
              const target = e.target as HTMLImageElement;
              target.src = `https://picsum.photos/800/600?random=${id}`;
            }}
          />
        ) : (
          <div className="bg-gray-200 h-full w-full flex items-center justify-center">
            <span className="text-gray-400">No image</span>
          </div>
        )}
        
        {/* Status badge */}
        {!isActive && (
          <div className="absolute top-4 left-4 z-20 bg-gray-800 text-white px-3 py-1 rounded-full text-xs font-medium">
            Completed
          </div>
        )}
      </div>
      
      {/* Долна част със заглавие */}
      <div className="p-4 flex flex-col justify-between h-1/2">
        <div>
          {/* Тагове */}
          {displayHashtags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-1">
              {displayHashtags.map((tag) => (
                <span 
                  key={tag} 
                  className="text-xs px-3 py-1 rounded-full border border-gray-200 text-gray-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          <h2 className="text-lg font-bold text-gray-800 line-clamp-2">{title}</h2>
        </div>
      </div>

      {/* Бутон за любими */}
      <button 
        onClick={handleFavoriteClick}
        className="absolute top-4 right-4 z-10 bg-white bg-opacity-80 p-2 rounded-full shadow-sm hover:bg-opacity-100 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        {isFavorite ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#ff3b5c" stroke="#ff3b5c" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        )}
      </button>

      {/* Самостоятелен бутон за детайли - специално за достъпност */}
      <Link 
        href={`/campaigns/${id}`}
        className="absolute bottom-4 right-4 z-10 bg-teal-700 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-teal-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
        aria-label={`View details for campaign: ${title}`}
      >
        View details
      </Link>
    </div>
  );
} 