import {AjaxError, AjaxRequest, TestScheduler} from 'rxjs';
import {equals} from 'ramda';
import * as jsc from 'jsverify';
// tslint:disable-next-line:no-require-imports
require('./jasmineHelpers2'); // https://github.com/jsverify/jsverify#usage-with-jasmine

import {handleError} from './requests';
import {Arbitrary} from 'jsverify';

type TestPropertyHandler = (propertyScheduler: TestScheduler, ...args: any[]) => void;

function testProperty(description: string, arbitrary1: Arbitrary<any>, handler: TestPropertyHandler): void {
  const innerHandler = () => {
    let areEqual = false;
    const propertyScheduler = new TestScheduler((actual: any, expected: any) => {
      areEqual = equals(actual)(expected);

      if (!areEqual) {
        // to have a verbose information about marble test error
        return expect(actual).toEqual(expected);
      }

      return areEqual;
    });

    handler(propertyScheduler, arbitrary1);

    propertyScheduler.flush();
    return areEqual;
  };

  jsc.property(description, arbitrary1, innerHandler);
}

describe('handleError', () => {
  const testScheduler = new TestScheduler((actual: any, expected: any) => {
    return expect(actual).toEqual(expected);
  });

  afterAll(() => {
    testScheduler.flush();
  });

  test('returns observable of passed data', () => {
    const xhr = new XMLHttpRequest();
    const request: AjaxRequest = {};
    const sourceAjaxErrorData = new AjaxError('Some error', xhr, request);

    const handled$ = handleError(sourceAjaxErrorData);
    const expectedMap = {
      a: sourceAjaxErrorData
    };

    testScheduler.expectObservable(handled$).toBe('(a|)', expectedMap);
  });

  testProperty('works with any of error texts', jsc.nestring, function (propertyScheduler, errorText) {
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
