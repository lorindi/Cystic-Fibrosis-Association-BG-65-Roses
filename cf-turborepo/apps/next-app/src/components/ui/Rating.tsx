'use client';

import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface RatingProps {
  value: number | null;
  onChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Rating = ({ 
  value, 
  onChange, 
  readonly = false, 
  size = 'md',
  className = ''
}: RatingProps) => {
  const maxRating = 5;
  
  // Определяме размера на звездите според пропа size
  const starSizeClass = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }[size];
  
  // Цветове за звездите
  const activeColor = 'text-yellow-400';
  const inactiveColor = 'text-gray-300';
  
  const handleValueChange = (value: string) => {
    if (readonly) return;
    onChange?.(parseInt(value, 10));
  };
  
  // Рендерираме визуално звезди
  const renderStars = () => {
    return [...Array(maxRating)].map((_, index) => {
      const ratingValue = index + 1;
      const isActive = value !== null && ratingValue <= value;
      
      return (
        <div 
          key={ratingValue}
          className={cn(
            "relative flex items-center justify-center",
            readonly ? "pointer-events-none" : "cursor-pointer"
          )}
        >
          {/* Радио бутон (невидим) */}
          <RadioGroupItem 
            value={ratingValue.toString()} 
            id={`rating-${ratingValue}`} 
            className="sr-only"
          />
          
          {/* Звезда */}
          <Label 
            htmlFor={`rating-${ratingValue}`}
            className="cursor-pointer"
          >
            {isActive ? (
              <svg 
                className={cn(starSizeClass, activeColor)}
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ) : (
              <svg 
                className={cn(starSizeClass, inactiveColor, !readonly && "hover:text-yellow-300")}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
              </svg>
            )}
          </Label>
        </div>
      );
    });
  };
  
  if (readonly) {
    // За read-only просто показваме звезди
    return (
      <div className={cn("flex items-center space-x-1", className)}>
        {renderStars()}
      </div>
    );
  }
  
  return (
    <RadioGroup 
      value={value?.toString() || ""} 
      onValueChange={handleValueChange}
      className={cn("flex items-center space-x-1", className)}
    >
      {renderStars()}
    </RadioGroup>
  );
}; 