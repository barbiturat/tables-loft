import {AjaxError, AjaxRequest} from 'rxjs';

import {handleError} from './requests';

describe('handleError', () => {
  test('returns observable of passed data', (done) => {
    const sourceAjaxErrorData: AjaxError = {
      name: 'some name',
      message: 'some message',
      xhr: ({} as XMLHttpRequest),
      request: ({} as AjaxRequest),
      status: 111
    };
    const handled = handleError(sourceAjaxErrorData as AjaxError);
    const onNext = (data: AjaxError) => {
      expect(data).toBe(sourceAjaxErrorData);
    };
    const error = () => {};

    handled.subscribe(
      onNext,
      error,
      done
    );
  });
});
