import {AjaxError, AjaxRequest, TestScheduler} from 'rxjs';

import {handleError} from './requests';

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
});
