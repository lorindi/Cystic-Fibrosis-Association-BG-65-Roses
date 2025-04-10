import { gql } from '@apollo/client';
import { USER_FIELDS } from '../fragments/user.fragments';

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