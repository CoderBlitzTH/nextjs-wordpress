import { ApolloLink, HttpLink } from '@apollo/client';
import { loadDevMessages, loadErrorMessages } from '@apollo/client/dev';
import {
  ApolloClient,
  InMemoryCache,
  SSRMultipartLink,
} from '@apollo/experimental-nextjs-app-support';

// Enable detailed error messages in development
if (process.env.NODE_ENV === 'development') {
  loadDevMessages();
  loadErrorMessages();
}

const isServer = typeof window === 'undefined';

/**
 * Creates and configures Apollo Client instance
 * @returns Configured Apollo Client
 */
export function apolloClient() {
  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL, // URL ของ WordPress GraphQL
    credentials: 'include', // ส่ง cookie สำหรับตรวจสอบ session ของผู้ใช้
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const link = isServer
    ? ApolloLink.from([
        new SSRMultipartLink({
          stripDefer: true,
        }),
        httpLink,
      ])
    : httpLink;

  return new ApolloClient({
    cache: new InMemoryCache(),
    link,
    defaultOptions: {
      query: {
        fetchPolicy: 'no-cache',
      },
      watchQuery: {
        fetchPolicy: 'no-cache',
      },
    },
  });
}
