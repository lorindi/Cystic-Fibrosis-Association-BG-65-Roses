import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_FILTERED_CAMPAIGNS } from '../graphql/queries';
import { CampaignFilterInput } from '@/graphql/generated/graphql';

export function useCampaigns(filters: CampaignFilterInput) {
  const [offset, setOffset] = useState(0);
  const limit = 10;

  const { data, loading, error, fetchMore, refetch } = useQuery(GET_FILTERED_CAMPAIGNS, {
    variables: {
      filter: filters,
      limit,
      offset,
      noLimit: false
    },
    notifyOnNetworkStatusChange: true,
  });

  const campaigns = data?.getFilteredCampaigns || [];

  const loadMore = () => {
    if (loading || !data?.getFilteredCampaigns?.length) return;
    
    const newOffset = offset + limit;
    setOffset(newOffset);
    
    fetchMore({
      variables: {
        filter: filters,
        limit,
        offset: newOffset,
        noLimit: false
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          getFilteredCampaigns: [
            ...prev.getFilteredCampaigns,
            ...fetchMoreResult.getFilteredCampaigns,
          ],
        };
      },
    });
  };

  return {
    campaigns,
    loading,
    error,
    loadMore,
    refetch: () => {
      setOffset(0);
      refetch({ filter: filters, limit, offset: 0, noLimit: false });
    },
  };
} 