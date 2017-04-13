import {equals} from 'ramda';
import * as jsc from 'jsverify';
// tslint:disable-next-line:no-require-imports
require('./testing/jasmineHelpers2'); // https://github.com/jsverify/jsverify#usage-with-jasmine

import {getProcessEnv} from './process-env';

describe('getProcessEnv', () => {
  const origEnv = process.env;

  afterEach(() => {
    process.env = origEnv;
  });

  jsc.property('returns process.env data', jsc.dict(jsc.oneof([jsc.string, jsc.integer])), (newEnv) => {
    process.env = newEnv;
    const result = getProcessEnv();

    return equals(result)(newEnv);
  });
});
