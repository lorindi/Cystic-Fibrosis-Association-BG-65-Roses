import { gql } from '@apollo/client';

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

export const GET_PAYMENT_METHODS = gql`
  query GetPaymentMethods {
    getPaymentMethods {
      id
      brand
      last4
      expMonth
      expYear
      isDefault
    }
  }
`;

export const SAVE_PAYMENT_METHOD = gql`
  mutation SavePaymentMethod($paymentMethodId: String!) {
    savePaymentMethod(paymentMethodId: $paymentMethodId)
  }
`;

export const REMOVE_PAYMENT_METHOD = gql`
  mutation RemovePaymentMethod($paymentMethodId: String!) {
    removePaymentMethod(paymentMethodId: $paymentMethodId)
  }
`;

export const SET_DEFAULT_PAYMENT_METHOD = gql`
  mutation SetDefaultPaymentMethod($paymentMethodId: String!) {
    setDefaultPaymentMethod(paymentMethodId: $paymentMethodId)
  }
`; 