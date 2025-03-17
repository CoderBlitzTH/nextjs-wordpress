import type { FetchPolicy } from '@apollo/client';

export type ImgSize = {
  name: string;
  sourceUrl: string;
  width: string;
  height: string;
};

export type ImgData = {
  thumbnail?: ImgSize;
  medium?: ImgSize;
  large?: ImgSize;
  full?: ImgSize;
} & Record<string, ImgSize | undefined>;

export type ReadingTimeResult = {
  minutes: number;
  text: string;
};

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
