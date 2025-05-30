import { gql } from 'graphql-tag';

export const userTypeDefs = gql`
  # Main types
  type User {
    _id: ID!
    name: String!
    email: String!
    role: UserRole!
    groups: [UserGroup!]
    isEmailVerified: Boolean!
    isActive: Boolean!
    deactivatedAt: Date
    profile: UserProfile
    createdAt: Date!
    updatedAt: Date!
  }

  # Pagination types
  type PaginatedUsers {
    users: [User!]!
    totalCount: Int!
    hasMore: Boolean!
  }

  type VerificationResponse {
    success: Boolean!
    message: String!
    user: User
    token: String
  }
  
  type UserProfile {
    avatar: String
    bio: String
    birthDate: Date
    address: Address
    contact: Contact
    diagnosed: Boolean
    diagnosisYear: Int
    childName: String
    companyName: String
  }
  
  type Address {
    city: String!
    postalCode: String
    street: String
  }
  
  type Contact {
    phone: String
    alternativeEmail: String
    emergencyContact: EmergencyContact
  }
  
  type EmergencyContact {
    name: String!
    phone: String!
    relation: String!
  }
  
  enum UserRole {
    patient
    parent
    donor
    admin
  }
  
  enum UserGroup {
    campaigns
    initiatives
    conferences
    events
    news
    blog
    recipes
  }
  
  # User inputs
  input RegisterInput {
    name: String!
    email: String!
    password: String!
  }
  
  input LoginInput {
    email: String!
    password: String!
  }

  input GoogleAuthInput {
    idToken: String!
  }
  
  input ProfileUpdateInput {
    avatar: String
    bio: String
    birthDate: Date
    address: AddressInput
    contact: ContactInput
    diagnosed: Boolean
    diagnosisYear: Int
    childName: String
    companyName: String
  }
  
  input AddressInput {
    city: String!
    postalCode: String
    street: String
  }
  
  input ContactInput {
    phone: String
    alternativeEmail: String
    emergencyContact: EmergencyContactInput
  }
  
  input EmergencyContactInput {
    name: String!
    phone: String!
    relation: String!
  }
  
  input DeactivateAccountInput {
    reason: String
    feedback: String
  }
  
  # User responses
  type AuthResponse {
    token: String!
    user: User!
  }

  # Alias за поддържане на refreshToken мутацията
  type AuthPayload {
    token: String!
    user: User!
  }

  # User sessions
  type UserSession {
    id: ID!
    ip: String!
    userAgent: String!
    createdAt: Date!
    expiresAt: Date!
  }
  
  type LoginHistory {
    id: ID!
    ip: String!
    userAgent: String!
    status: String!
    loggedInAt: Date!
  }

  extend type Mutation {
    googleAuth(input: GoogleAuthInput!): AuthResponse!
    deactivateAccount(input: DeactivateAccountInput): Boolean!
    reactivateAccount(userId: ID!): Boolean!
  }
`; 