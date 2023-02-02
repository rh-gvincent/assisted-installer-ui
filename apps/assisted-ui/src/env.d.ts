/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_GIT_SHA: string;
  readonly VITE_APP_IMAGE_REPO: string;
  readonly VITE_APP_VERSION: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
