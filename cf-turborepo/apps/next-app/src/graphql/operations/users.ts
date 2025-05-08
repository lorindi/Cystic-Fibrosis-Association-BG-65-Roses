import { gql } from '@apollo/client';
import { USER_OPERATIONS_DETAILED_FIELDS } from './user';

// Допълнителни заявки за потребители
export const GET_PAGINATED_USERS = gql`
  query GetPaginatedUsers($limit: Int, $offset: Int) {
    getPaginatedUsers(limit: $limit, offset: $offset) {
      users {
        ...UserOperationsDetailedFields
      }
      totalCount
      hasMore
    }
  }
  ${USER_OPERATIONS_DETAILED_FIELDS}
`;

export const GET_USERS_BY_GROUP = gql`
  query GetUsersByGroup($group: UserGroup!, $limit: Int, $offset: Int) {
    getUsersByGroup(group: $group, limit: $limit, offset: $offset) {
      ...UserOperationsDetailedFields
    }
  }
  ${USER_OPERATIONS_DETAILED_FIELDS}
`; 