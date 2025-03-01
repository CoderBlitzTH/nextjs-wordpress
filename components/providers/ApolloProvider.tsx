'use client';

import { ApolloNextAppProvider } from '@apollo/experimental-nextjs-app-support';

import { createApolloClient } from '@/lib/apolloConfig';

/**
 * Apollo Provider wrapper for Next.js application
 * @param props - React children components
 */
export default function ApolloProvider({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={createApolloClient}>
      {children}
    </ApolloNextAppProvider>
  );
}
