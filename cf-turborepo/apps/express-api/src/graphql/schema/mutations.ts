import { gql } from 'graphql-tag';

export const mutationTypeDefs = gql`
  # Mutations
  type Mutation {
    # Authentication
    register(input: RegisterInput!): AuthResponse!
    login(input: LoginInput!): AuthResponse!
    updateProfile(input: ProfileUpdateInput!): User!
    setUserRole(userId: ID!, role: UserRole!): User!
    addUserToGroup(userId: ID!, group: UserGroup!): User!
    removeUserFromGroup(userId: ID!, group: UserGroup!): User!

    # Email verification
    resendVerificationEmail: Boolean!
    verifyEmail(token: String!): VerificationResponse!
    
    # Campaigns
    createCampaign(input: CampaignInput!): Campaign!
    updateCampaign(id: ID!, input: CampaignInput!): Campaign!
    deleteCampaign(id: ID!): Boolean!
    addCampaignEvent(campaignId: ID!, input: CampaignEventInput!): CampaignEvent!
    updateCampaignEvent(eventId: ID!, input: CampaignEventInput!): CampaignEvent!
    deleteCampaignEvent(eventId: ID!): Boolean!
    joinCampaign(id: ID!): Campaign!
    leaveCampaign(id: ID!): Campaign!
    
    # Initiatives
    createInitiative(input: InitiativeInput!): Initiative!
    updateInitiative(id: ID!, input: InitiativeInput!): Initiative!
    deleteInitiative(id: ID!): Boolean!
    joinInitiative(id: ID!): Initiative!
    leaveInitiative(id: ID!): Initiative!
    addInitiativeItem(initiativeId: ID!, input: InitiativeItemInput!): InitiativeItem!
    updateInitiativeItem(itemId: ID!, input: InitiativeItemInput!): InitiativeItem!
    deleteInitiativeItem(itemId: ID!): Boolean!
    
    # Conferences
    createConference(input: ConferenceInput!): Conference!
    updateConference(id: ID!, input: ConferenceInput!): Conference!
    deleteConference(id: ID!): Boolean!
    joinConference(id: ID!): Conference!
    leaveConference(id: ID!): Conference!
    addConferenceSession(conferenceId: ID!, input: ConferenceSessionInput!): ConferenceSession!
    updateConferenceSession(sessionId: ID!, input: ConferenceSessionInput!): ConferenceSession!
    deleteConferenceSession(sessionId: ID!): Boolean!
    
    # Events
    createEvent(input: EventInput!): Event!
    updateEvent(id: ID!, input: EventInput!): Event!
    deleteEvent(id: ID!): Boolean!
    joinEvent(id: ID!): Event!
    leaveEvent(id: ID!): Event!
    
    # Charity shop
    createStoreItem(input: StoreItemInput!): StoreItem!
    updateStoreItem(id: ID!, input: StoreItemInput!): StoreItem!
    deleteStoreItem(id: ID!): Boolean!
    
    # Donations
    createDonation(input: DonationInput!): Donation!
    
    # News
    createNews(input: NewsInput!): News!
    updateNews(id: ID!, input: NewsInput!): News!
    deleteNews(id: ID!): Boolean!
    
    # Blog
    createBlogPost(input: BlogPostInput!): BlogPost!
    updateBlogPost(id: ID!, input: BlogPostInput!): BlogPost!
    deleteBlogPost(id: ID!): Boolean!
    approveBlogPost(id: ID!): BlogPost!
    addComment(input: CommentInput!): Comment!
    deleteComment(id: ID!): Boolean!
    
    # Recipes
    createRecipe(input: RecipeInput!): Recipe!
    updateRecipe(id: ID!, input: RecipeInput!): Recipe!
    deleteRecipe(id: ID!): Boolean!
    approveRecipe(id: ID!): Recipe!
    
    # Stories
    createStory(input: StoryInput!): Story!
    updateStory(id: ID!, input: StoryInput!): Story!
    deleteStory(id: ID!): Boolean!
    approveStory(id: ID!): Story!
    
    # Chat
    sendChatMessage(input: ChatMessageInput!): ChatMessage!
  }
`; 