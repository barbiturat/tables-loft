import * as jsc from 'jsverify';
import { BaseAction } from 'redux-actions';
import { equals } from 'ramda';

import { createActionWithPayload } from './actions';
// tslint:disable-next-line:no-require-imports
require('./testing/jasmineHelpers2'); // https://github.com/jsverify/jsverify#usage-with-jasmine

describe('createActionWithPayload', () => {
  jsc.property(
    'returns proper action',
    jsc.nestring,
    jsc.dict(jsc.integer),
    (actionType, payload) => {
      const action: BaseAction = createActionWithPayload(actionType, payload);

      return equals<any>(action)({
        type: actionType,
        payload
      });
    }
  );
});
