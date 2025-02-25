import type { CodegenConfig } from '@graphql-codegen/cli';
import { loadEnvConfig } from '@next/env';

const projectDir = process.cwd();
loadEnvConfig(projectDir);

const schemaUrl = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL;
if (!schemaUrl) {
  throw new Error('NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL is not defined in .env');
}

const config: CodegenConfig = {
  schema: schemaUrl,
  documents: 'graphql/**/*.gql',
  generates: {
    'graphql/generated/': {
      preset: 'client',
      presetConfig: {
        fragmentMasking: false,
        gqlTagName: 'gql',
      },
      plugins: [],
    },
  },
};

export default config;
