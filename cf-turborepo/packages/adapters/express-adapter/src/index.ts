// packages/adapters/express-adapter/src/index.ts
import { ApiService, User, UserInput } from '@cf/api-contracts';

const BASE_URL = 'http://localhost:5001/api/express'

export function createExpressAdapter() {
  return {
    async getUsers() {
      const response = await fetch(`${BASE_URL}/users`)
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`)
      }
      return response.json()
    },

    async getUserById(id: string) {
      const response = await fetch(`${BASE_URL}/users/${id}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch user: ${response.statusText}`)
      }
      return response.json()
    }
  }
}

export class ExpressApiService implements ApiService {
  private baseUrl: string;
  
  constructor(baseUrl = '/api/express') {
    this.baseUrl = baseUrl;
  }
  
  async getUsers(): Promise<User[]> {
    const response = await fetch(`${this.baseUrl}/users`);
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  }
  
  async getUserById(id: string): Promise<User | null> {
    const response = await fetch(`${this.baseUrl}/users/${id}`);
    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`Failed to fetch user ${id}`);
    return response.json();
  }
  
  async createUser(user: UserInput): Promise<User> {
    const response = await fetch(`${this.baseUrl}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    if (!response.ok) throw new Error('Failed to create user');
    return response.json();
  }
  
  async updateUser(id: string, user: Partial<UserInput>): Promise<User | null> {
    const response = await fetch(`${this.baseUrl}/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`Failed to update user ${id}`);
    return response.json();
  }
  
  async deleteUser(id: string): Promise<boolean> {
    const response = await fetch(`${this.baseUrl}/users/${id}`, {
      method: 'DELETE'
    });
    return response.ok;
  }
}