import { gql } from 'apollo-server-express';

export const userTypeDefs = gql`
  # Main types
  type User {
    _id: ID!
    name: String!
    email: String!
    role: UserRole!
    groups: [UserGroup!]
    isEmailVerified: Boolean!
    profile: UserProfile
    createdAt: Date!
    updatedAt: Date!
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
  
  # User responses
  type AuthResponse {
    token: String!
    user: User!
  }
`; 