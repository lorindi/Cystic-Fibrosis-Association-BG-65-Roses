import { gql } from 'apollo-server-express';

export const queryTypeDefs = gql`
  # Queries
  type Query {
    # Users
    getUser(id: ID!): User
    getCurrentUser: User
    getUsers: [User!]
    getUsersByRole(role: UserRole!): [User!]
    getUsersByGroup(group: UserGroup!): [User!]
    
    # Campaigns
    getCampaign(id: ID!): Campaign
    getCampaigns: [Campaign!]
    getCampaignEvents(campaignId: ID!): [CampaignEvent!]
    getUserCampaigns: [Campaign!]
    
    # Initiatives
    getInitiative(id: ID!): Initiative
    getInitiatives: [Initiative!]
    getUserInitiatives: [Initiative!]
    
    # Conferences
    getConference(id: ID!): Conference
    getConferences: [Conference!]
    
    # Events
    getEvent(id: ID!): Event
    getEvents: [Event!]
    
    # Donors
    getDonors: [Donor!]
    getDonor(id: ID!): Donor
    
    # Charity shop
    getStoreItems: [StoreItem!]
    getStoreItem(id: ID!): StoreItem
    
    # News
    getNews: [News!]
    getNewsItem(id: ID!): News
    
    # Blog
    getBlogPosts: [BlogPost!]
    getBlogPost(id: ID!): BlogPost
    
    # Recipes
    getRecipes: [Recipe!]
    getRecipe(id: ID!): Recipe
    
    # Stories
    getStories: [Story!]
    getStory(id: ID!): Story
    
    # Chat
    getChatMessages(roomId: String, userId: ID): [ChatMessage!]
    
    # AI
    askAI(query: String!): AIResponse
  }
`; 