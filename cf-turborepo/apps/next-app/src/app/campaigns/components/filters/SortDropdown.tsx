'use client';

import { CampaignSortOption } from '@/graphql/generated/graphql';

interface SortDropdownProps {
  value: CampaignSortOption;
  onChange: (value: CampaignSortOption) => void;
}

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
  const options = [
    { value: 'NEWEST', label: 'Най-нови' },
    { value: 'OLDEST', label: 'Най-стари' },
    { value: 'MOST_FUNDED', label: 'Най-много събрани средства' },
    { value: 'LEAST_FUNDED', label: 'Най-малко събрани средства' },
    { value: 'HIGHEST_GOAL', label: 'С най-висока цел' },
    { value: 'LOWEST_GOAL', label: 'С най-ниска цел' },
    { value: 'HIGHEST_RATED', label: 'Най-високо оценени' },
  ];

  return (
    <select 
      value={value} 
      onChange={(e) => onChange(e.target.value as CampaignSortOption)}
      className="select select-bordered w-full max-w-xs"
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
} 