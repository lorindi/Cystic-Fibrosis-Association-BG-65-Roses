import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  scalar Date
  
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
  
  # Campaigns
  type Campaign {
    id: ID!
    title: String!
    description: String!
    goal: Float!
    currentAmount: Float!
    startDate: Date!
    endDate: Date
    events: [CampaignEvent!]!
    createdBy: User!
    createdAt: Date!
    updatedAt: Date!
  }
  
  type CampaignEvent {
    id: ID!
    title: String!
    description: String!
    date: Date!
    location: String!
  }
  
  # Initiatives
  type Initiative {
    id: ID!
    title: String!
    description: String!
    startDate: Date!
    endDate: Date
    participants: [User!]!
    createdBy: User!
    items: [InitiativeItem!]!
    createdAt: Date!
    updatedAt: Date!
  }
  
  type InitiativeItem {
    id: ID!
    name: String!
    description: String!
    quantity: Int!
    distributedQuantity: Int!
  }
  
  # Conferences
  type Conference {
    id: ID!
    title: String!
    description: String!
    startDate: Date!
    endDate: Date!
    location: String!
    agenda: [ConferenceSession!]!
    participants: [User!]!
    createdBy: User!
    createdAt: Date!
    updatedAt: Date!
  }
  
  type ConferenceSession {
    id: ID!
    title: String!
    speaker: String!
    description: String!
    startTime: Date!
    endTime: Date!
  }
  
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
  
  # Inputs
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
  
  input CampaignInput {
    title: String!
    description: String!
    goal: Float!
    startDate: Date!
    endDate: Date
    events: [CampaignEventInput!]
  }
  
  input CampaignEventInput {
    title: String!
    description: String!
    date: Date!
    location: String!
  }
  
  input InitiativeInput {
    title: String!
    description: String!
    startDate: Date!
    endDate: Date
    items: [InitiativeItemInput!]!
  }
  
  input InitiativeItemInput {
    name: String!
    description: String!
    quantity: Int!
  }
  
  input ConferenceInput {
    title: String!
    description: String!
    startDate: Date!
    endDate: Date!
    location: String!
    agenda: [ConferenceSessionInput!]!
  }
  
  input ConferenceSessionInput {
    title: String!
    speaker: String!
    description: String!
    startTime: Date!
    endTime: Date!
  }
  
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
  
  # Responses  
  type AuthResponse {
    token: String!
    user: User!
  }
  
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
  
  # Mutations
  type Mutation {
    # Authentication
    register(input: RegisterInput!): AuthResponse!
    login(input: LoginInput!): AuthResponse!
    updateProfile(input: ProfileUpdateInput!): User!
    setUserRole(userId: ID!, role: UserRole!): User!
    addUserToGroup(userId: ID!, group: UserGroup!): User!
    removeUserFromGroup(userId: ID!, group: UserGroup!): User!
    
    # Campaigns
    createCampaign(input: CampaignInput!): Campaign!
    updateCampaign(id: ID!, input: CampaignInput!): Campaign!
    deleteCampaign(id: ID!): Boolean!
    addCampaignEvent(campaignId: ID!, input: CampaignEventInput!): CampaignEvent!
    updateCampaignEvent(eventId: ID!, input: CampaignEventInput!): CampaignEvent!
    deleteCampaignEvent(eventId: ID!): Boolean!
    
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
  
  # Subscription
  type Subscription {
    messageSent(roomId: String, userId: ID): ChatMessage!
  }
`; 