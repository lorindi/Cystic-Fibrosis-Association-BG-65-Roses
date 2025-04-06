import { gql } from "@apollo/client";

// Заявка за получаване на потребители по роля
export const GET_USERS_BY_ROLE = gql`
  query GetUsersByRole($role: String!) {
    getUsersByRole(role: $role) {
      id
      name
      email
      role
    }
  }
`;

// Заявка за получаване на всички потребители
export const GET_USERS = gql`
  query GetUsers {
    getUsers {
      id
      name
      email
      role
    }
  }
`;

// Заявка за получаване на конкретен потребител
export const GET_USER = gql`
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      name
      email
      role
      createdAt
      updatedAt
    }
  }
`; 