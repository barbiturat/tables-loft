import * as R from 'ramda';

import { AnyDict, StringDict, ValueOf } from 'interfaces';

export const isNotEmpty = (val = '') => !!val.length;

export const anyTypeGuard = <T>(
  dataToCheck: any,
  condition: (data: any) => boolean
): dataToCheck is T => {
  return condition(dataToCheck);
};

type ReplacedKeys<A extends AnyDict, B extends StringDict> = {
  [P in ValueOf<B> | keyof A]: ValueOf<A>
};

interface RenameKeys<B extends StringDict, A extends AnyDict>
  extends R.CurriedFunction2<B, A, ReplacedKeys<A, B>> {}

// https://github.com/ramda/ramda/wiki/Cookbook#rename-keys-of-an-object
export const renameKeys: RenameKeys<StringDict, AnyDict> = R.curry<
  StringDict,
  AnyDict,
  AnyDict
>((keysMap, obj) =>
  R.reduce<any, AnyDict>(
    (acc, key) => R.assoc(keysMap[key] || key, obj[key], acc),
    {},
    R.keys(obj)
  )
);
