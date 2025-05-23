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
    <div className="card-container relative transition-all duration-300 hover:scale-105">
      <Link href={`/campaigns/${id}`}>
        <div className="relative bg-white rounded-3xl shadow-md overflow-hidden w-full h-[450px] group">
          {/* Image that covers the entire card */}
          <div className="absolute inset-0 w-full h-full transition-all duration-500 group-hover:h-1/2 z-0">
            {images && images.length > 0 ? (
              <Image
                src={images[0]}
                alt={title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="bg-gray-200 h-full w-full flex items-center justify-center">
                <span className="text-gray-400">No image</span>
              </div>
            )}
            
            {/* Dark overlay for better text visibility */}
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          </div>
          
          {/* Favorite button */}
          <button 
            onClick={handleFavoriteClick}
            className="absolute top-4 right-4 z-10 bg-white bg-opacity-80 p-2 rounded-full shadow-sm hover:bg-opacity-100 transition-all"
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
          
          {/* Status badge */}
          {!isActive && (
            <div className="absolute top-4 left-4 z-10 bg-gray-800 text-white px-3 py-1 rounded-full text-xs font-medium">
              Completed
            </div>
          )}
          
          {/* Content area with relative positioning and higher z-index */}
          <div className="absolute inset-0 z-10 flex flex-col justify-between p-5 text-white">
            {/* Top section with title and hashtags */}
            <div className="mt-4">
              <h2 className="text-2xl font-bold">{title}</h2>
              {displayHashtags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {displayHashtags.map((tag) => (
                    <span 
                      key={tag} 
                      className="text-xs font-medium text-white/90"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            {/* Bottom section with campaign details */}
            <div className="bg-white bg-opacity-90 text-gray-800 p-4 rounded-xl backdrop-blur-sm">
              {/* Progress section */}
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Collected</span>
                  <span className="font-semibold">{Math.round(percentCompleted)}% of goal</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600" 
                    style={{ width: `${percentCompleted}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="font-bold">{formattedCurrentAmount}</span>
                  <span className="text-gray-500">from {formattedGoal}</span>
                </div>
              </div>
              
              {/* Dates section */}
              <div className="flex justify-between text-xs text-gray-500 mb-3">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {formatDate(startDate)}
                </div>
                {endDate && (
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {formatDate(endDate)}
                  </div>
                )}
              </div>
              
              {/* Rating section - only if there are ratings */}
              {totalRating !== undefined && ratingCount && ratingCount > 0 && (
                <div className="flex items-center mb-3 text-sm">
                  <div className="flex items-center text-yellow-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star}>
                        {star <= Math.round(totalRating ?? 0) ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        )}
                      </span>
                    ))}
                  </div>
                  <span className="ml-1 text-gray-500">({ratingCount} ratings)</span>
                </div>
              )}
              
              {/* Smaller action button */}
              <div className="flex justify-center">
                <button className="bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors inline-block">
                  View campaign
                </button>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
} 