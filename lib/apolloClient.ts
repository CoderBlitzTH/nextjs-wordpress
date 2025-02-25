import { registerApolloClient } from '@apollo/experimental-nextjs-app-support';
import { createApolloClient } from './apolloConfig';

export const { getClient, query, PreloadQuery } = registerApolloClient(() => {
  try {
    return createApolloClient();
  } catch (error) {
    console.error('Failed to create Apollo Client:', error);
    throw error;
  }
});
