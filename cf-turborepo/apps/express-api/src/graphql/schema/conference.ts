import { gql } from 'graphql-tag';

export const conferenceTypeDefs = gql`
  # Conferences
  type Conference {
    id: ID!
    title: String!
    description: String!
    startDate: Date!
    endDate: Date!
    location: String!
    agenda: [ConferenceSession!]!
    participants: [User!]!
    createdBy: User!
    createdAt: Date!
    updatedAt: Date!
  }
  
  type ConferenceSession {
    id: ID!
    title: String!
    speaker: String!
    description: String!
    startTime: Date!
    endTime: Date!
  }
  
  # Conference inputs
  input ConferenceInput {
    title: String!
    description: String!
    startDate: Date!
    endDate: Date!
    location: String!
    agenda: [ConferenceSessionInput!]!
  }
  
  input ConferenceSessionInput {
    title: String!
    speaker: String!
    description: String!
    startTime: Date!
    endTime: Date!
  }
`; 