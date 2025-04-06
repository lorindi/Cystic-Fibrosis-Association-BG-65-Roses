import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Create an HTTP link to your GraphQL API
const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:5000/graphql',
});

// Create an auth link to add authentication headers
const authLink = setContext((_, { headers }) => {
  // Get the authentication token from local storage if it exists
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  // Return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

// Създаваме кеш с типови политики
const cache = new InMemoryCache({
  typePolicies: {
    User: {
      fields: {
        profile: {
          // Функция за сливане на profile обектите
          merge(existing, incoming, { mergeObjects }) {
            // Ако нямаме съществуващ обект, просто връщаме новия
            if (!existing) return incoming;
            
            // Обединяваме съществуващите и новите данни
            return mergeObjects(existing, incoming);
          }
        }
      }
    }
  }
});

// Create the Apollo Client instance
export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache, // Използваме новоконфигурирания кеш
  ssrMode: typeof window === 'undefined',
}); 