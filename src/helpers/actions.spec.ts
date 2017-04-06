import * as jsc from 'jsverify';
import {equals} from 'ramda';

import {createSimpleAction, createActionWithPayload} from './actions';
import {SimpleAction} from '../interfaces/actions';
// tslint:disable-next-line:no-require-imports
require('./jasmineHelpers2'); // https://github.com/jsverify/jsverify#usage-with-jasmine

describe('createSimpleAction', () => {
  jsc.property('returns proper action', jsc.nestring, actionType => {
    const action: SimpleAction = createSimpleAction(actionType);

    return equals(action)({
      type: actionType
    });
  });
});

describe('createSimpleAction', () => {
  jsc.property('returns proper action', jsc.nestring, jsc.dict(jsc.integer), (actionType, payload) => {
    const action: SimpleAction = createActionWithPayload(actionType, payload);

    return equals<any>(action)({
      type: actionType,
      payload
    });
  });

});



