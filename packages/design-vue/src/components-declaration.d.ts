// this is global component declaration
declare module 'vue' {
  export interface GlobalComponents {
    DButton: typeof import('./button')['DButton']
    [key: string]: any
  }
}
export { }
