import { RefreshAuthTokenDocument } from '@/graphql/generated/graphql';
import client from '../apolloClient';

export async function getAuthToken(): Promise<string | null> {
  const refreshToken = process.env.NEXTJS_AUTH_REFRESH_TOKEN as string;
  if (!refreshToken) return null;

  try {
    const { data } = await client.mutate({
      mutation: RefreshAuthTokenDocument,
      variables: { token: refreshToken },
      fetchPolicy: 'network-only',
    });

    if (data?.refreshToken?.success) {
      return data.refreshToken.authToken || null;
    }

    return null;
  } catch (error) {
    console.error(
      `[getAuthToken] Error: ${error instanceof Error ? error.message : error}`
    );

    return null;
  }
}
