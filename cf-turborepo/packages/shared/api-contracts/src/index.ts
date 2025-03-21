// packages/shared/api-contracts/src/index.ts
export interface ApiService {
    // Потребителски CRUD операции
    getUsers(): Promise<User[]>;
    getUserById(id: string): Promise<User | null>;
    createUser(user: UserInput): Promise<User>;
    updateUser(id: string, user: Partial<UserInput>): Promise<User | null>;
    deleteUser(id: string): Promise<boolean>;
  }
  
  export type User = {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'user';
    createdAt: string;
  };
  
  export type UserInput = Omit<User, 'id' | 'createdAt'>;