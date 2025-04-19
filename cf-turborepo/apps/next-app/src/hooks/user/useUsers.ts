import { useQuery } from '@apollo/client';
import { GET_USERS, GET_USERS_BY_ROLE } from '@/graphql/operations';
import type { 
  GetUsersQuery, 
  GetUsersByRoleQuery, 
  UserRole 
} from '@/graphql/generated/graphql';

interface UseUsersOptions {
  role?: UserRole;
}

export const useUsers = (options: UseUsersOptions = {}) => {
  const query = options.role ? GET_USERS_BY_ROLE : GET_USERS;
  const variables = options.role ? { role: options.role } : {};

  const { data, loading, error } = useQuery(
    query,
    { variables }
  );

  return {
    users: (options.role ? data?.getUsersByRole : data?.getUsers) || [],
    loading,
    error
  };
}; 