// cf-turborepo/packages/adapters/nest-adapter/src/index.ts
import { ApiService, User, UserInput } from '@cf/api-contracts';

const BASE_URL = 'http://localhost:3333/api/nest'

export function createNestAdapter() {
  return {
    async getUsers() {
      try {
        const response = await fetch(`${BASE_URL}/users`)
        if (!response.ok) {
          throw new Error(`Failed to fetch users: ${response.statusText}`)
        }
        return response.json()
      } catch (error) {
        console.error('NestJS API error:', error)
        // Return mock data for demonstration when NestJS isn't running
        return [
          {
            id: '1',
            name: 'NestJS Mock User 1',
            email: 'nest1@example.com',
            role: 'admin',
            createdAt: new Date().toISOString()
          },
          {
            id: '2',
            name: 'NestJS Mock User 2',
            email: 'nest2@example.com',
            role: 'user',
            createdAt: new Date().toISOString()
          }
        ]
      }
    },

    async getUserById(id: string) {
      try {
        const response = await fetch(`${BASE_URL}/users/${id}`)
        if (!response.ok) {
          throw new Error(`Failed to fetch user: ${response.statusText}`)
        }
        return response.json()
      } catch (error) {
        console.error('NestJS API error:', error)
        // Return mock data for demonstration when NestJS isn't running
        return {
          id,
          name: `NestJS Mock User ${id}`,
          email: `nest${id}@example.com`,
          role: id === '1' ? 'admin' : 'user',
          createdAt: new Date().toISOString()
        }
      }
    }
  }
}

export class NestApiService implements ApiService {
  private baseUrl: string;
  
  constructor(baseUrl = '/api/nest') {
    this.baseUrl = baseUrl;
  }
  
  async getUsers(): Promise<User[]> {
    const response = await fetch(`${this.baseUrl}/users`);
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  }
  
  // Добавете тези методи тук
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