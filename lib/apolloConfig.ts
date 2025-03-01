import {
  ApolloLink,
  createHttpLink,
  NormalizedCacheObject,
} from '@apollo/client';
import { loadDevMessages, loadErrorMessages } from '@apollo/client/dev';
import { onError } from '@apollo/client/link/error';
import {
  ApolloClient,
  InMemoryCache,
  SSRMultipartLink,
} from '@apollo/experimental-nextjs-app-support';
import { getCookie } from 'cookies-next';
import crossFetch from 'cross-fetch';
import { setVerbosity } from 'ts-invariant';

// Enable detailed error messages in development
if (process.env.NODE_ENV === 'development') {
  setVerbosity('debug');
  loadDevMessages();
  loadErrorMessages();
}

const isServer = typeof window === 'undefined';

/**
 * Creates an instance of ApolloClient and sets up the links.
 *
 * In development, enables detailed error messages.
 * In production, enables caching.
 *
 * @returns {ApolloClient<NormalizedCacheObject>} The created ApolloClient instance.
 */
export function createApolloClient(): ApolloClient<NormalizedCacheObject> {
  // Error handling link
  const errorLink = onError(({ graphQLErrors, networkError }) => {
    graphQLErrors?.forEach(({ message, locations, path }) =>
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
    networkError && console.error(`[Network error]: ${networkError}`);
  });

  const httpLink = createHttpLink({
    uri: process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    fetch: crossFetch,
  });

  // Authentication link
  const authLink = new ApolloLink((operation, forward) => {
    if (!isServer) {
      const token = getCookie('authToken'); // ดึง token จาก Cookie (ใช้ได้เฉพาะ client)
      if (token && typeof token === 'string' && token.length > 0) {
        operation.setContext({ headers: { Authorization: `Bearer ${token}` } });
      }
    }
    return forward(operation);
  });

  // Combine the links
  const link = isServer
    ? ApolloLink.from([
        new SSRMultipartLink({ stripDefer: true }),
        errorLink,
        httpLink,
      ])
    : ApolloLink.from([authLink, errorLink, httpLink]);

  // Create the ApolloClient instance
  return new ApolloClient({
    cache: new InMemoryCache(),
    link,
    defaultOptions: {
      query: { fetchPolicy: isServer ? 'network-only' : 'cache-first' },
      watchQuery: { fetchPolicy: isServer ? 'network-only' : 'cache-first' },
    },
  });
}
