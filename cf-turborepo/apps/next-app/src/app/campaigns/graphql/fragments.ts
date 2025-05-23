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
    totalRating
    ratingCount
    percentCompleted
    remainingAmount
    isActive
    hashtags
  }
`; 