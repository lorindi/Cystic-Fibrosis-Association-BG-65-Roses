import { gql } from "@apollo/client";

export const GET_INITIATIVES = gql`
  query GetInitiatives($limit: Int, $offset: Int, $noLimit: Boolean) {
    getInitiatives(limit: $limit, offset: $offset, noLimit: $noLimit) {
      id
      title
      description
      startDate
      endDate
      participants {
        _id
        name
        email
      }
      createdBy {
        _id
        name
        email
      }
      items {
        id
        name
        description
        quantity
        distributedQuantity
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_INITIATIVE = gql`
  query GetInitiative($id: ID!) {
    getInitiative(id: $id) {
      id
      title
      description
      startDate
      endDate
      participants {
        _id
        name
        email
      }
      createdBy {
        _id
        name
        email
      }
      items {
        id
        name
        description
        quantity
        distributedQuantity
      }
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_INITIATIVE = gql`
  mutation CreateInitiative($input: InitiativeInput!) {
    createInitiative(input: $input) {
      id
      title
      description
      startDate
      endDate
      participants {
        _id
        name
        email
      }
      createdBy {
        _id
        name
        email
      }
      items {
        id
        name
        description
        quantity
        distributedQuantity
      }
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_INITIATIVE = gql`
  mutation UpdateInitiative($id: ID!, $input: InitiativeInput!) {
    updateInitiative(id: $id, input: $input) {
      id
      title
      description
      startDate
      endDate
      participants {
        _id
        name
        email
      }
      createdBy {
        _id
        name
        email
      }
      items {
        id
        name
        description
        quantity
        distributedQuantity
      }
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_INITIATIVE = gql`
  mutation DeleteInitiative($id: ID!) {
    deleteInitiative(id: $id)
  }
`;

export const ADD_INITIATIVE_ITEM = gql`
  mutation AddInitiativeItem($initiativeId: ID!, $input: InitiativeItemInput!) {
    addInitiativeItem(initiativeId: $initiativeId, input: $input) {
      id
      name
      description
      quantity
      distributedQuantity
    }
  }
`;

export const DELETE_INITIATIVE_ITEM = gql`
  mutation DeleteInitiativeItem($itemId: ID!) {
    deleteInitiativeItem(itemId: $itemId)
  }
`; 