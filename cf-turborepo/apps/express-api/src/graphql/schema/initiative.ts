import { gql } from 'graphql-tag';

export const initiativeTypeDefs = gql`
  # Initiatives
  type Initiative {
    id: ID!
    title: String!
    description: String!
    startDate: Date!
    endDate: Date
    participants: [User!]!
    pendingParticipants: [User!]!
    createdBy: User!
    items: [InitiativeItem!]!
    createdAt: Date!
    updatedAt: Date!
    participantsCount: Int!
    pendingParticipantsCount: Int!
    isActive: Boolean!
  }
  
  type InitiativeItem {
    id: ID!
    name: String!
    description: String!
    quantity: Int!
    distributedQuantity: Int!
  }
  
  # Initiative inputs
  input InitiativeInput {
    title: String!
    description: String!
    startDate: Date!
    endDate: Date
    items: [InitiativeItemInput!]!
  }
  
  input InitiativeItemInput {
    name: String!
    description: String!
    quantity: Int!
  }
`; 