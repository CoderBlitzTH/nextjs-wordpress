import type { CodegenConfig } from '@graphql-codegen/cli';
import { loadEnvConfig } from '@next/env';

const projectDir = process.cwd();
loadEnvConfig(projectDir);

const config: CodegenConfig = {
  overwrite: true,
  schema: {
    [process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL as string]: {
      headers: {
        'User-Agent': 'Codegen',
        // Authorization: 'Bearer your-token',
      },
    },
  },
  documents: ['graphql/**/*.ts'],
  generates: {
    'gql/': {
      preset: 'client',
      plugins: [],
      presetConfig: {
        gqlTagName: 'gql',
      },
    },
    'gql/schema.gql': {
      plugins: ['schema-ast'],
    },
  },
};

export default config;
