import { gql } from '@apollo/client';

export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    getCurrentUser {
      _id
      name
      email
      role
      groups
      isEmailVerified
      createdAt
      updatedAt
      profile {
        avatar
        bio
        birthDate
        diagnosed
        diagnosisYear
        childName
        companyName
        address {
          city
          postalCode
          street
        }
        contact {
          phone
          alternativeEmail
          emergencyContact {
            name
            phone
            relation
          }
        }
      }
    }
  }
`;

export const GET_USERS = gql`
  query GetUsers($limit: Int, $offset: Int) {
    getUsers(limit: $limit, offset: $offset) {
      _id
      name
      email
      role
      groups
      isEmailVerified
      createdAt
      updatedAt
      profile {
        avatar
      }
    }
  }
`;

export const GET_PAGINATED_USERS = gql`
  query GetPaginatedUsers($limit: Int, $offset: Int) {
    getPaginatedUsers(limit: $limit, offset: $offset) {
      users {
        _id
        name
        email
        role
        groups
        isEmailVerified
        createdAt
        updatedAt
        profile {
          avatar
        }
      }
      totalCount
      hasMore
    }
  }
`;

export const GET_USER = gql`
  query GetUser($id: ID!) {
    getUser(id: $id) {
      _id
      name
      email
      role
      groups
      isEmailVerified
      createdAt
      updatedAt
      profile {
        avatar
        bio
        birthDate
        diagnosed
        diagnosisYear
        childName
        companyName
        address {
          city
          postalCode
          street
        }
        contact {
          phone
          alternativeEmail
          emergencyContact {
            name
            phone
            relation
          }
        }
      }
    }
  }
`;

export const GET_USERS_BY_ROLE = gql`
  query GetUsersByRole($role: UserRole!, $limit: Int, $offset: Int) {
    getUsersByRole(role: $role, limit: $limit, offset: $offset) {
      _id
      name
      email
      role
      groups
      isEmailVerified
      createdAt
      updatedAt
      profile {
        avatar
      }
    }
  }
`;

export const GET_USERS_BY_GROUP = gql`
  query GetUsersByGroup($group: UserGroup!, $limit: Int, $offset: Int) {
    getUsersByGroup(group: $group, limit: $limit, offset: $offset) {
      _id
      name
      email
      role
      groups
      isEmailVerified
      createdAt
      updatedAt
      profile {
        avatar
      }
    }
  }
`; 