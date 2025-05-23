import { useQuery } from '@apollo/client';
import { GET_FILTERED_CAMPAIGNS } from '../graphql/queries';
import { CampaignFilterInput, CampaignSortOption } from '@/graphql/generated/graphql';

export interface CampaignSection {
  title: string;
  subtitle?: string;
  viewAllLink?: string;
  campaigns: any[];
  loading: boolean;
  error?: any;
}

export function useCampaignSections() {
  // Активни кампании
  const { data: activeData, loading: activeLoading, error: activeError } = useQuery(GET_FILTERED_CAMPAIGNS, {
    variables: {
      filter: {
        isActive: true,
        sortBy: 'NEWEST' as CampaignSortOption
      },
      limit: 4,
      noLimit: false
    }
  });

  // Най-популярни (с най-висок рейтинг)
  const { data: popularData, loading: popularLoading, error: popularError } = useQuery(GET_FILTERED_CAMPAIGNS, {
    variables: {
      filter: {
        sortBy: 'HIGHEST_RATED' as CampaignSortOption
      },
      limit: 4,
      noLimit: false
    }
  });

  // С най-много събрани средства
  const { data: mostFundedData, loading: mostFundedLoading, error: mostFundedError } = useQuery(GET_FILTERED_CAMPAIGNS, {
    variables: {
      filter: {
        sortBy: 'MOST_FUNDED' as CampaignSortOption
      },
      limit: 4,
      noLimit: false
    }
  });

  // С най-много събития
  const { data: withEventsData, loading: withEventsLoading, error: withEventsError } = useQuery(GET_FILTERED_CAMPAIGNS, {
    variables: {
      filter: {
        hasEvents: true,
        sortBy: 'NEWEST' as CampaignSortOption
      },
      limit: 4,
      noLimit: false
    }
  });

  const sections: CampaignSection[] = [
    {
      title: 'Активни кампании',
      subtitle: 'Кампании, които в момента събират средства',
      viewAllLink: '/campaigns/active',
      campaigns: activeData?.getFilteredCampaigns || [],
      loading: activeLoading,
      error: activeError
    },
    {
      title: 'Най-популярни кампании',
      subtitle: 'Кампании с най-високи оценки от дарителите',
      viewAllLink: '/campaigns/popular',
      campaigns: popularData?.getFilteredCampaigns || [],
      loading: popularLoading,
      error: popularError
    },
    {
      title: 'Най-успешни кампании',
      subtitle: 'Кампании с най-много събрани средства',
      viewAllLink: '/campaigns/most-funded',
      campaigns: mostFundedData?.getFilteredCampaigns || [],
      loading: mostFundedLoading,
      error: mostFundedError
    },
    {
      title: 'Кампании със събития',
      subtitle: 'Кампании, които включват предстоящи събития',
      viewAllLink: '/campaigns/with-events',
      campaigns: withEventsData?.getFilteredCampaigns || [],
      loading: withEventsLoading,
      error: withEventsError
    }
  ];

  return { sections };
} 