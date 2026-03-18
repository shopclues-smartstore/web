import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: [
    {
      [`${process.env.VITE_API_URL || "http://localhost:3000"}/graphql`]: {
        headers: {
          // Add any headers needed for schema introspection
          // For example, if your GraphQL endpoint requires auth:
          // Authorization: `Bearer ${process.env.GRAPHQL_INTROSPECTION_TOKEN || ""}`,
        },
      },
    },
  ],
  documents: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "src/lib/graphql/operations/**/*.gql",
  ],
  generates: {
    "./src/lib/graphql/generated/": {
      preset: "client",
      plugins: [],
      presetConfig: {
        gqlTagName: "gql",
      },
    },
    "./src/lib/graphql/generated/types.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo",
      ],
      config: {
        skipTypename: false,
        withComponent: false,
        withHOC: false,
        withRefetchFn: true,
        enumsAsTypes: true,
        gqlImport: "@apollo/client#gql",
        // Apollo Client 4: hooks and types live in @apollo/client/react
        apolloReactCommonImportFrom: "@apollo/client/react",
        apolloReactHooksImportFrom: "@apollo/client/react",
      },
    },
  },
  hooks: {
    afterAllFileWrite: ["node scripts/patch-codegen-types.cjs"],
  },
};

export default config;
