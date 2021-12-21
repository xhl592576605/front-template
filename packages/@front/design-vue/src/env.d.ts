/// <reference types="vite/client" />

declare module '*.vue' {
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  import { DefineComponent, ComponentOptions } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.md' {
  // eslint-disable-next-line no-undef
  const Component: ComponentOptions;
  export default Component;
}

interface ImportMeta {
  env: Record<string, unknown>;
}
