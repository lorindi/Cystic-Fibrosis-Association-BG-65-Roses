import { useState, useCallback } from 'react';
import { CampaignFilterInput, CampaignSortOption } from '@/graphql/generated/graphql';

export function useCampaignFilters() {
  const [filters, setFilters] = useState<CampaignFilterInput>({
    isActive: true,
    sortBy: 'NEWEST' as CampaignSortOption,
  });

  const updateSortBy = useCallback((sortBy: CampaignSortOption) => {
    setFilters(prev => ({ ...prev, sortBy }));
  }, []);

  const updateActiveFilter = useCallback((isActive: boolean | null) => {
    setFilters(prev => ({ 
      ...prev, 
      isActive: isActive === null ? undefined : isActive 
    }));
  }, []);

  const updateRatingFilter = useCallback((minRating?: number) => {
    setFilters(prev => ({ ...prev, minRating }));
  }, []);

  const updateGoalFilters = useCallback((minGoal?: number, maxGoal?: number) => {
    setFilters(prev => ({ ...prev, minGoal, maxGoal }));
  }, []);

  const updateEventFilter = useCallback((hasEvents?: boolean) => {
    setFilters(prev => ({ ...prev, hasEvents }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      isActive: true,
      sortBy: 'NEWEST' as CampaignSortOption,
    });
  }, []);

  return {
    filters,
    updateSortBy,
    updateActiveFilter,
    updateRatingFilter,
    updateGoalFilters,
    updateEventFilter,
    resetFilters,
  };
} 