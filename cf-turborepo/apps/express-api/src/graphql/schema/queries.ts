import { gql } from 'graphql-tag';

export const queryTypeDefs = gql`
  # Queries
  type Query {
    # Users
    getUser(id: ID!): User
    getCurrentUser: User
    getUsers(limit: Int, offset: Int): [User!]
    getPaginatedUsers(limit: Int, offset: Int): PaginatedUsers!
    getUsersByRole(role: UserRole!, limit: Int, offset: Int): [User!]
    getUsersByGroup(group: UserGroup!, limit: Int, offset: Int): [User!]
    
    # Campaigns
    getCampaign(id: ID!): Campaign
    getCampaigns: [Campaign!]
    getCampaignEvents(campaignId: ID!): [CampaignEvent!]
    getUserCampaigns: [Campaign!]
    getPendingCampaignRequests: [Campaign!]
    getUserCampaignStatus: [UserCampaignStatus!]
    
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