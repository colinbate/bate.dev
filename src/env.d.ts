/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client-image" />

interface ImportMetaEnv {
    readonly CONTACT_NUMBER?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
