declare module 'lodash/fp' {
  export let thru: (arg: any) => any;

  export let flowRight: <TResult extends Function>(...funcs: Function[]) => TResult;
  export let compose: typeof flowRight;
}
