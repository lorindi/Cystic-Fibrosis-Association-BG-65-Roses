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

// Payment related mutations for campaigns
export const CREATE_PAYMENT_INTENT = gql`
  mutation CreatePaymentIntent($input: CreatePaymentIntentInput!) {
    createPaymentIntent(input: $input) {
      clientSecret
      paymentIntentId
      amount
      currency
    }
  }
`;

export const CONFIRM_PAYMENT = gql`
  mutation ConfirmPayment($paymentIntentId: String!) {
    confirmPayment(paymentIntentId: $paymentIntentId) {
      _id
      stripePaymentIntentId
      amount
      status
      type
      user {
        _id
        name
      }
      campaign {
        id
        title
      }
    }
  }
`; 