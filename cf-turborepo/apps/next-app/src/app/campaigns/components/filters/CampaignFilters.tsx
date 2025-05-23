'use client';

import { CampaignFilterInput, CampaignSortOption } from '@/graphql/generated/graphql';
import SortDropdown from './SortDropdown';
import ActiveFilter from './ActiveFilter';
import RatingFilter from './RatingFilter';
import EventsFilter from './EventsFilter';

interface CampaignFiltersProps {
  filters: CampaignFilterInput;
  onSortChange: (value: CampaignSortOption) => void;
  onActiveFilterChange: (value: boolean | null) => void;
  onRatingFilterChange: (value?: number) => void;
  onEventFilterChange?: (value?: boolean) => void;
  onGoalFiltersChange?: (min?: number, max?: number) => void;
  onReset: () => void;
}

export default function CampaignFilters({
  filters,
  onSortChange,
  onActiveFilterChange,
  onRatingFilterChange,
  onEventFilterChange,
  onGoalFiltersChange,
  onReset,
}: CampaignFiltersProps) {
  return (
    <div className="bg-base-200 p-4 rounded-lg mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
        <h2 className="text-lg font-semibold mb-2 md:mb-0">Филтри</h2>
        
        <div className="flex items-center gap-4">
          <div>
            <label className="mr-2 font-medium">Сортиране:</label>
            <SortDropdown
              value={filters.sortBy || 'NEWEST'}
              onChange={onSortChange}
            />
          </div>
          
          <button
            onClick={onReset}
            className="btn btn-sm btn-outline"
          >
            Изчисти филтрите
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <ActiveFilter
          value={filters.isActive}
          onChange={onActiveFilterChange}
        />
        
        <RatingFilter
          value={filters.minRating}
          onChange={onRatingFilterChange}
        />
        
        {onEventFilterChange && (
          <EventsFilter
            value={filters.hasEvents}
            onChange={onEventFilterChange}
          />
        )}
        
        {onGoalFiltersChange && (
          <div className="flex flex-col space-y-2">
            <h3 className="font-medium">Цел на кампанията</h3>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Мин"
                className="input input-bordered input-sm w-24"
                value={filters.minGoal || ''}
                onChange={(e) => {
                  const val = e.target.value ? parseFloat(e.target.value) : undefined;
                  onGoalFiltersChange(val, filters.maxGoal);
                }}
              />
              <span>до</span>
              <input
                type="number"
                placeholder="Макс"
                className="input input-bordered input-sm w-24"
                value={filters.maxGoal || ''}
                onChange={(e) => {
                  const val = e.target.value ? parseFloat(e.target.value) : undefined;
                  onGoalFiltersChange(filters.minGoal, val);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 