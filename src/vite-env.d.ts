/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_SECURE_LOCAL_STORAGE_HASH_KEY: string;
  readonly VITE_SECURE_LOCAL_STORAGE_PREFIX: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
