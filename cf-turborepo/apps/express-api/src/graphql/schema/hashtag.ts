import { gql } from 'graphql-tag';

export const hashtagTypeDefs = gql`
  type Hashtag {
    id: ID!
    name: String!
    count: Int!
    categories: [String!]!
    createdAt: Date!
    updatedAt: Date!
  }

  type TaggedContentItem {
    id: ID!
    title: String!
    description: String
    hashtags: [String!]!
    createdAt: Date!
    updatedAt: Date!
    type: String!
  }

  type TaggedContent {
    items: [TaggedContentItem!]!
    totalCount: Int!
  }

  extend type Query {
    # Търсене на хаштагове
    searchHashtags(query: String!, category: String): [Hashtag!]!
    
    # Взимане на популярни хаштагове
    getTrendingHashtags(category: String, limit: Int): [Hashtag!]!
    
    # Взимане на хаштагове по категория
    getHashtagsByCategory(category: String!): [Hashtag!]!

    # Взимане на всички хаштагове с пагинация
    getAllHashtags(page: Int = 1, limit: Int = 20): HashtagPaginatedResponse!

    # Търсене на съдържание по таг
    searchByTag(
      tag: String!, 
      page: Int = 1, 
      limit: Int = 20,
      categories: [String!]
    ): TaggedContent!
  }

  type HashtagPaginatedResponse {
    hashtags: [Hashtag!]!
    totalCount: Int!
    hasNextPage: Boolean!
  }

  extend type Mutation {
    # Създаване на хаштаг
    createHashtag(name: String!, category: String!): Hashtag!
    
    # Изтриване на хаштаг от категория
    removeHashtagFromCategory(name: String!, category: String!): Boolean!

    # Добавяне на хаштагове към кампания
    addHashtagsToCampaign(campaignId: ID!, hashtagIds: [ID!]!): Campaign!

    # Премахване на хаштагове от кампания
    removeHashtagsFromCampaign(campaignId: ID!, hashtagIds: [ID!]!): Campaign!
  }
`; 

// Sample queries:
/*
# Search for content by tag
query SearchByTag($tag: String!, $page: Int!, $limit: Int!, $categories: [String!]) {
  searchByTag(tag: $tag, page: $page, limit: $limit, categories: $categories) {
    items {
      id
      title
      description
      hashtags
      type
    }
    totalCount
  }
}

# Variables example:
{
  "tag": "cysticfibrosis",
  "page": 1,
  "limit": 10,
  "categories": ["medical", "lifestyle"]
}
*/ 