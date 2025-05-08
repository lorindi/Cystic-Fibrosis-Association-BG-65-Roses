import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { 
  GetCampaignQuery,
  GetCampaignQueryVariables,
  GetPendingCampaignRequestsQuery,
  GetPendingCampaignRequestsQueryVariables
} from '@/graphql/generated/graphql';

// Query for getting pending participants
const GET_PENDING_CAMPAIGN_REQUESTS = gql`
  query GetPendingCampaignRequests($limit: Int, $offset: Int, $noLimit: Boolean) {
    getPendingCampaignRequests(limit: $limit, offset: $offset, noLimit: $noLimit) {
      id
      title
      pendingParticipants {
        _id
        name
        email
        role
      }
      pendingParticipantsCount
    }
  }
`;

// Mutation for approving a participant
const APPROVE_CAMPAIGN_PARTICIPANT = gql`
  mutation ApproveCampaignParticipant($campaignId: ID!, $userId: ID!) {
    approveCampaignParticipant(campaignId: $campaignId, userId: $userId) {
      id
      title
      participants {
        _id
        name
        email
        role
      }
      participantsCount
      pendingParticipants {
        _id
        name
        email
        role
      }
      pendingParticipantsCount
    }
  }
`;

// Mutation for rejecting a participant
const REJECT_CAMPAIGN_PARTICIPANT = gql`
  mutation RejectCampaignParticipant($campaignId: ID!, $userId: ID!) {
    rejectCampaignParticipant(campaignId: $campaignId, userId: $userId) {
      id
      title
      pendingParticipants {
        _id
        name
        email
        role
      }
      pendingParticipantsCount
    }
  }
`;

interface UseCampaignParticipantsOptions {
  limit?: number;
  offset?: number;
  noLimit?: boolean;
}

export const useCampaignParticipants = (options: UseCampaignParticipantsOptions = {}) => {
  const { data: pendingData, loading: pendingLoading, error: pendingError, refetch: refetchPending } = 
    useQuery<GetPendingCampaignRequestsQuery, GetPendingCampaignRequestsQueryVariables>(
      GET_PENDING_CAMPAIGN_REQUESTS,
      {
        variables: {
          limit: options.limit,
          offset: options.offset,
          noLimit: options.noLimit
        }
      }
    );

  const [approveParticipantMutation, approveParticipantResult] = useMutation(APPROVE_CAMPAIGN_PARTICIPANT);
  const [rejectParticipantMutation, rejectParticipantResult] = useMutation(REJECT_CAMPAIGN_PARTICIPANT);

  return {
    pendingCampaigns: pendingData?.getPendingCampaignRequests || [],
    pendingLoading,
    pendingError,
    refetchPending,
    approveParticipant: approveParticipantMutation,
    rejectParticipant: rejectParticipantMutation,
    approveParticipantResult,
    rejectParticipantResult
  };
}; 