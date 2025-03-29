import { gql } from 'apollo-server-express';

export const campaignTypeDefs = gql`
  # Campaigns
  type Campaign {
    id: ID!
    title: String!
    description: String!
    goal: Float!
    currentAmount: Float!
    startDate: Date!
    endDate: Date
    events: [CampaignEvent!]!
    participants: [User!]!
    participantsCount: Int!
    createdBy: User!
    createdAt: Date!
    updatedAt: Date!
  }
  
  type CampaignEvent {
    id: ID!
    title: String!
    description: String!
    date: Date!
    location: String!
  }
  
  # Campaign inputs
  input CampaignInput {
    title: String!
    description: String!
    goal: Float!
    startDate: Date!
    endDate: Date
    events: [CampaignEventInput!]
  }
  
  input CampaignEventInput {
    title: String!
    description: String!
    date: Date!
    location: String!
  }
`; 