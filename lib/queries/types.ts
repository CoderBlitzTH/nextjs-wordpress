import type { FetchPolicy } from '@apollo/client';

// Query
export type GraphQLQueryProps = {
  slug: string;
  limit?: number;
  fetchPolicy?: FetchPolicy;
  next?: {
    tags: string[];
    revalidate: number;
  };
};

export type GetPostsBySearchProps = Omit<GraphQLQueryProps, 'slug'> & {
  search: string;
};
