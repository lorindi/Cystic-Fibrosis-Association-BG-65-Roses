import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

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

// Create the Apollo Client instance
export const client = new ApolloClient({
  link: authLink.concat(httpLink),
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