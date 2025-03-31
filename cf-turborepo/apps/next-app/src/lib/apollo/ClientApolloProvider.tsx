'use client';

import { ApolloProvider as BaseApolloProvider } from '@apollo/client';
import { client } from './client';
import { ReactNode } from 'react';

interface ClientApolloProviderProps {
  children: ReactNode;
}

export function ClientApolloProvider({ children }: ClientApolloProviderProps) {
  return (
    <BaseApolloProvider client={client}>
      {children}
    </BaseApolloProvider>
  );
} 