import { gql } from '@apollo/client';

// Admin dashboard queries
export const GET_USERS = gql`
  query GetUsersForAdmin($noLimit: Boolean) {
    getUsers(noLimit: $noLimit) {
      _id
      name
      email
      role
      groups
      isEmailVerified
      isActive
      deactivatedAt
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
      images
      imagesCaptions
      events {
        id
        title
        description
        date
        location
        image
        imageCaption
      }
      participantsCount
      pendingParticipantsCount
    }
  }
`;

export const GET_CAMPAIGN = gql`
  query GetCampaign($id: ID!) {
    getCampaign(id: $id) {
      id
      title
      description
      goal
      currentAmount
      startDate
      endDate
      images
      imagesCaptions
      events {
        id
        title
        description
        date
        location
        image
        imageCaption
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
        _id
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
      totalDonations
      donations {
        id
        amount
        date
        campaign {
          id
          title
        }
      }
    }
  }
`; 