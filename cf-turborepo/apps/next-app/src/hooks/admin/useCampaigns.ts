import { useQuery, useMutation } from '@apollo/client';
import { 
  GetCampaignsQuery, 
  GetCampaignsQueryVariables, 
  GetCampaignQuery,
  GetCampaignQueryVariables
} from '@/graphql/generated/graphql';
import { GET_CAMPAIGNS, GET_CAMPAIGN } from '@/graphql/queries/admin';
import { gql } from '@apollo/client';

// Define campaign mutations
const CREATE_CAMPAIGN = gql`
  mutation CreateCampaign($input: CampaignInput!) {
    createCampaign(input: $input) {
      id
      title
      description
      goal
      currentAmount
      startDate
      endDate
      events {
        id
        title
        description
        date
        location
      }
      participantsCount
      pendingParticipantsCount
    }
  }
`;

const UPDATE_CAMPAIGN = gql`
  mutation UpdateCampaign($id: ID!, $input: CampaignInput!) {
    updateCampaign(id: $id, input: $input) {
      id
      title
      description
      goal
      currentAmount
      startDate
      endDate
      events {
        id
        title
        description
        date
        location
      }
      participantsCount
      pendingParticipantsCount
    }
  }
`;

const DELETE_CAMPAIGN = gql`
  mutation DeleteCampaign($id: ID!) {
    deleteCampaign(id: $id)
  }
`;

interface UseCampaignsOptions {
  noLimit?: boolean;
}

export const useCampaigns = (options: UseCampaignsOptions = {}) => {
  const { data, loading, error, refetch } = useQuery<GetCampaignsQuery, GetCampaignsQueryVariables>(
    GET_CAMPAIGNS,
    {
      variables: {
        noLimit: options.noLimit
      }
    }
  );

  const [createCampaignMutation, createCampaignResult] = useMutation(CREATE_CAMPAIGN);
  const [updateCampaignMutation, updateCampaignResult] = useMutation(UPDATE_CAMPAIGN);
  const [deleteCampaignMutation, deleteCampaignResult] = useMutation(DELETE_CAMPAIGN);

  return {
    campaigns: data?.getCampaigns || [],
    loading,
    error,
    refetch,
    createCampaign: createCampaignMutation,
    updateCampaign: updateCampaignMutation,
    deleteCampaign: deleteCampaignMutation,
    createCampaignResult,
    updateCampaignResult,
    deleteCampaignResult
  };
};

export const useCampaign = (id: string) => {
  const { data, loading, error, refetch } = useQuery<GetCampaignQuery, GetCampaignQueryVariables>(
    GET_CAMPAIGN,
    {
      variables: {
        id
      },
      fetchPolicy: "network-only"
    }
  );

  return {
    campaign: data?.getCampaign,
    loading,
    error,
    refetch
  };
}; 