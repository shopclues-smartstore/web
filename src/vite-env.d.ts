/// <reference types="vite/client" />

declare module "*.gql?raw" {
  const src: string;
  export default src;
}

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  /** Set to "true" to use mock GST lookup when backend returns 404 (for development). */
  readonly VITE_MOCK_GST_LOOKUP?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
