import { gql } from '@apollo/client';

// Fragments
export const USER_FIELDS = gql`
  fragment UserFields on User {
    _id
    name
    email
    role
    isEmailVerified
    createdAt
  }
`;

export const USER_BASIC_FIELDS = gql`
  fragment UserBasicFields on User {
    _id
    name
    email
    isEmailVerified
  }
`;

export const USER_PROFILE_FIELDS = gql`
  fragment UserProfileFields on UserProfile {
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
`;

export const USER_DETAILED_FIELDS = gql`
  fragment UserDetailedFields on User {
    ...UserBasicFields
    role
    createdAt
  }
  ${USER_BASIC_FIELDS}
`;

// Queries
export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    getCurrentUser {
      ...UserDetailedFields
    }
  }
  ${USER_DETAILED_FIELDS}
`;

export const GET_USERS = gql`
  query GetUsers {
    getUsers {
      ...UserDetailedFields
    }
  }
  ${USER_DETAILED_FIELDS}
`;

export const GET_USER = gql`
  query GetUser($id: ID!) {
    getUser(id: $id) {
      ...UserDetailedFields
    }
  }
  ${USER_DETAILED_FIELDS}
`;

export const GET_USERS_BY_ROLE = gql`
  query GetUsersByRole($role: UserRole!) {
    getUsersByRole(role: $role) {
      ...UserDetailedFields
    }
  }
  ${USER_DETAILED_FIELDS}
`;

// Mutations
export const REGISTER = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      user {
        ...UserFields
      }
    }
  }
  ${USER_FIELDS}
`;

export const LOGOUT = gql`
  mutation Logout {
    logout
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($input: ProfileUpdateInput!) {
    updateProfile(input: $input) {
      ...UserFields
    }
  }
  ${USER_FIELDS}
`;

export const SET_USER_ROLE = gql`
  mutation SetUserRole($userId: ID!, $role: UserRole!) {
    setUserRole(userId: $userId, role: $role) {
      ...UserFields
    }
  }
  ${USER_FIELDS}
`;

export const ADD_USER_TO_GROUP = gql`
  mutation AddUserToGroup($userId: ID!, $group: UserGroup!) {
    addUserToGroup(userId: $userId, group: $group) {
      ...UserFields
    }
  }
  ${USER_FIELDS}
`;

export const REMOVE_USER_FROM_GROUP = gql`
  mutation RemoveUserFromGroup($userId: ID!, $group: UserGroup!) {
    removeUserFromGroup(userId: $userId, group: $group) {
      ...UserFields
    }
  }
  ${USER_FIELDS}
`;

export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        ...UserDetailedFields
      }
    }
  }
  ${USER_DETAILED_FIELDS}
`; 