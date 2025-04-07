import { gql } from 'graphql-tag';

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
    pendingParticipants: [User!]!
    pendingParticipantsCount: Int!
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
  
  # Campaign notification type
  type CampaignNotification {
    id: ID!
    title: String!
    pendingParticipants: [User!]!
    pendingParticipantsCount: Int!
  }
  
  # Campaign status for users
  enum CampaignParticipationStatus {
    PENDING
    APPROVED
    NOT_REGISTERED
  }
  
  type UserCampaignStatus {
    campaign: Campaign!
    status: CampaignParticipationStatus!
    registeredAt: Date
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