import { gql } from 'graphql-tag';

export const queryTypeDefs = gql`
  # Queries
  type Query {
    # Users
    getUser(id: ID!): User
    getCurrentUser: User
    getUsers(limit: Int, offset: Int, noLimit: Boolean): [User!]
    getPaginatedUsers(limit: Int, offset: Int, noLimit: Boolean): PaginatedUsers!
    getUsersByRole(role: UserRole!, limit: Int, offset: Int, noLimit: Boolean): [User!]
    getUsersByGroup(group: UserGroup!, limit: Int, offset: Int, noLimit: Boolean): [User!]
    
    # Campaigns
    getCampaign(id: ID!): Campaign
    getCampaigns(limit: Int, offset: Int, noLimit: Boolean): [Campaign!]
    getCampaignEvents(campaignId: ID!): [CampaignEvent!]
    getUserCampaigns(limit: Int, offset: Int, noLimit: Boolean): [Campaign!]
    getPendingCampaignRequests(limit: Int, offset: Int, noLimit: Boolean): [Campaign!]
    getUserCampaignStatus: [UserCampaignStatus!]
    
    # Initiatives
    getInitiative(id: ID!): Initiative!
    getInitiatives(limit: Int, offset: Int, noLimit: Boolean): [Initiative!]!
    getUserInitiatives(limit: Int, offset: Int, noLimit: Boolean): [Initiative!]!
    getPendingInitiativeRequests(initiativeId: ID!): [User!]!
    
    # Conferences
    getConference(id: ID!): Conference
    getConferences(limit: Int, offset: Int, noLimit: Boolean): [Conference!]
    
    # Events
    getEvent(id: ID!): Event
    getEvents(limit: Int, offset: Int, noLimit: Boolean): [Event!]
    
    # Donors
    getDonors(limit: Int, offset: Int, noLimit: Boolean): [Donor!]
    getDonor(id: ID!): Donor
    
    # Charity shop
    getStoreItems(limit: Int, offset: Int, noLimit: Boolean): [StoreItem!]
    getStoreItem(id: ID!): StoreItem
    
    # News
    getNews(limit: Int, offset: Int, noLimit: Boolean): [News!]
    getNewsItem(id: ID!): News
    
    # Blog
    getBlogPosts(limit: Int, offset: Int, noLimit: Boolean): [BlogPost!]
    getBlogPost(id: ID!): BlogPost
    
    # Recipes
    getRecipes(limit: Int, offset: Int, noLimit: Boolean): [Recipe!]
    getRecipe(id: ID!): Recipe
    
    # Stories
    getStories(limit: Int, offset: Int, noLimit: Boolean): [Story!]
    getStory(id: ID!): Story
    
    # Chat
    getChatMessages(roomId: String, userId: ID): [ChatMessage!]
    
    # AI
    askAI(query: String!): AIResponse
  }
`; 