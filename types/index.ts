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

export type DynamicRouteArgs = {
  params: Promise<{
    slug: string;
  }>;
};

export type PrebuildParams = {
  params: { slug: string };
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
