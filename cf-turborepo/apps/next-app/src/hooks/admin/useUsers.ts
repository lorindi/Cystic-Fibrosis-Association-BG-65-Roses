import { useQuery } from '@apollo/client';
import { GetUsersQuery, GetUsersQueryVariables } from '@/gql/graphql';
import { USERS_QUERY } from '@/graphql/queries/user';

interface UseUsersOptions {
  limit?: number;
  offset?: number;
  noLimit?: boolean;
}

export const useUsers = (options: UseUsersOptions = { limit: 10, offset: 0 }) => {
  const { data, loading, error, refetch } = useQuery<GetUsersQuery, GetUsersQueryVariables>(
    USERS_QUERY,
    {
      variables: {
        limit: options.limit,
        offset: options.offset,
        noLimit: options.noLimit
      }
    }
  );

  return {
    users: data?.getUsers || [],
    loading,
    error,
    refetch
  };
}; 