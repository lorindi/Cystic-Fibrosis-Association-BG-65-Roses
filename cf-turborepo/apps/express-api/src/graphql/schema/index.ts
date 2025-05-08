import { gql } from 'graphql-tag';
import { scalarTypeDefs } from './scalars';
import { userTypeDefs } from './user';
import { campaignTypeDefs } from './campaign';
import { initiativeTypeDefs } from './initiative';
import { conferenceTypeDefs } from './conference';
import { paymentTypeDefs } from './payment';
import { queryTypeDefs } from './queries';
import { mutationTypeDefs } from './mutations';
import { subscriptionTypeDefs } from './subscriptions';

// Добавяме допълнителни типове, които могат да се изискват в query/mutations, но не са дефинирани в отделни файлове
const additionalTypeDefs = gql`
  # Events for unloading
  type Event {
    id: ID!
    title: String!
    description: String!
    type: String!
    date: Date!
    location: String!
    participants: [User!]!
    createdBy: User!
    createdAt: Date!
    updatedAt: Date!
  }
  
  # Donors
  type Donor {
    id: ID!
    user: User
    name: String!
    description: String
    logo: String
    website: String
    totalDonations: Float!
    donations: [Donation!]!
    createdAt: Date!
    updatedAt: Date!
  }
  
  type Donation {
    id: ID!
    amount: Float!
    donor: Donor!
    campaign: Campaign
    date: Date!
    items: [StoreItem!]
  }
  
  # Charity shop
  type StoreItem {
    id: ID!
    name: String!
    description: String!
    price: Float!
    image: String
    category: String!
    available: Boolean!
    createdAt: Date!
    updatedAt: Date!
  }
  
  # News
  type News {
    id: ID!
    title: String!
    content: String!
    image: String
    author: User!
    tags: [String!]!
    createdAt: Date!
    updatedAt: Date!
  }
  
  # Blog
  type BlogPost {
    id: ID!
    title: String!
    content: String!
    image: String
    author: User!
    approved: Boolean!
    comments: [Comment!]!
    tags: [String!]!
    createdAt: Date!
    updatedAt: Date!
  }
  
  type Comment {
    id: ID!
    content: String!
    author: User!
    createdAt: Date!
    updatedAt: Date!
  }
  
  # Recipes
  type Recipe {
    id: ID!
    title: String!
    description: String!
    image: String
    preparationTime: Int!
    cookingTime: Int!
    servings: Int!
    ingredients: [String!]!
    instructions: [String!]!
    nutritionalInfo: NutritionalInfo!
    author: User!
    approved: Boolean!
    createdAt: Date!
    updatedAt: Date!
  }
  
  type NutritionalInfo {
    calories: Float!
    protein: Float!
    carbs: Float!
    fat: Float!
    vitamins: [Vitamin!]
  }
  
  type Vitamin {
    name: String!
    amount: Float!
    unit: String!
  }
  
  # Stories
  type Story {
    id: ID!
    title: String!
    content: String!
    image: String
    author: User!
    approved: Boolean!
    createdAt: Date!
    updatedAt: Date!
  }
  
  # Chat
  type ChatMessage {
    id: ID!
    content: String!
    sender: User!
    receiver: User
    roomId: String
    createdAt: Date!
  }
  
  # Artificial intelligence
  type AIResponse {
    id: ID!
    query: String!
    response: String!
    createdAt: Date!
  }
  
  # Additional inputs
  input EventInput {
    title: String!
    description: String!
    type: String!
    date: Date!
    location: String!
  }
  
  input StoreItemInput {
    name: String!
    description: String!
    price: Float!
    image: String
    category: String!
  }
  
  input DonationInput {
    amount: Float!
    campaignId: ID
    items: [ID!]
  }
  
  input NewsInput {
    title: String!
    content: String!
    image: String
    tags: [String!]!
  }
  
  input BlogPostInput {
    title: String!
    content: String!
    image: String
    tags: [String!]!
  }
  
  input CommentInput {
    content: String!
    postId: ID!
  }
  
  input RecipeInput {
    title: String!
    description: String!
    image: String
    preparationTime: Int!
    cookingTime: Int!
    servings: Int!
    ingredients: [String!]!
    instructions: [String!]!
    nutritionalInfo: NutritionalInfoInput!
  }
  
  input NutritionalInfoInput {
    calories: Float!
    protein: Float!
    carbs: Float!
    fat: Float!
    vitamins: [VitaminInput!]
  }
  
  input VitaminInput {
    name: String!
    amount: Float!
    unit: String!
  }
  
  input StoryInput {
    title: String!
    content: String!
    image: String
  }
  
  input ChatMessageInput {
    content: String!
    receiverId: ID
    roomId: String
  }
  
  input AIQueryInput {
    query: String!
  }
`;

// Обединяваме всички type definitions
export const typeDefs = [
  scalarTypeDefs,
  userTypeDefs,
  campaignTypeDefs,
  initiativeTypeDefs,
  conferenceTypeDefs,
  paymentTypeDefs,
  additionalTypeDefs,
  queryTypeDefs,
  mutationTypeDefs,
  subscriptionTypeDefs
]; 