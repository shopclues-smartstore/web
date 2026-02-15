/**
 * Patches generated types.ts for Apollo Client 4 compatibility.
 * Run after codegen (e.g. in codegen hooks.afterAllFileWrite).
 */
const fs = require("fs");
const path = require("path");

const filePath = path.join(
  __dirname,
  "..",
  "src",
  "lib",
  "graphql",
  "generated",
  "types.ts"
);

if (!fs.existsSync(filePath)) {
  process.exit(0);
}

let content = fs.readFileSync(filePath, "utf8");

// Apollo 4: MutationFunction and BaseMutationOptions are not exported from @apollo/client/react
content = content.replace(
  /ApolloReactCommon\.MutationFunction<([^>]+),\s*([^>]+)>/g,
  "ApolloReactHooks.MutationTuple<$1, $2>[0]"
);
content = content.replace(
  /ApolloReactCommon\.BaseMutationOptions<([^>]+),\s*([^>]+)>/g,
  "ApolloReactHooks.MutationHookOptions<$1, $2>"
);

// Remove duplicate overloads for use*SuspenseQuery (Apollo 4 overloads are incompatible; keep implementation only)
content = content.replace(
  /\/\/ @ts-ignore\s*\nexport function use\w+SuspenseQuery\([^)]+\)[^;]+;\s*\nexport function use\w+SuspenseQuery\([^)]+\)[^;]+;\s*\n/g,
  ""
);

// ESLint: avoid `any` in DateTime scalar
content = content.replace(
  /DateTime: \{ input: any; output: any; \}/,
  "DateTime: { input: unknown; output: unknown; }"
);

fs.writeFileSync(filePath, content);
console.log("Patched", filePath);
