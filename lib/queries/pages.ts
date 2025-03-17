import { GetPageDocument } from '@/graphql/generated/graphql';
import client from '../apolloClient';
import { getRevalidateOptions } from '../revalidation';
import type { GraphQLQueryProps } from '../types';
// ฟังก์ชั่นสำหรับดึงข้อมูลหน้าเพจ slug
export async function getPage(props: Omit<GraphQLQueryProps, 'limit'>) {
  if (!props.slug) return null;

  try {
    const { data } = await client.query({
      query: GetPageDocument,
      variables: { slug: props.slug },
      fetchPolicy: props?.fetchPolicy,
      context: getRevalidateOptions(props?.next, `page:${props.slug}`),
    });

    return data?.page || null;
  } catch (error) {
    console.error(
      `[getPage] Error fetching page: ${error instanceof Error ? error.message : error}`
    );
    return null;
  }
}
