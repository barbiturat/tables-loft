jest.mock('./process-env');

import {AjaxError, AjaxRequest, TestScheduler} from 'rxjs';
import {equals} from 'ramda';
import * as jsc from 'jsverify';
// tslint:disable-next-line:no-require-imports
require('./testing/jasmineHelpers2'); // https://github.com/jsverify/jsverify#usage-with-jasmine

import {arbLatSymbols} from './testing/arbitrary';
import {getExtendedHeaders, handleError} from './requests';
import {testObservableProperty} from './testing/test-observable-property';
import {getProcessEnv} from './process-env';

describe('handleError', () => {
  const testScheduler = new TestScheduler((actual: any, expected: any) => {
    return expect(actual).toEqual(expected);
  });

  afterEach(() => {
    testScheduler.flush();
  });

  it('returns observable of passed data', () => {
    const xhr = new XMLHttpRequest();
    const request: AjaxRequest = {};
    const sourceAjaxErrorData = new AjaxError('Some error', xhr, request);

    const handled$ = handleError(sourceAjaxErrorData);
    const expectedMap = {
      a: sourceAjaxErrorData
    };

    testScheduler.expectObservable(handled$).toBe('(a|)', expectedMap);
  });

  testObservableProperty('works with any of error texts', jsc.nestring, function(propertyScheduler, errorText: string) {
    const xhr = new XMLHttpRequest();
    const request: AjaxRequest = {};
    const sourceAjaxErrorData = new AjaxError(errorText, xhr, request);

    const handled$ = handleError(sourceAjaxErrorData);
    const expectedMap = {
      a: sourceAjaxErrorData
    };

    propertyScheduler.expectObservable(handled$).toBe('(a|)', expectedMap);
  });
});

describe('getExtendedHeaders', () => {
  jsc.property('adds a proper "Authorization" field', arbLatSymbols, (apiKey) => {
    getProcessEnv.mockImplementation(() => ({
      API_KEY: apiKey
    }));

    const extendedHeaders = getExtendedHeaders();
    const authorization = extendedHeaders.Authorization;

    return equals(authorization)(`Token token=${apiKey}`);
  });
});
