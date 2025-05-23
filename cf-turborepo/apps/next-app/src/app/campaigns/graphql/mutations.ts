import { gql } from '@apollo/client';
import { CAMPAIGN_FRAGMENT } from './fragments';

export const JOIN_CAMPAIGN = gql`
  mutation JoinCampaign($id: ID!) {
    joinCampaign(id: $id) {
      ...CampaignFields
    }
  }
  ${CAMPAIGN_FRAGMENT}
`;

export const LEAVE_CAMPAIGN = gql`
  mutation LeaveCampaign($id: ID!) {
    leaveCampaign(id: $id) {
      ...CampaignFields
    }
  }
  ${CAMPAIGN_FRAGMENT}
`;

export const ADD_CAMPAIGN_COMMENT = gql`
  mutation AddCampaignComment($campaignId: ID!, $comment: String, $rating: Int) {
    addCampaignComment(campaignId: $campaignId, comment: $comment, rating: $rating) {
      ...CampaignFields
    }
  }
  ${CAMPAIGN_FRAGMENT}
`; 