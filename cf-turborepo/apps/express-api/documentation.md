# API Documentation for "65 Roses" - Cystic Fibrosis Association

## Introduction

This API provides functionalities for managing the website of the "65 Roses" Cystic Fibrosis Association. The API uses GraphQL and offers various capabilities for managing campaigns, initiatives, conferences, events, recipes, patient stories, and other functionalities.

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. The token must be included in the HTTP header `Authorization` in the format `Bearer [your_token]`.

### Registration

```graphql
mutation {
  register(input: {
    name: "First Last Name",
    email: "email@example.com",
    password: "password123"
  }) {
    token
    user {
      _id
      name
      email
      role
    }
  }
}
```

### Login

```graphql
mutation {
  login(input: {
    email: "email@example.com",
    password: "password123"
  }) {
    token
    user {
      _id
      name
      email
      role
    }
  }
}
```

### Check Current User

```graphql
query {
  getCurrentUser {
    _id
    name
    email
    role
    groups
    profile {
      avatar
      bio
      birthDate
      address {
        city
        postalCode
        street
      }
      contact {
        phone
        alternativeEmail
      }
    }
  }
}
```

### Update Profile

```graphql
mutation {
  updateProfile(input: {
    avatar: "https://example.com/avatar.jpg",
    bio: "Short biography",
    birthDate: "1990-01-01T00:00:00Z",
    address: {
      city: "Sofia",
      postalCode: "1000",
      street: "1 Vitosha Blvd."
    },
    contact: {
      phone: "+359888123456",
      alternativeEmail: "alt@example.com",
      emergencyContact: {
        name: "Emergency contact name",
        phone: "+359888654321",
        relation: "relative"
      }
    },
    diagnosed: true,
    diagnosisYear: 2010,
    childName: "Child's name" // for users with "parent" role
  }) {
    _id
    name
    profile {
      avatar
      bio
      birthDate
      address {
        city
      }
      contact {
        phone
      }
    }
  }
}
```

## User Management

### Change User Role (admin only)

```graphql
mutation {
  setUserRole(userId: "user_id", role: patient) {
    _id
    name
    email
    role
  }
}
```

Possible roles:
- `patient` - patient
- `parent` - parent
- `donor` - donor
- `admin` - administrator

### Add User to Group (admin only)

```graphql
mutation {
  addUserToGroup(userId: "user_id", group: campaigns) {
    _id
    name
    groups
  }
}
```

Possible groups:
- `campaigns` - campaigns
- `initiatives` - initiatives
- `conferences` - conferences
- `events` - events
- `news` - news
- `blog` - blog
- `recipes` - recipes

### Remove User from Group (admin only)

```graphql
mutation {
  removeUserFromGroup(userId: "user_id", group: campaigns) {
    _id
    name
    groups
  }
}
```

### Get User by ID

```graphql
query {
  getUser(id: "user_id") {
    _id
    name
    email
    role
    groups
  }
}
```

### Get All Users (admin only)

```graphql
query {
  getUsers {
    _id
    name
    email
    role
    groups
  }
}
```

### Get Users by Role (admin only)

```graphql
query {
  getUsersByRole(role: patient) {
    _id
    name
    email
  }
}
```

### Get Users by Group (admin only)

```graphql
query {
  getUsersByGroup(group: campaigns) {
    _id
    name
    email
  }
}
```

## Campaigns

### Create Campaign (requires admin or "campaigns" group)

```graphql
mutation {
  createCampaign(input: {
    title: "Fundraising Campaign",
    description: "Detailed campaign description",
    goal: 10000,
    startDate: "2023-10-01T00:00:00Z",
    endDate: "2023-12-31T00:00:00Z",
    events: [
      {
        title: "Launch event",
        description: "Campaign kickoff",
        date: "2023-10-01T18:00:00Z",
        location: "Sofia, Slaveikov Square"
      }
    ]
  }) {
    id
    title
    goal
    currentAmount
    startDate
    endDate
    events {
      id
      title
      date
    }
  }
}
```

### Update Campaign

```graphql
mutation {
  updateCampaign(
    id: "campaign_id",
    input: {
      title: "New title",
      description: "New description",
      goal: 15000,
      endDate: "2024-01-31T00:00:00Z"
    }
  ) {
    id
    title
    description
    goal
    endDate
  }
}
```

### Delete Campaign

```graphql
mutation {
  deleteCampaign(id: "campaign_id")
}
```

### Add Event to Campaign

```graphql
mutation {
  addCampaignEvent(
    campaignId: "campaign_id",
    input: {
      title: "New event",
      description: "Event description",
      date: "2023-11-15T19:00:00Z",
      location: "Plovdiv, Kapana"
    }
  ) {
    id
    title
    date
    location
  }
}
```

### Update Campaign Event

```graphql
mutation {
  updateCampaignEvent(
    eventId: "event_id",
    input: {
      title: "Updated title",
      date: "2023-11-16T19:00:00Z"
    }
  ) {
    id
    title
    date
  }
}
```

### Delete Campaign Event

```graphql
mutation {
  deleteCampaignEvent(eventId: "event_id")
}
```

### Join Campaign (patients and parents only)

```graphql
mutation {
  joinCampaign(id: "campaign_id") {
    id
    title
    participants {
      _id
      name
    }
    participantsCount
  }
}
```

### Leave Campaign

```graphql
mutation {
  leaveCampaign(id: "campaign_id") {
    id
    title
    participants {
      _id
      name
    }
    participantsCount
  }
}
```

### Get Campaign by ID

```graphql
query {
  getCampaign(id: "campaign_id") {
    id
    title
    description
    goal
    currentAmount
    startDate
    endDate
    events {
      id
      title
      description
      date
      location
    }
    participants {
      _id
      name
    }
    participantsCount
    createdBy {
      _id
      name
    }
  }
}
```

### Get All Campaigns

```graphql
query {
  getCampaigns {
    id
    title
    goal
    currentAmount
    startDate
    endDate
    participantsCount
  }
}
```

### Get Campaign Events

```graphql
query {
  getCampaignEvents(campaignId: "campaign_id") {
    id
    title
    description
    date
    location
  }
}
```

### Get Current User's Campaigns

```graphql
query {
  getUserCampaigns {
    id
    title
    description
    goal
    currentAmount
    startDate
    endDate
  }
}
```

## Initiatives

### Create Initiative (requires admin or "initiatives" group)

```graphql
mutation {
  createInitiative(input: {
    title: "Medication Distribution",
    description: "Free medication distribution initiative",
    startDate: "2023-10-15T00:00:00Z",
    endDate: "2023-11-15T00:00:00Z",
    items: [
      {
        name: "Inhaler",
        description: "Standard inhaler",
        quantity: 50
      },
      {
        name: "Kavisept",
        description: "Medication for inhalation",
        quantity: 100
      }
    ]
  }) {
    id
    title
    startDate
    endDate
    items {
      id
      name
      quantity
    }
  }
}
```

### Update Initiative

```graphql
mutation {
  updateInitiative(
    id: "initiative_id",
    input: {
      title: "New title",
      description: "New description",
      endDate: "2023-12-15T00:00:00Z"
    }
  ) {
    id
    title
    description
    endDate
  }
}
```

### Delete Initiative

```graphql
mutation {
  deleteInitiative(id: "initiative_id")
}
```

### Add Item to Initiative

```graphql
mutation {
  addInitiativeItem(
    initiativeId: "initiative_id",
    input: {
      name: "Mucocleer",
      description: "Medication for cystic fibrosis",
      quantity: 30
    }
  ) {
    id
    name
    description
    quantity
    distributedQuantity
  }
}
```

### Update Initiative Item

```graphql
mutation {
  updateInitiativeItem(
    itemId: "item_id",
    input: {
      quantity: 40,
      distributedQuantity: 10
    }
  ) {
    id
    name
    quantity
    distributedQuantity
  }
}
```

### Delete Initiative Item

```graphql
mutation {
  deleteInitiativeItem(itemId: "item_id")
}
```

### Join Initiative (patients only)

```graphql
mutation {
  joinInitiative(id: "initiative_id") {
    id
    title
    participants {
      _id
      name
    }
  }
}
```

### Leave Initiative

```graphql
mutation {
  leaveInitiative(id: "initiative_id") {
    id
    title
    participants {
      _id
      name
    }
  }
}
```

### Get Initiative by ID

```graphql
query {
  getInitiative(id: "initiative_id") {
    id
    title
    description
    startDate
    endDate
    items {
      id
      name
      description
      quantity
      distributedQuantity
    }
    participants {
      _id
      name
    }
    createdBy {
      _id
      name
    }
  }
}
```

### Get All Initiatives

```graphql
query {
  getInitiatives {
    id
    title
    description
    startDate
    endDate
    items {
      name
      quantity
      distributedQuantity
    }
  }
}
```

### Get Current User's Initiatives

```graphql
query {
  getUserInitiatives {
    id
    title
    description
    startDate
    endDate
    items {
      name
      quantity
    }
  }
}
```

## Conferences

### Create Conference (requires admin or "conferences" group)

```graphql
mutation {
  createConference(input: {
    title: "Educational Conference",
    description: "Conference with lectures for patients and parents",
    startDate: "2023-11-10T09:00:00Z",
    endDate: "2023-11-12T18:00:00Z",
    location: "Medical University - Sofia",
    agenda: [
      {
        title: "New therapies for cystic fibrosis",
        speaker: "Dr. Ivan Ivanov",
        description: "Overview of new therapeutic approaches",
        startTime: "2023-11-10T10:00:00Z",
        endTime: "2023-11-10T11:30:00Z"
      }
    ]
  }) {
    id
    title
    location
    agenda {
      id
      title
      speaker
    }
  }
}
```

### Update Conference

```graphql
mutation {
  updateConference(
    id: "conference_id",
    input: {
      title: "New title",
      description: "New description",
      location: "New location"
    }
  ) {
    id
    title
    description
    location
  }
}
```

### Delete Conference

```graphql
mutation {
  deleteConference(id: "conference_id")
}
```

### Add Session to Conference

```graphql
mutation {
  addConferenceSession(
    conferenceId: "conference_id",
    input: {
      title: "Nutrition for cystic fibrosis",
      speaker: "Dr. Maria Petrova",
      description: "Proper nutrition for patients",
      startTime: "2023-11-10T13:00:00Z",
      endTime: "2023-11-10T14:30:00Z"
    }
  ) {
    id
    title
    speaker
    startTime
    endTime
  }
}
```

### Update Conference Session

```graphql
mutation {
  updateConferenceSession(
    sessionId: "session_id",
    input: {
      title: "Updated title",
      speaker: "New speaker",
      startTime: "2023-11-10T13:30:00Z"
    }
  ) {
    id
    title
    speaker
    startTime
    endTime
  }
}
```

### Delete Conference Session

```graphql
mutation {
  deleteConferenceSession(sessionId: "session_id")
}
```

### Join Conference

```graphql
mutation {
  joinConference(id: "conference_id") {
    id
    title
    participants {
      _id
      name
    }
  }
}
```

### Leave Conference

```graphql
mutation {
  leaveConference(id: "conference_id") {
    id
    title
    participants {
      _id
      name
    }
  }
}
```

### Get Conference by ID

```graphql
query {
  getConference(id: "conference_id") {
    id
    title
    description
    startDate
    endDate
    location
    agenda {
      id
      title
      speaker
      description
      startTime
      endTime
    }
    participants {
      _id
      name
    }
    createdBy {
      _id
      name
    }
  }
}
```

### Get All Conferences

```graphql
query {
  getConferences {
    id
    title
    description
    startDate
    endDate
    location
    agenda {
      title
      speaker
    }
  }
}
```

## Recreational Events

### Create Event (requires admin or "events" group)

```graphql
mutation {
  createEvent(input: {
    title: "Mountain hike",
    description: "Hike to Botev Peak",
    type: "sports",
    date: "2023-11-20T09:00:00Z",
    location: "Stara Planina"
  }) {
    id
    title
    type
    date
    location
  }
}
```

### Update Event

```graphql
mutation {
  updateEvent(
    id: "event_id",
    input: {
      title: "New title",
      description: "New description",
      date: "2023-11-21T09:00:00Z"
    }
  ) {
    id
    title
    description
    date
  }
}
```

### Delete Event

```graphql
mutation {
  deleteEvent(id: "event_id")
}
```

### Join Event

```graphql
mutation {
  joinEvent(id: "event_id") {
    id
    title
    participants {
      _id
      name
    }
  }
}
```

### Leave Event

```graphql
mutation {
  leaveEvent(id: "event_id") {
    id
    title
    participants {
      _id
      name
    }
  }
}
```

### Get Event by ID

```graphql
query {
  getEvent(id: "event_id") {
    id
    title
    description
    type
    date
    location
    participants {
      _id
      name
    }
    createdBy {
      _id
      name
    }
  }
}
```

### Get All Events

```graphql
query {
  getEvents {
    id
    title
    description
    type
    date
    location
  }
}
```

## Donors and Donations

### Get Donor by ID

```graphql
query {
  getDonor(id: "donor_id") {
    id
    name
    description
    logo
    website
    totalDonations
    donations {
      id
      amount
      date
    }
    user {
      _id
      name
      email
    }
  }
}
```

### Get All Donors

```graphql
query {
  getDonors {
    id
    name
    totalDonations
    donations {
      amount
    }
  }
}
```

### Create Donation

```graphql
mutation {
  createDonation(input: {
    amount: 1000,
    campaignId: "campaign_id",
    items: ["item_id_1", "item_id_2"]
  }) {
    id
    amount
    date
    donor {
      id
      name
    }
    campaign {
      id
      title
    }
    items {
      id
      name
    }
  }
}
```

## Charity Shop

### Create Store Item (admin only)

```graphql
mutation {
  createStoreItem(input: {
    name: "Research Support",
    description: "Support cystic fibrosis research",
    price: 50,
    image: "https://example.com/research.jpg",
    category: "research"
  }) {
    id
    name
    price
    category
  }
}
```

### Update Store Item

```graphql
mutation {
  updateStoreItem(
    id: "item_id",
    input: {
      name: "New name",
      price: 55,
      available: true
    }
  ) {
    id
    name
    price
    available
  }
}
```

### Delete Store Item

```graphql
mutation {
  deleteStoreItem(id: "item_id")
}
```

### Get Store Item by ID

```graphql
query {
  getStoreItem(id: "item_id") {
    id
    name
    description
    price
    image
    category
    available
  }
}
```

### Get All Store Items

```graphql
query {
  getStoreItems {
    id
    name
    description
    price
    image
    category
    available
  }
}
```

## News

### Create News (requires admin or "news" group)

```graphql
mutation {
  createNews(input: {
    title: "New therapy approved",
    content: "Detailed description of the new therapy...",
    image: "https://example.com/therapy.jpg",
    tags: ["therapy", "treatment", "research"]
  }) {
    id
    title
    content
    tags
  }
}
```

### Update News

```graphql
mutation {
  updateNews(
    id: "news_id",
    input: {
      title: "Updated title",
      content: "Updated content",
      tags: ["new", "therapy"]
    }
  ) {
    id
    title
    content
    tags
  }
}
```

### Delete News

```graphql
mutation {
  deleteNews(id: "news_id")
}
```

### Get News Item by ID

```graphql
query {
  getNewsItem(id: "news_id") {
    id
    title
    content
    image
    tags
    author {
      _id
      name
    }
    createdAt
    updatedAt
  }
}
```

### Get All News

```graphql
query {
  getNews {
    id
    title
    content
    image
    tags
    author {
      name
    }
    createdAt
  }
}
```

## Blog

### Create Blog Post (must be approved by admin or "blog" group)

```graphql
mutation {
  createBlogPost(input: {
    title: "My experience with cystic fibrosis",
    content: "Detailed description of my experience...",
    image: "https://example.com/blog.jpg",
    tags: ["experience", "opinion", "living with cystic fibrosis"]
  }) {
    id
    title
    content
    tags
    approved
  }
}
```

### Update Blog Post

```graphql
mutation {
  updateBlogPost(
    id: "post_id",
    input: {
      title: "Updated title",
      content: "Updated content",
      tags: ["new", "experience"]
    }
  ) {
    id
    title
    content
    tags
  }
}
```

### Delete Blog Post

```graphql
mutation {
  deleteBlogPost(id: "post_id")
}
```

### Approve Blog Post (requires admin or "blog" group)

```graphql
mutation {
  approveBlogPost(id: "post_id") {
    id
    title
    approved
  }
}
```

### Add Comment to Blog Post

```graphql
mutation {
  addComment(input: {
    content: "Very useful information!",
    postId: "post_id"
  }) {
    id
    content
    author {
      _id
      name
    }
    createdAt
  }
}
```

### Delete Comment

```graphql
mutation {
  deleteComment(id: "comment_id")
}
```

### Get Blog Post by ID

```graphql
query {
  getBlogPost(id: "post_id") {
    id
    title
    content
    image
    tags
    approved
    author {
      _id
      name
    }
    comments {
      id
      content
      author {
        name
      }
      createdAt
    }
    createdAt
    updatedAt
  }
}
```

### Get All Blog Posts

```graphql
query {
  getBlogPosts {
    id
    title
    content
    image
    tags
    approved
    author {
      name
    }
    comments {
      id
    }
    createdAt
  }
}
```

## Recipes

### Create Recipe (must be approved by admin or "recipes" group)

```graphql
mutation {
  createRecipe(input: {
    title: "Protein shake",
    description: "Suitable for intake with Kaftrio",
    image: "https://example.com/shake.jpg",
    preparationTime: 10,
    cookingTime: 0,
    servings: 1,
    ingredients: [
      "1 banana",
      "200ml milk",
      "2 tablespoons protein",
      "1 tablespoon honey"
    ],
    instructions: [
      "Mix all ingredients in a blender",
      "Stir until smooth consistency"
    ],
    nutritionalInfo: {
      calories: 350,
      protein: 25,
      carbs: 45,
      fat: 5,
      vitamins: [
        {
          name: "Vitamin C",
          amount: 15,
          unit: "mg"
        }
      ]
    }
  }) {
    id
    title
    approved
  }
}
```

### Update Recipe

```graphql
mutation {
  updateRecipe(
    id: "recipe_id",
    input: {
      title: "Updated title",
      description: "Updated description",
      ingredients: [
        "1 large banana",
        "250ml almond milk",
        "2 tablespoons protein",
        "1 tablespoon honey"
      ]
    }
  ) {
    id
    title
    description
    ingredients
  }
}
```

### Delete Recipe

```graphql
mutation {
  deleteRecipe(id: "recipe_id")
}
```

### Approve Recipe (requires admin or "recipes" group)

```graphql
mutation {
  approveRecipe(id: "recipe_id") {
    id
    title
    approved
  }
}
```

### Get Recipe by ID

```graphql
query {
  getRecipe(id: "recipe_id") {
    id
    title
    description
    image
    preparationTime
    cookingTime
    servings
    ingredients
    instructions
    nutritionalInfo {
      calories
      protein
      carbs
      fat
      vitamins {
        name
        amount
        unit
      }
    }
    author {
      _id
      name
    }
    approved
    createdAt
    updatedAt
  }
}
```

### Get All Recipes

```graphql
query {
  getRecipes {
    id
    title
    description
    preparationTime
    cookingTime
    servings
    ingredients
    nutritionalInfo {
      calories
      protein
    }
    approved
    author {
      name
    }
  }
}
```

## Stories

### Create Story (must be approved by admin)

```graphql
mutation {
  createStory(input: {
    title: "My journey with cystic fibrosis",
    content: "Detailed description of my experience and journey...",
    image: "https://example.com/story.jpg"
  }) {
    id
    title
    approved
  }
}
```

### Update Story

```graphql
mutation {
  updateStory(
    id: "story_id",
    input: {
      title: "Updated title",
      content: "Updated content"
    }
  ) {
    id
    title
    content
  }
}
```

### Delete Story

```graphql
mutation {
  deleteStory(id: "story_id")
}
```

### Approve Story (requires admin)

```graphql
mutation {
  approveStory(id: "story_id") {
    id
    title
    approved
  }
}
```

### Get Story by ID

```graphql
query {
  getStory(id: "story_id") {
    id
    title
    content
    image
    author {
      _id
      name
    }
    approved
    createdAt
    updatedAt
  }
}
```

### Get All Stories

```graphql
query {
  getStories {
    id
    title
    content
    image
    author {
      name
    }
    approved
    createdAt
  }
}
```

## Chat Messages

### Send Message

```graphql
mutation {
  sendChatMessage(input: {
    content: "Hello! I have a question about...",
    receiverId: "user_id",    # ID of recipient (optional)
    roomId: "room_id"         # ID of room (optional)
  }) {
    id
    content
    sender {
      _id
      name
    }
    receiver {
      _id
      name
    }
    roomId
    createdAt
  }
}
```

### Get Messages

```graphql
query {
  getChatMessages(roomId: "room_id", userId: "user_id") {
    id
    content
    sender {
      _id
      name
    }
    receiver {
      _id
      name
    }
    roomId
    createdAt
  }
}
```

## Artificial Intelligence

### Ask a Question to AI

```graphql
query {
  askAI(query: "What are the symptoms of cystic fibrosis?") {
    id
    query
    response
    createdAt
  }
}
```
```