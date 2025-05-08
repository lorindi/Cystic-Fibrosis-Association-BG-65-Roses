import { gql } from '@apollo/client';
import { USER_BASIC_FIELDS, USER_DETAILED_FIELDS } from '../fragments/user.fragments';

export const GET_CURRENT_USER = gql`
  query GetCurrentUserQuery {
    getCurrentUser {
      ...UserDetailedFields
    }
  }
  ${USER_DETAILED_FIELDS}
`;

export const GET_USERS = gql`
  query GetUsersListQuery {
    getUsers {
      ...UserDetailedFields
    }
  }
  ${USER_DETAILED_FIELDS}
`;

export const GET_USER = gql`
  query GetUserByIdQuery($id: ID!) {
    getUser(id: $id) {
      ...UserDetailedFields
    }
  }
  ${USER_DETAILED_FIELDS}
`;

export const GET_USERS_BY_ROLE = gql`
  query GetUsersByRoleQuery($role: UserRole!) {
    getUsersByRole(role: $role) {
      ...UserDetailedFields
    }
  }
  ${USER_DETAILED_FIELDS}
`; 