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
  documents: ["src/**/*.{ts,tsx}", "!src/**/*.d.ts"],
  generates: {
    "./src/lib/graphql/generated/": {
      preset: "client",
      plugins: [],
      presetConfig: {
        gqlTagName: "gql",
      },
    },
    "./src/lib/graphql/generated/types.ts": {
      plugins: ["typescript", "typescript-operations"],
      config: {
        skipTypename: false,
        withHooks: true,
        withComponent: false,
        withHOC: false,
        withRefetchFn: true,
        enumsAsTypes: true,
      },
    },
  },
  hooks: {
    afterAllFileWrite: ["prettier --write"],
  },
};

export default config;
