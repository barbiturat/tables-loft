jest.mock('./process-env');

import Mock = jest.Mock;
import {AjaxError, AjaxRequest, TestScheduler, Observable} from 'rxjs';
import {equals} from 'ramda';
import * as jsc from 'jsverify';
// tslint:disable-next-line:no-require-imports
require('./testing/jasmineHelpers2'); // https://github.com/jsverify/jsverify#usage-with-jasmine

import {arbLatSymbols} from './testing/arbitrary';
import {getExtendedHeaders, handleError, get} from './requests';
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
  jsc.property('adds a proper "Authorization" field', arbLatSymbols(20), (apiKey) => {
    (getProcessEnv as Mock<any>).mockImplementation(() => ({
      API_KEY: apiKey
    }));

    const extendedHeaders = getExtendedHeaders();
    const authorization = extendedHeaders.Authorization;

    return equals(authorization)(`Token token=${apiKey}`);
  });

  jsc.property('adds passed headers to result', jsc.dict(jsc.oneof([jsc.string, jsc.integer, jsc.bool])), (passedHeaders: {}) => {
    const apiKey = 'some';
    (getProcessEnv as Mock<any>).mockImplementation(() => ({
      API_KEY: apiKey
    }));

    const authorizationData = {
      Authorization: `Token token=${apiKey}`
    };
    const expectedHeaders = {...authorizationData, ...passedHeaders};
    const result = getExtendedHeaders(passedHeaders);

    return equals(result)(expectedHeaders);
  });
});

describe('get', () => {
  const originalAjaxGet = Observable.ajax.get;

  beforeEach(() => {
    Observable.ajax.get = originalAjaxGet;
  });

  it('Observable.ajax.get is called', () => {
    Observable.ajax.get = jest.fn(() => Observable.of(null));

    get('http://some-url.com');

    expect(Observable.ajax.get).toBeCalled();
  });

  it('Observable.ajax.get is called with 1-st arg which equals to a passed URL', () => {
    Observable.ajax.get = jest.fn(() => Observable.of(null));

    get('http://some-url.com');

    const firstCall = (Observable.ajax.get as Mock<any>).mock.calls[0];
    const firstArg = firstCall[0];

    expect(firstArg).toEqual('http://some-url.com');
  });

});
