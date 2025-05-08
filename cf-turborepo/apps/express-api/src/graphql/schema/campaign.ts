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
    images: [String!]!
    imagesCaptions: [String!]
    donations: [CampaignDonation!]!
    totalRating: Float
    ratingCount: Int
    percentCompleted: Float!
    remainingAmount: Float!
    isActive: Boolean!
  }
  
  type CampaignEvent {
    id: ID!
    title: String!
    description: String!
    date: Date!
    location: String!
  }

  type CampaignDonation {
    id: ID!
    user: User!
    amount: Float!
    comment: String
    rating: Int
    date: Date!
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
  
  # Campaign sort options
  enum CampaignSortOption {
    HIGHEST_GOAL
    LOWEST_GOAL
    MOST_FUNDED
    LEAST_FUNDED
    NEWEST
    OLDEST
    HIGHEST_RATED
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
    images: [String!]
    imagesCaptions: [String!]
  }
  
  input CampaignEventInput {
    title: String!
    description: String!
    date: Date!
    location: String!
  }

  input CampaignDonationInput {
    campaignId: ID!
    amount: Float!
    comment: String
    rating: Int
  }
  
  input CampaignFilterInput {
    sortBy: CampaignSortOption
    isActive: Boolean
    minGoal: Float
    maxGoal: Float
    minRating: Float
    hasEvents: Boolean
  }
`; 