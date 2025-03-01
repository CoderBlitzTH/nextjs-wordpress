import { registerApolloClient } from '@apollo/experimental-nextjs-app-support';
import { createApolloClient } from './apolloConfig';

const { getClient } = registerApolloClient(() => {
  try {
    return createApolloClient();
  } catch (error) {
    console.error('Failed to create Apollo Client:', error);
    throw error;
  }
});

const client = getClient();

export default client;
