import { gql } from 'apollo-server-express';

export const subscriptionTypeDefs = gql`
  # Subscription
  type Subscription {
    messageSent(roomId: String, userId: ID): ChatMessage!
  }
`; 