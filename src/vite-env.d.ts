/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_EMAILJS_SERVICE_ID: string
    readonly VITE_EMAILJS_TEMPLATE_ID: string
    readonly VITE_EMAILJS_PUBLIC_KEY: string
    readonly VITE_EMAILJS_AUTOREPLY_TEMPLATE_ID: string
    // Add other VITE_ prefixed env variables here
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
  
  // MDX Module declarations
  declare module '*.mdx' {
    let MDXComponent: (props: any) => JSX.Element
    export default MDXComponent
  }
  
  // Additional type augmentations for your libraries
  declare module 'contentlayer2/generated' {
    export const allPosts: any[]
    export const allPages: any[]
  }
  