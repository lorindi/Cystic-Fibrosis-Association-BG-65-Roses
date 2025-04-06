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
        description
        date
        location
      }
      participantsCount
      pendingParticipantsCount
    }
  }
`;

export const GET_CAMPAIGN = gql`
  query GetCampaign($id: ID!) {
    getCampaign(id: $id) {
      id
      title
      description
      goal
      currentAmount
      startDate
      endDate
      createdAt
      updatedAt
      createdBy {
        id
        name
        email
        role
      }
      events {
        id
        title
        description
        date
        location
      }
      participants {
        id
        name
        email
        role
      }
      pendingParticipants {
        id
        name
        email
        role
      }
      participantsCount
      pendingParticipantsCount
    }
  }
`;

export const GET_CAMPAIGN_EVENTS = gql`
  query GetCampaignEvents($campaignId: ID!) {
    getCampaignEvents(campaignId: $campaignId) {
      id
      title
      description
      date
      location
    }
  }
`;

export const GET_PENDING_CAMPAIGN_REQUESTS = gql`
  query GetPendingCampaignRequests {
    getPendingCampaignRequests {
      id
      title
      startDate
      endDate
      pendingParticipants {
        id
        name
        email
        role
      }
      pendingParticipantsCount
    }
  }
`;

export const CREATE_CAMPAIGN = gql`
  mutation CreateCampaign(
    $input: CampaignInput!
  ) {
    createCampaign(
      input: $input
    ) {
      id
      title
      description
      goal
      startDate
      endDate
    }
  }
`;

export const UPDATE_CAMPAIGN = gql`
  mutation UpdateCampaign(
    $id: ID!
    $input: CampaignInput!
  ) {
    updateCampaign(
      id: $id
      input: $input
    ) {
      id
      title
      description
      goal
      startDate
      endDate
    }
  }
`;

export const DELETE_CAMPAIGN = gql`
  mutation DeleteCampaign($id: ID!) {
    deleteCampaign(id: $id)
  }
`;

export const ADD_CAMPAIGN_EVENT = gql`
  mutation AddCampaignEvent($campaignId: ID!, $input: CampaignEventInput!) {
    addCampaignEvent(campaignId: $campaignId, input: $input) {
      id
      title
      description
      date
      location
    }
  }
`;

export const UPDATE_CAMPAIGN_EVENT = gql`
  mutation UpdateCampaignEvent($eventId: ID!, $input: CampaignEventInput!) {
    updateCampaignEvent(eventId: $eventId, input: $input) {
      id
      title
      description
      date
      location
    }
  }
`;

export const DELETE_CAMPAIGN_EVENT = gql`
  mutation DeleteCampaignEvent($eventId: ID!) {
    deleteCampaignEvent(eventId: $eventId)
  }
`;

export const APPROVE_CAMPAIGN_PARTICIPANT = gql`
  mutation ApproveCampaignParticipant($campaignId: ID!, $userId: ID!) {
    approveCampaignParticipant(campaignId: $campaignId, userId: $userId) {
      id
      title
      participants {
        id
        name
      }
      participantsCount
      pendingParticipantsCount
    }
  }
`;

// Мутация за директно добавяне на потребител към кампания от администратор
export const ADD_USER_TO_CAMPAIGN = gql`
  mutation AddUserToCampaign($campaignId: ID!, $userId: ID!) {
    addUserToCampaign(campaignId: $campaignId, userId: $userId) {
      id
      title
      participants {
        id
        name
      }
      participantsCount
    }
  }
`;

// Мутация за отхвърляне на заявка за участие в кампания
export const REJECT_CAMPAIGN_PARTICIPANT = gql`
  mutation RejectCampaignParticipant($campaignId: ID!, $userId: ID!) {
    rejectCampaignParticipant(campaignId: $campaignId, userId: $userId) {
      id
      title
      pendingParticipantsCount
    }
  }
`;

// Мутация за премахване на потребител от кампания
export const REMOVE_USER_FROM_CAMPAIGN = gql`
  mutation RemoveUserFromCampaign($campaignId: ID!, $userId: ID!) {
    removeUserFromCampaign(campaignId: $campaignId, userId: $userId) {
      id
      title
      participantsCount
    }
  }
`; 