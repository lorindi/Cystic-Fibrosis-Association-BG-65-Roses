import { gql } from '@apollo/client';
import { CAMPAIGN_FRAGMENT } from './fragments';

export const GET_CAMPAIGNS = gql`
  query GetCampaigns($limit: Int, $offset: Int, $noLimit: Boolean) {
    getCampaigns(limit: $limit, offset: $offset, noLimit: $noLimit) {
      ...CampaignFields
    }
  }
  ${CAMPAIGN_FRAGMENT}
`;

export const GET_FILTERED_CAMPAIGNS = gql`
  query GetFilteredCampaigns($filter: CampaignFilterInput, $limit: Int, $offset: Int, $noLimit: Boolean) {
    getFilteredCampaigns(filter: $filter, limit: $limit, offset: $offset, noLimit: $noLimit) {
      ...CampaignFields
    }
  }
  ${CAMPAIGN_FRAGMENT}
`;

export const GET_HASHTAGS_BY_CATEGORY = gql`
  query GetHashtagsByCategory($category: String!) {
    getHashtagsByCategory(category: $category) {
      id
      name
      count
      categories
    }
  }
`;

export const GET_CAMPAIGN = gql`
  query GetCampaign($id: ID!) {
    getCampaign(id: $id) {
      ...CampaignFields
      donations {
        id
        amount
        comment
        rating
        date
        user {
          _id
          name
          profile {
            avatar
          }
        }
      }
    }
  }
  ${CAMPAIGN_FRAGMENT}
`; 