import { gql } from 'graphql-tag';

export const paymentTypeDefs = gql`
  # Енумерации
  enum PaymentStatus {
    pending
    succeeded
    failed
    canceled
    refunded
  }

  enum PaymentType {
    campaign_donation
    initiative_donation
    store_purchase
    other_donation
  }

  # Основни типове
  type Payment {
    _id: ID!
    stripePaymentIntentId: String!
    amount: Float!
    currency: String!
    status: PaymentStatus!
    type: PaymentType!
    description: String
    campaign: Campaign
    initiative: Initiative
    items: [StoreItem]
    donor: Donor
    user: User
    createdAt: Date!
    updatedAt: Date!
  }

  type PaymentIntent {
    clientSecret: String!
    paymentIntentId: String!
    amount: Float!
    currency: String!
  }

  type SetupIntent {
    clientSecret: String!
    setupIntentId: String!
  }

  type PaymentMethod {
    id: String!
    brand: String!
    last4: String!
    expMonth: Int!
    expYear: Int!
    isDefault: Boolean!
  }

  type PaginatedPayments {
    payments: [Payment!]!
    totalCount: Int!
    hasMore: Boolean!
  }

  # Входни типове
  input CreatePaymentIntentInput {
    amount: Float!
    currency: String
    type: PaymentType!
    campaignId: ID
    initiativeId: ID
    items: [ID]
    description: String
    savePaymentMethod: Boolean
  }

  input ProcessPaymentInput {
    paymentIntentId: String!
    paymentMethodId: String
  }

  input CustomerPaymentMethodInput {
    paymentMethodId: String!
    isDefault: Boolean
  }

  # Заявки и мутации
  extend type Query {
    # Получаване на плащания
    getPayments(limit: Int, offset: Int): PaginatedPayments!
    getPayment(id: ID!): Payment
    getUserPayments(userId: ID!, limit: Int, offset: Int): PaginatedPayments!
    
    # Получаване на платежни методи
    getPaymentMethods: [PaymentMethod!]!
  }

  extend type Mutation {
    # Създаване на плащане
    createPaymentIntent(input: CreatePaymentIntentInput!): PaymentIntent!
    
    # Обработка на плащане 
    confirmPayment(paymentIntentId: String!): Payment!
    refundPayment(paymentIntentId: String!): Payment!
    
    # Управление на платежни методи
    createSetupIntent: SetupIntent!
    savePaymentMethod(paymentMethodId: String!): Boolean!
    removePaymentMethod(paymentMethodId: String!): Boolean!
    setDefaultPaymentMethod(paymentMethodId: String!): Boolean!
  }
`; 