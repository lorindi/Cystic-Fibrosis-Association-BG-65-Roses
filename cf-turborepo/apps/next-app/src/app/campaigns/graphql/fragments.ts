import { gql } from '@apollo/client';

export const CAMPAIGN_FRAGMENT = gql`
  fragment CampaignFields on Campaign {
    id
    title
    description
    goal
    currentAmount
    startDate
    endDate
    images
    imagesCaptions
    donationsCount
    uniqueDonorsCount
    totalRating
    ratingCount
    percentCompleted
    remainingAmount
    isActive
    hashtags
    createdAt
    updatedAt
    createdBy {
      _id
      name
      profile {
        avatar
      }
    }
    participants {
      _id
      name
      profile {
        avatar
      }
    }
    participantsCount
  }
`; 