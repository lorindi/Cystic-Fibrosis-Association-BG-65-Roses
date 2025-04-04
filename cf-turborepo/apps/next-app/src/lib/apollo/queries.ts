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
  query GetUsers {
    getUsers {
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
  query GetUsersByRole($role: UserRole!) {
    getUsersByRole(role: $role) {
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
  query GetUsersByGroup($group: UserGroup!) {
    getUsersByGroup(group: $group) {
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