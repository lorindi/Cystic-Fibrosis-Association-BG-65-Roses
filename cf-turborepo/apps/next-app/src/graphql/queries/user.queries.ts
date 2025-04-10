import { gql } from '@apollo/client';
import { USER_BASIC_FIELDS, USER_DETAILED_FIELDS } from '../fragments/user.fragments';

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