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

const AUTH_PROTECTED_PATHS = [
  '/profile',
  '/admin',
  '/dashboard',
  '/settings',
  '/user'
];

// Публични пътища, за които не е нужно пренасочване при липса на автентикация
const PUBLIC_PATHS = [
  '/sign-in',
  '/create-account',
  '/verify-email',
  '/forgotten-password',
  '/',
  '/about',
  '/contact',
  '/faq'
];

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
        sessionStorage.setItem('redirectAfterLogin', pathname);
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

  // Функция за проверка на автентикацията на потребителя
  const checkAuth = async (): Promise<boolean> => {
    // Ако сме на публична страница, не е нужно да проверяваме автентикацията
    if (isPublicPath() && pathname !== '/') {
      setLoading(false);
      return false;
    }
    
    try {
      console.log('Checking authentication...');
      setLoading(true);
      
      const { data, error } = await client.query({
        query: GET_CURRENT_USER,
        fetchPolicy: 'network-only'
      });

      if (error) {
        console.error('GraphQL error:', error);
        setUser(null);
        setLoading(false);
        return false;
      }

      if (data?.getCurrentUser) {
        console.log('User authenticated:', data.getCurrentUser);
        setUser(data.getCurrentUser);
        setLoading(false);
        return true;
      } else {
        console.log('No user data received');
        setUser(null);
        setLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Auth check failed:', error);
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
      // Извикваме logout мутацията
      await client.mutate({
        mutation: LOGOUT
      });
      
      setUser(null);
      // Изчистваме кеша
      await client.resetStore();
      console.log('Logout successful');
      
      // Пренасочваме към началната страница след изход
      router.push('/sign-in');
    } catch (error) {
      console.error('Logout failed:', error);
      // Дори при неуспешен изход на сървъра, изчистваме локалното състояние
      setUser(null);
      await client.resetStore();
      
      // В случай на грешка, все пак пренасочваме към страницата за вход
      router.push('/sign-in');
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