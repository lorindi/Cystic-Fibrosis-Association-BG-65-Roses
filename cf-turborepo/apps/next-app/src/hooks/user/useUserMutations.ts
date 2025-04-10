import { useMutation } from '@apollo/client';
import { 
  REGISTER, 
  UPDATE_USER, 
  SET_USER_ROLE,
  ADD_USER_TO_GROUP,
  REMOVE_USER_FROM_GROUP
} from '@/graphql/mutations/user.mutations';
import { GET_USERS } from '@/graphql/queries/user.queries';
import type { 
  RegisterMutation, 
  RegisterMutationVariables,
  UpdateUserMutation,
  UpdateUserMutationVariables,
  SetUserRoleMutation,
  SetUserRoleMutationVariables,
  UserRole,
  ProfileUpdateInput,
  UserGroup
} from '@/graphql/generated/graphql';

export const useUserMutations = () => {
  const [register] = useMutation<RegisterMutation, RegisterMutationVariables>(
    REGISTER,
    { refetchQueries: [{ query: GET_USERS }] }
  );

  const [updateUser] = useMutation<UpdateUserMutation, UpdateUserMutationVariables>(
    UPDATE_USER,
    { refetchQueries: [{ query: GET_USERS }] }
  );

  const [setUserRole] = useMutation<SetUserRoleMutation, SetUserRoleMutationVariables>(
    SET_USER_ROLE,
    { refetchQueries: [{ query: GET_USERS }] }
  );

  const [addUserToGroup] = useMutation(
    ADD_USER_TO_GROUP,
    { refetchQueries: [{ query: GET_USERS }] }
  );

  const [removeUserFromGroup] = useMutation(
    REMOVE_USER_FROM_GROUP,
    { refetchQueries: [{ query: GET_USERS }] }
  );

  return {
    register: async (input: RegisterMutationVariables['input']) => {
      const { data } = await register({ variables: { input } });
      return data?.register;
    },
    updateUser: async (id: string, input: ProfileUpdateInput) => {
      const { data } = await updateUser({ variables: { id, input } });
      return data?.updateProfile;
    },
    setUserRole: async (userId: string, role: UserRole) => {
      const { data } = await setUserRole({ variables: { userId, role } });
      return data?.setUserRole;
    },
    addUserToGroup: async (userId: string, group: UserGroup) => {
      const { data } = await addUserToGroup({ variables: { userId, group } });
      return data?.addUserToGroup;
    },
    removeUserFromGroup: async (userId: string, group: UserGroup) => {
      const { data } = await removeUserFromGroup({ variables: { userId, group } });
      return data?.removeUserFromGroup;
    }
  };
}; 