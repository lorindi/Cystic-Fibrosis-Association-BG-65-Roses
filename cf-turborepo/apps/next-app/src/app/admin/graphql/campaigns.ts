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
    $title: String!
    $description: String!
    $goal: Float!
    $startDate: DateTime!
    $endDate: DateTime!
  ) {
    createCampaign(
      title: $title
      description: $description
      goal: $goal
      startDate: $startDate
      endDate: $endDate
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
    $title: String!
    $description: String!
    $goal: Float!
    $startDate: DateTime!
    $endDate: DateTime!
  ) {
    updateCampaign(
      id: $id
      title: $title
      description: $description
      goal: $goal
      startDate: $startDate
      endDate: $endDate
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