import { gql } from 'apollo-server-express';

export const initiativeTypeDefs = gql`
  # Initiatives
  type Initiative {
    id: ID!
    title: String!
    description: String!
    startDate: Date!
    endDate: Date
    participants: [User!]!
    createdBy: User!
    items: [InitiativeItem!]!
    createdAt: Date!
    updatedAt: Date!
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