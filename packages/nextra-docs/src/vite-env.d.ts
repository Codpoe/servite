/// <reference types="vite/client" />
/// <reference types="servite/global" />

declare module 'virtual:servite-nextra-docs/meta-files' {
  export interface MetaFile {
    filePath: string;
    data: Record<string, any>;
  }

  const metaFiles: MetaFile[];
  export default metaFiles;
}
