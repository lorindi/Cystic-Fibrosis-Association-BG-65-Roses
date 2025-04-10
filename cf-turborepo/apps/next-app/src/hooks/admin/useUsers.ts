import { useQuery } from '@apollo/client';
import { GetUsersQuery, GetUsersQueryVariables } from '@/gql/graphql';
import { USERS_QUERY } from '@/graphql/queries/user';

export const useUsers = (options: { limit?: number; offset?: number; noLimit?: boolean } = {}) => {
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