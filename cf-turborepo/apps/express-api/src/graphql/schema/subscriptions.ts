import { gql } from 'graphql-tag';

export const subscriptionTypeDefs = gql`
  # Subscription
  type Subscription {
    messageSent(roomId: String, userId: ID): ChatMessage!
    campaignParticipantPending: CampaignNotification!
  }
`; 