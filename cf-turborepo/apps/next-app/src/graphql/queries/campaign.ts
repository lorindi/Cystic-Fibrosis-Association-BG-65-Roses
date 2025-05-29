import { gql } from '@apollo/client';

export const GET_CAMPAIGN_DETAILS = gql`
  query GetCampaignDetails($id: ID!) {
    getCampaign(id: $id) {
      id
      title
      description
      goal
      currentAmount
      endDate
      images
      donationsCount
      uniqueDonorsCount
      totalRating
      ratingCount
      percentCompleted
      remainingAmount
      createdBy {
        _id
        name
      }
      createdAt
      donations {
        id
        user {
          _id
          name
          profile {
            avatar
          }
        }
        amount
        comment
        rating
        date
      }
    }
  }
`;

export const ADD_CAMPAIGN_COMMENT = gql`
  mutation AddCampaignComment(
    $campaignId: ID!
    $comment: String
    $rating: Int
  ) {
    addCampaignComment(
      campaignId: $campaignId
      comment: $comment
      rating: $rating
    ) {
      id
      title
      description
      goal
      currentAmount
      endDate
      images
      donationsCount
      uniqueDonorsCount
      totalRating
      ratingCount
      percentCompleted
      remainingAmount
      createdBy {
        _id
        name
      }
      createdAt
      donations {
        id
        user {
          _id
          name
          profile {
            avatar
          }
        }
        amount
        comment
        rating
        date
      }
    }
  }
`; 