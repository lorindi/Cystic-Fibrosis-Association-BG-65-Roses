import { ApolloClient, InMemoryCache, createHttpLink, fromPromise, ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { REFRESH_TOKEN } from '@/graphql/operations/auth';

// Променлива за управление на текущото обновяване на токена
let isRefreshing = false;
let pendingRequests: Function[] = [];

// Функция за изпълнение на заявките, които са чакали обновяване на токена
const resolvePendingRequests = () => {
  pendingRequests.forEach((callback) => callback());
  pendingRequests = [];
};

// Create an HTTP link to your GraphQL API
const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:5000/graphql',
  credentials: 'include', // Важно за cookies
});

// Create an auth link to add authentication headers
const authLink = setContext((_, { headers }) => {
  // Return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
    }
  }
});

// Масив от съобщения за грешки, свързани с автентикация, които да прихващаме
const AUTH_ERROR_MESSAGES = [
  'token expired', 
  'invalid token', 
  'not authenticated',
  'не сте влезли в системата',
  'сесията е изтекла',
  'jwt'
];

// Масив от публични пътища, които не трябва да водят до пренасочване към login
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

// Помощна функция за проверка дали съобщението е свързано с автентикация
const isAuthError = (message: string): boolean => {
  message = message.toLowerCase();
  return AUTH_ERROR_MESSAGES.some(errMsg => message.includes(errMsg.toLowerCase()));
};

// Проверява дали текущият път е публичен (не изисква автентикация)
const isPublicPath = (): boolean => {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname;
  return PUBLIC_PATHS.some(publicPath => path.startsWith(publicPath));
};

// Проверка дали вече сме направили опит за обновяване на токена
// и е неуспешно, за да избегнем безкрайни опити
let tokenRefreshFailed = false;

// Error handling link за автоматично обновяване на токена
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  // Ако вече знаем, че обновяването на токена е неуспешно и сме на публичен път,
  // не се опитваме да обновяваме токена отново
  if (tokenRefreshFailed && isPublicPath()) {
    return forward(operation);
  }

  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      // Проверка дали грешката е свързана с автентикация
      if (isAuthError(err.message)) {
        // Ако сме на публична страница (като sign-in, register), не се опитваме да обновяваме токена
        if (isPublicPath() && !operation.operationName?.includes('RefreshToken')) {
          console.log("Пропускаме обновяване на токена за публична страница:", window?.location?.pathname);
          return forward(operation);
        }

        // Предотвратяваме множество заявки за обновяване на токена едновременно
        if (!isRefreshing) {
          isRefreshing = true;
          console.log("Опит за обновяване на токена поради автентикационна грешка", err.message);
          
          // Връщаме Promise, който ще се резолвне когато токенът бъде обновен
          return fromPromise(
            client.mutate({
              mutation: REFRESH_TOKEN,
              fetchPolicy: 'no-cache'
            })
              .then(({ data }) => {
                const newToken = data?.refreshToken?.token;
                if (!newToken) {
                  console.log('Неуспешно обновяване на токена, няма данни', data);
                  tokenRefreshFailed = true;
                  throw new Error('Failed to refresh token');
                }
                
                // Токенът е обновен успешно
                console.log('Token refreshed successfully');
                tokenRefreshFailed = false;
                resolvePendingRequests();
                return forward(operation);
              })
              .catch(error => {
                // При неуспех изчистваме чакащите заявки
                pendingRequests = [];
                console.error('Error refreshing token:', error);
                tokenRefreshFailed = true;
                
                // Ако сме получили грешка при обновяване на токена, 
                // вероятно потребителят трябва да се логне отново
                if (typeof window !== 'undefined' && !isPublicPath()) {
                  // Запазваме текущия URL за да може потребителят да се върне след логин
                  sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
                  
                  // Ако не сме на страницата за логин, пренасочваме натам
                  if (!window.location.pathname.includes('/sign-in')) {
                    window.location.href = '/sign-in';
                    return new Promise(() => {});
                  }
                }
                
                // Връщаме грешката за обработка от приложението
                return forward(operation);
              })
              .finally(() => {
                isRefreshing = false;
              })
          ).flatMap(() => forward(operation));
        } else {
          // Ако вече се обновява токенът, добавяме заявката към чакащите
          return fromPromise(
            new Promise(resolve => {
              pendingRequests.push(() => resolve(null));
            })
          ).flatMap(() => forward(operation));
        }
      }
    }
  }
  
  if (networkError) {
    console.error(`[Network error]:`, networkError);
    // Проверка дали мрежовата грешка е свързана с автентикацията
    if (networkError.message && isAuthError(networkError.message)) {
      // Тук може да се добави логика за пренасочване при мрежови грешки с автентикация
      console.log("Мрежова грешка с автентикация", networkError.message);
    }
  }
});

// Създаваме кеш с типови политики
const cache = new InMemoryCache({
  typePolicies: {
    User: {
      keyFields: ['_id'],
      fields: {
        profile: {
          // Функция за сливане на profile обектите
          merge(existing, incoming, { mergeObjects }) {
            // Ако нямаме съществуващ обект, просто връщаме новия
            if (!existing) return incoming;
            
            // Обединяваме съществуващите и новите данни
            return mergeObjects(existing, incoming);
          }
        },
        createdAt: {
          read(existing) {
            return existing || new Date().toISOString();
          }
        }
      }
    }
  }
});

// Комбинираме линковете
const link = ApolloLink.from([
  errorLink,
  authLink,
  httpLink
]);

// Create the Apollo Client instance
export const client = new ApolloClient({
  link,
  cache,
  ssrMode: typeof window === 'undefined',
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
    },
    query: {
      fetchPolicy: 'network-only',
    },
  },
}); 