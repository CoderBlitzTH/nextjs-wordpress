'use client';

import { useState } from 'react';
import { setVerbosity } from 'ts-invariant';

import { createApolloClient } from '@/lib/apolloConfig';
import { ApolloNextAppProvider } from '@apollo/experimental-nextjs-app-support';

// Enable detailed error messages in development
if (process.env.NODE_ENV === 'development') {
  setVerbosity('debug');
}

/**
 * Apollo Provider wrapper for Next.js application
 * @param props - React children components
 */
export default function ApolloProvider({ children }: React.PropsWithChildren) {
  const [client] = useState(() => createApolloClient());

  return (
    <ApolloNextAppProvider makeClient={() => client}>
      {children}
    </ApolloNextAppProvider>
  );
}
