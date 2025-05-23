'use client';

import Link from 'next/link';
import { Campaign } from '@/graphql/generated/graphql';
import CampaignCard from './CampaignCard';
import { CampaignSection as CampaignSectionType } from '../hooks/useCampaignSections';

interface CampaignSectionProps {
  section: CampaignSectionType;
}

export default function CampaignSection({ section }: CampaignSectionProps) {
  const { title, subtitle, viewAllLink, campaigns, loading, error } = section;

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-base-content">{title}</h2>
          {subtitle && <p className="text-base-content/70 mt-1">{subtitle}</p>}
        </div>
        {viewAllLink && (
          <Link href={viewAllLink} className="text-primary hover:underline flex items-center">
            Вижте всички
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="loading loading-spinner loading-lg text-primary"></div>
        </div>
      )}

      {error && (
        <div className="bg-error/10 text-error rounded-lg p-4 mb-6">
          Възникна грешка при зареждане на кампаниите
        </div>
      )}

      {!loading && campaigns.length === 0 && (
        <div className="bg-base-200 rounded-lg p-8 text-center">
          <p className="text-base-content/70">Няма налични кампании в тази категория</p>
        </div>
      )}

      {!loading && campaigns.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {campaigns.map((campaign: Campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      )}
    </section>
  );
} 