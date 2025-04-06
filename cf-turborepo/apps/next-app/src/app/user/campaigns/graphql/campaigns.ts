import { gql } from "@apollo/client";

export const GET_CAMPAIGNS = gql`
  query GetCampaigns {
    getCampaigns {
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
        date
      }
      participantsCount
      pendingParticipantsCount
    }
  }
`;

export const GET_USER_CAMPAIGNS = gql`
  query GetUserCampaigns {
    getUserCampaigns {
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
        date
      }
      participantsCount
    }
  }
`;

export const GET_USER_CAMPAIGN_STATUS = gql`
  query GetUserCampaignStatus {
    getUserCampaignStatus {
      campaign {
        id
        title
      }
      status
      registeredAt
    }
  }
`;

export const JOIN_CAMPAIGN = gql`
  mutation JoinCampaign($id: ID!) {
    joinCampaign(id: $id) {
      id
      title
      pendingParticipantsCount
    }
  }
`;

export const LEAVE_CAMPAIGN = gql`
  mutation LeaveCampaign($id: ID!) {
    leaveCampaign(id: $id) {
      id
      title
      participantsCount
    }
  }
`;

export const GET_CAMPAIGN_DETAILS = gql`
  query GetCampaign($id: ID!) {
    getCampaign(id: $id) {
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
    }
  }
`; 