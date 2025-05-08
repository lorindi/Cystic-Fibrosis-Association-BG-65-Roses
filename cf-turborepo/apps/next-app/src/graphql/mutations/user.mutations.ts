import { gql } from '@apollo/client';
import { USER_FIELDS, USER_DETAILED_FIELDS } from '../fragments/user.fragments';

export const REGISTER = gql`
  mutation RegisterMutation($input: RegisterInput!) {
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
  mutation LogoutMutation {
    logout
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUserMutation($input: ProfileUpdateInput!) {
    updateProfile(input: $input) {
      ...UserFields
    }
  }
  ${USER_FIELDS}
`;

export const SET_USER_ROLE = gql`
  mutation SetUserRoleMutation($userId: ID!, $role: UserRole!) {
    setUserRole(userId: $userId, role: $role) {
      ...UserFields
    }
  }
  ${USER_FIELDS}
`;

export const ADD_USER_TO_GROUP = gql`
  mutation AddUserToGroupMutation($userId: ID!, $group: UserGroup!) {
    addUserToGroup(userId: $userId, group: $group) {
      ...UserFields
    }
  }
  ${USER_FIELDS}
`;

export const REMOVE_USER_FROM_GROUP = gql`
  mutation RemoveUserFromGroupMutation($userId: ID!, $group: UserGroup!) {
    removeUserFromGroup(userId: $userId, group: $group) {
      ...UserFields
    }
  }
  ${USER_FIELDS}
`;

export const LOGIN = gql`
  mutation LoginMutation($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        ...UserDetailedFields
      }
    }
  }
  ${USER_DETAILED_FIELDS}
`; 