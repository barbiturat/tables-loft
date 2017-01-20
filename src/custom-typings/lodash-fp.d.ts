declare module 'lodash/fp' {
  export const thru: ( interceptor: (value: any) => any ) => () => any;
  export const keys: () => string[];
  export const clone: () => any;
  export const chunk: (size?: number) => () => any[];
  export const nth: (idx?: number) => () => any;
  export const pick: (paths: string[]) => (obj: {}) => any;
  export const assign: (source2: any, ...sources: any[]) => (source1: any) => any;
  export const map: (iteratee: (value: any) => any) => (idx: number) => any[];

  export let flowRight: <TResult extends Function>(...funcs: Function[]) => TResult;
  export let compose: typeof flowRight;
}
