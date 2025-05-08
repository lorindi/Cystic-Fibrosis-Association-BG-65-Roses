export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  groups: string[];
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetUsersQuery {
  getUsers: User[];
}

export interface GetUsersQueryVariables {
  limit?: number;
  offset?: number;
  noLimit?: boolean;
} 