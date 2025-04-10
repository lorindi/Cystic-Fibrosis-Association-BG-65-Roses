import { gql } from '@apollo/client';

// Admin dashboard queries
export const GET_USERS = gql`
  query GetUsers($noLimit: Boolean) {
    getUsers(noLimit: $noLimit) {
      _id
      name
      email
      role
      groups
      isEmailVerified
      createdAt
      updatedAt
      profile {
        avatar
      }
    }
  }
`;

export const GET_CAMPAIGNS = gql`
  query GetCampaigns($noLimit: Boolean) {
    getCampaigns(noLimit: $noLimit) {
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
        description
        date
        location
      }
      participantsCount
      pendingParticipantsCount
    }
  }
`;

export const GET_EVENTS = gql`
  query GetEvents($noLimit: Boolean) {
    getEvents(noLimit: $noLimit) {
      id
      title
      description
      date
      location
      createdAt
      participants {
        id
        name
      }
    }
  }
`;

export const GET_DONATIONS = gql`
  query GetDonations($noLimit: Boolean) {
    getDonors(noLimit: $noLimit) {
      id
      name
      amount
      date
      campaign {
        id
        title
      }
    }
  }
`; 