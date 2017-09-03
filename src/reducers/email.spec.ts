import { equals } from 'ramda';
import * as jsc from 'jsverify';
// tslint:disable-next-line:no-require-imports
require('../helpers/testing/jasmineHelpers2'); // https://github.com/jsverify/jsverify#usage-with-jasmine

import email from './email';
import { USER_EMAIL_CHANGED } from '../constants/action-names';
import { Action } from 'redux-actions';

test(`returns proper result`, () => {
  const actionPayload = '111';
  const action: Action<string> = {
    type: USER_EMAIL_CHANGED,
    payload: actionPayload
  };
  const result = email('', action);

  expect(result).toEqual(actionPayload);
});

jsc.property('returns proper result with any string data', jsc.nestring, actionPayload => {
  const action: Action<string> = {
    type: USER_EMAIL_CHANGED,
    payload: actionPayload
  };
  const result = email('', action);

  return equals<any>(result)(actionPayload);
});
