'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useApolloClient, useMutation, useQuery } from '@apollo/client';
import { useRouter, usePathname } from 'next/navigation';
import { 
  GET_CURRENT_USER, 
  LOGOUT, 
  REFRESH_TOKEN, 
  INVALIDATE_TOKEN, 
  INVALIDATE_ALL_TOKENS,
  GET_USER_SESSIONS, 
  GET_LOGIN_HISTORY 
} from '@/graphql/operations';
import { User } from '@/graphql/generated/graphql';
import { isPublicPath, isProtectedPath, PUBLIC_PATHS, AUTH_PROTECTED_PATHS } from '@/lib/constants';

// Интерфейси за сесиите и историята на логванията
interface UserSession {
  id: string;
  ip: string;
  userAgent: string;
  createdAt: string;
  expiresAt: string;
}

interface LoginHistory {
  id: string;
  ip: string;
  userAgent: string;
  status: string;
  loggedInAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  refreshToken: () => Promise<string | null>;
  invalidateCurrentSession: () => Promise<boolean>;
  invalidateAllSessions: () => Promise<boolean>;
  getUserSessions: () => Promise<UserSession[]>;
  getLoginHistory: (limit?: number) => Promise<LoginHistory[]>;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const client = useApolloClient();
  const router = useRouter();
  const pathname = usePathname();
  
  // Мутации за обновяване и инвалидиране на токени
  const [refreshTokenMutation] = useMutation(REFRESH_TOKEN);
  const [invalidateTokenMutation] = useMutation(INVALIDATE_TOKEN);
  const [invalidateAllTokensMutation] = useMutation(INVALIDATE_ALL_TOKENS);

  // Проверка дали текущият път изисква автентикация
  const isProtectedPath = () => {
    if (!pathname) return false;
    return AUTH_PROTECTED_PATHS.some(path => pathname.startsWith(path));
  };

  // Проверка дали текущият път е публичен (не изисква автентикация)
  const isPublicPath = () => {
    if (!pathname) return false;
    return PUBLIC_PATHS.some(path => pathname.startsWith(path));
  };

  // Проверка за автентикация при инициализиране на приложението
  useEffect(() => {
    const initAuth = async () => {
      // Ако сме на публична страница, не е нужно да проверяваме автентикацията
      if (isPublicPath() && pathname !== '/') {
        setLoading(false);
        return;
      }
      
      const isAuth = await checkAuth();
      
      // Ако сме на защитена страница и не сме автентикирани, 
      // пренасочваме към страницата за вход
      if (isProtectedPath() && !isAuth) {
        // Запазваме текущия URL за да можем да пренасочим потребителя след успешен вход
        sessionStorage.setItem('redirectAfterLogin', pathname || '');
        router.push('/sign-in');
        return;
      }
      
      // Ако сме на страницата за вход и вече сме автентикирани,
      // пренасочваме към запазения URL или към началната страница
      if ((pathname === '/sign-in' || pathname === '/create-account') && isAuth) {
        const redirectUrl = sessionStorage.getItem('redirectAfterLogin') || '/';
        sessionStorage.removeItem('redirectAfterLogin');
        router.push(redirectUrl);
      }
    };
    
    initAuth();
  }, [pathname]);

  // Function to check user authentication
  const checkAuth = async (): Promise<boolean> => {
    // If we're on a public page, no need to check authentication
    // except for the home page (/)
    if (isPublicPath() && pathname !== '/') {
      setLoading(false);
      return false;
    }
    
    // If we already have a user in the state and it's valid,
    // we don't need to make a new request
    if (user && user._id) {
      setLoading(false);
      return true;
    }
    
    try {
      console.log('Checking authentication...');
      setLoading(true);
      
      // In a try-catch block we check if we have an active session
      // with an option for silent error handling
      const { data, error } = await client.query({
        query: GET_CURRENT_USER,
        fetchPolicy: 'network-only',
        errorPolicy: 'ignore'
      }).catch((error) => {
        // Silently handle errors - return an object with null data
        console.error('Query error caught:', error);
        return { data: null, error };
      });

      if (error) {
        console.log('Authentication error:', error.message);
        setUser(null);
        setLoading(false);
        return false;
      }

      if (data?.getCurrentUser) {
        console.log('User authenticated:', data.getCurrentUser.name);
        setUser(data.getCurrentUser);
        setLoading(false);
        return true;
      } else {
        console.log('No authenticated user found');
        setUser(null);
        setLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Unexpected auth check error:', error);
      setUser(null);
      setLoading(false);
      return false;
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
    
    // Проверка дали има запазен URL за пренасочване след успешен вход
    if (typeof window !== 'undefined') {
      const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
      if (redirectUrl) {
        sessionStorage.removeItem('redirectAfterLogin');
        router.push(redirectUrl);
      }
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out...');
      // First update the local state
      setUser(null);
      
      // Then clear the cache to stop at least local requests
      await client.clearStore();
      
      // Finally call the logout mutation
      await client.mutate({
        mutation: LOGOUT,
        // Work in a new context that doesn't have a token
        context: {
          headers: {
            // Remove any credentials
            credentials: 'omit'
          },
        },
        // Ignore errors since we've already cleared the local state
        errorPolicy: 'ignore'
      });
      
      console.log('Logout successful');
      
      // Add a small delay so requests can be terminated
      // before redirection
      setTimeout(() => {
        router.push('/sign-in');
      }, 100);
    } catch (error) {
      console.error('Logout failed:', error);
      // Clear the cache and local state, even in case of an error
      await client.clearStore();
      
      // Redirect after a moment
      setTimeout(() => {
        router.push('/sign-in');
      }, 100);
    }
  };
  
  // Функция за ръчно обновяване на токена
  const refreshToken = async (): Promise<string | null> => {
    // Ако сме на публична страница, не е нужно да обновяваме токена
    if (isPublicPath() && pathname !== '/') {
      return null;
    }
    
    try {
      const { data } = await refreshTokenMutation({
        fetchPolicy: 'no-cache'
      });
      
      if (data?.refreshToken) {
        const { token, user: refreshedUser } = data.refreshToken;
        
        // Обновяваме кеша с актуализираните данни за потребителя
        client.writeQuery({
          query: GET_CURRENT_USER,
          data: {
            getCurrentUser: refreshedUser
          }
        });
        
        setUser(refreshedUser);
        return token;
      }
      
      return null;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return null;
    }
  };
  
  // Функция за инвалидиране на текущата сесия
  const invalidateCurrentSession = async (): Promise<boolean> => {
    try {
      const { data } = await invalidateTokenMutation();
      
      if (data?.invalidateToken) {
        // При успешно инвалидиране на сесията, обновяваме и локалното състояние
        setUser(null);
        await client.resetStore();
      }
      
      return !!data?.invalidateToken;
    } catch (error) {
      console.error('Failed to invalidate current session:', error);
      return false;
    }
  };
  
  // Функция за инвалидиране на всички сесии
  const invalidateAllSessions = async (): Promise<boolean> => {
    try {
      const { data } = await invalidateAllTokensMutation();
      
      if (data?.invalidateAllTokens) {
        // При успешно инвалидиране на всички сесии, обновяваме и локалното състояние
        setUser(null);
        await client.resetStore();
      }
      
      return !!data?.invalidateAllTokens;
    } catch (error) {
      console.error('Failed to invalidate all sessions:', error);
      return false;
    }
  };
  
  // Функция за получаване на активните сесии
  const getUserSessions = async (): Promise<UserSession[]> => {
    if (!user) return [];
    
    try {
      const { data } = await client.query({
        query: GET_USER_SESSIONS,
        fetchPolicy: 'network-only'
      });
      
      return data?.getUserSessions || [];
    } catch (error) {
      console.error('Failed to get user sessions:', error);
      return [];
    }
  };
  
  // Функция за получаване на историята на логванията
  const getLoginHistory = async (limit = 10): Promise<LoginHistory[]> => {
    if (!user) return [];
    
    try {
      const { data } = await client.query({
        query: GET_LOGIN_HISTORY,
        variables: { limit },
        fetchPolicy: 'network-only'
      });
      
      return data?.getLoginHistory || [];
    } catch (error) {
      console.error('Failed to get login history:', error);
      return [];
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
        refreshToken,
        invalidateCurrentSession,
        invalidateAllSessions,
        getUserSessions,
        getLoginHistory,
        checkAuth,
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