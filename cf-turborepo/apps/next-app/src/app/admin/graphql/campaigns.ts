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