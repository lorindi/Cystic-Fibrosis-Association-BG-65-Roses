import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: '../express-api/src/graphql/schema/**/*.ts', // път към вашата GraphQL схема
  documents: [
    'src/graphql/queries/**/*.ts', 
    'src/graphql/mutations/**/*.ts',
    'src/graphql/fragments/**/*.ts',
    'src/graphql/operations/**/*.ts'
  ], // път към вашите операции
  generates: {
    'src/graphql/generated/graphql.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo'
      ],
      config: {
        withHooks: true,
        skipTypename: false,
        enumsAsTypes: true,
        scalars: {
          Date: 'string',
          Upload: 'File'
        }
      }
    }
  },
  ignoreNoDocuments: true,
  verbose: true,
  watch: process.env.NODE_ENV === 'development'
};

export default config; 