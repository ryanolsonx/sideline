import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: '../api/schema.gql',
  documents: ['src/**/*.{ts,tsx}'],
  ignoreNoDocuments: true,
  generates: {
    'src/gql/': {
      preset: 'client',
      presetConfig: {
        gqlTagName: 'graphql',
        fragmentMasking: {
          unmaskFunctionName: 'getFragmentData',
        },
      },
    },
  },
};

export default config;
