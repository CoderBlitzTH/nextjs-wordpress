import { GetMenuItemsDocument } from '@/graphql/generated/graphql';
import client from '../apolloClient';
import { getRevalidateOptions } from '../revalidation';

export async function getMenuPrimary() {
  try {
    const { data } = await client.query({
      query: GetMenuItemsDocument,
      context: getRevalidateOptions(undefined, 'menu:primary'),
    });

    return data?.menuItems?.nodes || null;
  } catch (error) {
    console.error(
      `[getMenuPrimary] Error fetching menu items: ${error instanceof Error ? error.message : error}`
    );

    return null;
  }
}
