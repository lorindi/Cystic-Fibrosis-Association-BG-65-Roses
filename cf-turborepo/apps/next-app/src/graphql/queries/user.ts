import { gql } from '@apollo/client';

export const USERS_QUERY = gql`
  query GetUsersWithParams($limit: Int, $offset: Int, $noLimit: Boolean) {
    getUsers(limit: $limit, offset: $offset, noLimit: $noLimit) {
      _id
      name
      email
      role
      groups
      isEmailVerified
      createdAt
      updatedAt
    }
  }
`; 