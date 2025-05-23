'use client';

import { Campaign } from '@/graphql/generated/graphql';
import { ApolloError } from '@apollo/client';
import CampaignCard from './CampaignCard';

interface CampaignListProps {
  campaigns: Campaign[];
  loading: boolean;
  error?: ApolloError;
  onLoadMore: () => void;
  isAuthenticated: boolean;
  currentUserId?: string;
}

export default function CampaignList({
  campaigns,
  loading,
  error,
  onLoadMore,
  isAuthenticated,
  currentUserId,
}: CampaignListProps) {
  if (error) {
    return (
      <div className="my-8 p-6 bg-error/10 rounded-lg text-center">
        <h3 className="text-lg font-semibold text-error mb-2">Възникна грешка</h3>
        <p className="text-base-content/70">Не успяхме да заредим кампаниите. Моля, опитайте отново по-късно.</p>
        <p className="text-xs mt-2 text-base-content/50">{error.message}</p>
      </div>
    );
  }

  if (!loading && (!campaigns || campaigns.length === 0)) {
    return (
      <div className="my-8 p-6 bg-base-200 rounded-lg text-center">
        <h3 className="text-lg font-semibold mb-2">Няма намерени кампании</h3>
        <p className="text-base-content/70">
          Не открихме кампании, отговарящи на зададените филтри. Моля, променете филтрите или опитайте по-късно.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {campaigns.map((campaign) => (
          <CampaignCard
            key={campaign.id}
            campaign={campaign}
          />
        ))}
      </div>

      {loading && (
        <div className="flex justify-center my-8">
          <div className="loading loading-spinner loading-lg text-primary"></div>
        </div>
      )}

      {!loading && campaigns.length > 0 && (
        <div className="flex justify-center my-8">
          <button
            onClick={onLoadMore}
            className="btn btn-outline btn-primary"
            disabled={loading}
          >
            Зареди още кампании
          </button>
        </div>
      )}
    </div>
  );
} 