'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useApolloClient } from '@apollo/client';
import { GET_CURRENT_USER } from '@/graphql/queries/user.queries';
import { LOGOUT } from '@/graphql/mutations/user.mutations';
import { User } from '../apollo/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const client = useApolloClient();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      console.log('Checking authentication...');
      const { data, error } = await client.query({
        query: GET_CURRENT_USER,
        fetchPolicy: 'network-only'
      });

      if (error) {
        console.error('GraphQL error:', error);
        setUser(null);
        return;
      }

      if (data?.getCurrentUser) {
        console.log('User authenticated:', data.getCurrentUser);
        setUser(data.getCurrentUser);
      } else {
        console.log('No user data received');
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (token: string, userData: User) => {
    console.log('Logging in user:', userData);
    
    // Убеждаваме се, че имаме всички нужни полета
    const user = {
      ...userData,
      createdAt: userData.createdAt || new Date().toISOString()
    };
    
    setUser(user);
    
    // Обновяваме кеша с текущия потребител
    client.writeQuery({
      query: GET_CURRENT_USER,
      data: {
        getCurrentUser: user
      }
    });
  };

  const logout = async () => {
    try {
      console.log('Logging out...');
      // Извикваме logout мутацията
      await client.mutate({
        mutation: LOGOUT
      });
      
      setUser(null);
      // Изчистваме кеша
      await client.resetStore();
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 