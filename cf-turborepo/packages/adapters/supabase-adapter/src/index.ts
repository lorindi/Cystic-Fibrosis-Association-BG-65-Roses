// packages/adapters/supabase-adapter/src/index.ts
import { ApiService, User, UserInput } from '@cf/api-contracts';
import { createClient } from '@supabase/supabase-js';

export class SupabaseApiService implements ApiService {
  private supabase;
  
  constructor(url?: string, key?: string) {
    this.supabase = createClient(
      url || process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      key || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );
  }
  
  async getUsers(): Promise<User[]> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*');
      
    if (error) throw new Error(error.message);
    return data;
  }
  
  async getUserById(id: string): Promise<User | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') return null; // Record not found
      throw new Error(error.message);
    }
    return data;
  }

  async createUser(user: UserInput): Promise<User> {
    const { data, error } = await this.supabase
      .from('users')
      .insert([
        { 
          ...user,
          createdAt: new Date().toISOString()
        }
      ])
      .select()
      .single();
      
    if (error) throw new Error(error.message);
    return data;
  }

  async updateUser(id: string, user: Partial<UserInput>): Promise<User | null> {
    const { data, error } = await this.supabase
      .from('users')
      .update(user)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') return null; // Record not found
      throw new Error(error.message);
    }
    return data;
  }

  async deleteUser(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('users')
      .delete()
      .eq('id', id);
      
    return !error;
  }
}

export function createSupabaseAdapter() {
  return {
    async getUsers() {
      // Mock data for Supabase demonstration
      return [
        {
          id: '1',
          name: 'Supabase Mock User 1',
          email: 'supabase1@example.com',
          role: 'admin',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Supabase Mock User 2',
          email: 'supabase2@example.com',
          role: 'user',
          createdAt: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Supabase Mock User 3',
          email: 'supabase3@example.com',
          role: 'user',
          createdAt: new Date().toISOString()
        }
      ]
    },

    async getUserById(id: string) {
      // Mock data for Supabase demonstration
      return {
        id,
        name: `Supabase Mock User ${id}`,
        email: `supabase${id}@example.com`,
        role: id === '1' ? 'admin' : 'user',
        createdAt: new Date().toISOString()
      }
    }
  }
}