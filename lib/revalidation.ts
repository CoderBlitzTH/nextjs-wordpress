import config from './config';
import type { GraphQLQueryProps } from './types';

// Construct query options with cache revalidation settings
export function createRevalidateOptions(props?: GraphQLQueryProps['next']) {
  const defaultOptions = { tags: [], revalidate: 0 };
  const options = props || defaultOptions;

  return {
    fetchOptions: {
      next: {
        tags: options.tags || [],
        revalidate: options.revalidate ?? 0,
      },
    },
  };
}

// Create revalidation options with default tag and custom options
export function getRevalidateOptions(
  nextProps: GraphQLQueryProps['next'],
  defaultTag: string
) {
  const defaultOptions = {
    tags: [defaultTag],
    revalidate: config.revalidate,
  };

  return createRevalidateOptions(nextProps ?? defaultOptions);
}
