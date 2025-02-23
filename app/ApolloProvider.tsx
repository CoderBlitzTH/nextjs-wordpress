'use client';

import { apolloClient } from '@/lib/apolloClient';
import { ApolloNextAppProvider } from '@apollo/experimental-nextjs-app-support';
import type { PropsWithChildren } from 'react';

/**
 * Apollo Provider wrapper for Next.js application
 * @param props - React children components
 */
export default function ApolloProvider({ children }: PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={apolloClient}>
      {children}
    </ApolloNextAppProvider>
  );
}
