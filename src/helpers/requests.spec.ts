jest.mock('./process-env');

import Mock = jest.Mock;
import {AjaxError, AjaxRequest, TestScheduler, Observable} from 'rxjs';
import {equals} from 'ramda';
import * as queryString from 'query-string';
import * as jsc from 'jsverify';
// tslint:disable-next-line:no-require-imports
require('./testing/jasmineHelpers2'); // https://github.com/jsverify/jsverify#usage-with-jasmine

import {alphanumericSymbolsArb} from './testing/arbitrary';
import {getExtendedHeaders, DependencyContainer, get} from './requests';
import {testObservableProperty} from './testing/test-observable-property';
import {getProcessEnv} from './process-env';

describe('DependencyContainer.handleError', () => {
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

    const handled$ = DependencyContainer.handleError(sourceAjaxErrorData);
    const expectedMap = {
      a: sourceAjaxErrorData
    };

    testScheduler.expectObservable(handled$).toBe('(a|)', expectedMap);
  });

  testObservableProperty('works with any of error texts', jsc.nestring, function(propertyScheduler, errorText: string) {
    const xhr = new XMLHttpRequest();
    const request: AjaxRequest = {};
    const sourceAjaxErrorData = new AjaxError(errorText, xhr, request);

    const handled$ = DependencyContainer.handleError(sourceAjaxErrorData);
    const expectedMap = {
      a: sourceAjaxErrorData
    };

    propertyScheduler.expectObservable(handled$).toBe('(a|)', expectedMap);
  });
});

describe('getExtendedHeaders', () => {
  jsc.property('adds a proper "Authorization" field', alphanumericSymbolsArb(20, '-'), (apiKey) => {
    (getProcessEnv as Mock<any>).mockImplementationOnce(() => ({
      API_KEY: apiKey
    }));

    const extendedHeaders = getExtendedHeaders();
    const authorization = extendedHeaders.Authorization;

    return equals(authorization)(`Token token=${apiKey}`);
  });

  jsc.property('adds passed headers to result', jsc.dict(jsc.oneof<string | number | boolean>([jsc.string, jsc.integer, jsc.bool])), (passedHeaders: {}) => {
    const apiKey = 'some';
    (getProcessEnv as Mock<any>).mockImplementationOnce(() => ({
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
  const originalAjaxGet = DependencyContainer.ajaxGet;
  const originalHandleError = DependencyContainer.handleError;
  const API_KEY = 'some';

  // because "get" method uses "API_KEY", that returned by "getProcessEnv" method
  const mockGetProcessEnvOnce = (apiKey = API_KEY) => (getProcessEnv as Mock<any>).mockImplementationOnce(() => ({
    API_KEY: apiKey
  }));

  beforeEach(() => {
    mockGetProcessEnvOnce();
  });

  afterEach(() => {
    DependencyContainer.ajaxGet = originalAjaxGet;
    DependencyContainer.handleError = originalHandleError;
  });

  it('DependencyContainer.ajaxGet is called once', () => {
    DependencyContainer.ajaxGet = jest.fn(() => Observable.of(null));

    get('http://some-url.com');

    const calls = (DependencyContainer.ajaxGet as Mock<any>).mock.calls;

    expect(Array.isArray(calls)).toBeTruthy();
    expect(calls.length).toEqual(1);
  });

  jsc.property('DependencyContainer.ajaxGet is called with 1-st arg which equals to a passed URL', alphanumericSymbolsArb(20, '---...'), (siteName: string) => {
    mockGetProcessEnvOnce();
    DependencyContainer.ajaxGet = jest.fn(() => Observable.of(null));

    const url = `http://${siteName}.com`;

    get(url);

    const firstCall = (DependencyContainer.ajaxGet as Mock<any>).mock.calls[0];
    const firstArg = firstCall[0];

    return equals(firstArg)(url);
  });

  it('handleError is called with proper parameters on catch', () => {
    const errorData = new Error('some error!');

    DependencyContainer.ajaxGet = jest.fn(() => Observable.throw(errorData));
    DependencyContainer.handleError = jest.fn();

    get('http://some-url.com').subscribe(
      (data: any) => {},
      (error: any) => {},
      () => {}
    );

    const handleErrorFirstCall = (DependencyContainer.handleError as Mock<any>).mock.calls[0];

    expect(handleErrorFirstCall).toEqual([errorData]);
  });

  jsc.property(`DependencyContainer.ajaxGet is called with data from get's "dataToSend" argument`,
    jsc.dict(jsc.string),
    alphanumericSymbolsArb(20, '---...'),
    alphanumericSymbolsArb(20, '-'),
    (dataToSend: {}, siteName: string, apiKey: string) => {
      (getProcessEnv as Mock<any>).mockImplementationOnce(() => ({
        API_KEY: apiKey
      }));
      DependencyContainer.ajaxGet = jest.fn(() => Observable.of(null));

      const serializedData = queryString.stringify(dataToSend);
      const url = `http://${siteName}.com`;
      const urlWithQueryString = `${url}${serializedData ? '?' : ''}${serializedData}`;

      get(url, dataToSend);

      const firstCall = (DependencyContainer.ajaxGet as Mock<any>).mock.calls[0];
      const firstArg = firstCall[0];

      return equals(firstArg)(urlWithQueryString);
  });

/*
  it(`Observable.ajax.get is called with data from get's "headers" argument`, () => {
    Observable.ajax.get = jest.fn(() => Observable.of(null));

    get('http://some-url.com');

    const firstCall = (Observable.ajax.get as Mock<any>).mock.calls[0];
    const firstArg = firstCall[0];

    expect(firstArg).toEqual('http://some-url.com');
  });
*/

});
