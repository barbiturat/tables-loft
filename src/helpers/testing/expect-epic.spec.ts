import Mock = jest.Mock;
import {Epic} from 'redux-observable';
import {Observable} from 'rxjs/Observable';

import {expectEpic} from './expect-epic';

const getEpic = (getAjax: (url: string, dataToSend: any) => Observable<any>): Epic<{payload: {}}, {}> => {
  const actions = {
    FETCH_FOO: 'FETCH_FOO',
    FETCH_FOO_FULFILLED: 'FETCH_FOO_FULFILLED',
    FETCH_FOO_CANCELLED: 'FETCH_FOO_CANCELLED',
    FETCH_FOO_REJECTED: 'FETCH_FOO_REJECTED'
  };

  return (action$, store) => {
    return action$.ofType(actions.FETCH_FOO)
      .switchMap(action => {
        const dataToSend = action.payload;

        return getAjax('some-url', dataToSend)
          .takeUntil(action$.ofType(actions.FETCH_FOO_CANCELLED))
          .map(payload => ({
            type: actions.FETCH_FOO_FULFILLED,
            payload: payload
          }))
          .catch(error => Observable.of({
            type: actions.FETCH_FOO_REJECTED,
            payload: error.xhr.response,
            error: true
          }));
      });
  };
};

describe('expectEpic', () => {

  const actions = {
    FETCH_FOO: 'FETCH_FOO',
    FETCH_FOO_FULFILLED: 'FETCH_FOO_FULFILLED',
    FETCH_FOO_CANCELLED: 'FETCH_FOO_CANCELLED',
    FETCH_FOO_REJECTED: 'FETCH_FOO_REJECTED'
  };

  it('calls the correct API', () => {
    const url = 'some-url';
    const responseData = {id: 123, name: 'Bilbo'};

    expectEpic(getEpic, {
      action: {
        marbles: '(a|)',
        values: {
          a: { type: actions.FETCH_FOO, payload: {id: 123} }
        }
      },
      expected: {
        marbles: '-a|',
        values: {
          a: { type: actions.FETCH_FOO_FULFILLED, payload: responseData }
        }
      },
      response: {
        marbles: '-a|',
        values: { a: responseData }
      },
      callAjaxArgs: [url, {id: 123}]
    });
  });

  it('handles errors correctly', () => {
    const url = 'some-url';
    const responseData = {id: 123, name: 'Bilbo'};

    expectEpic(getEpic, {
      action: {
        marbles: '(a|)',
        values: {
          a: {type: actions.FETCH_FOO, payload: {id: 123}}
        }
      },
      expected: {
        marbles: '-(a|)',
        values: {
          a: {type: actions.FETCH_FOO_REJECTED, error: true}
        }
      },
      response: {
        marbles: '-#',
        values: null,
        error: {xhr: {responseData}}
      },
      callAjaxArgs: [url, {id: 123}]
    });
  });

  it('handles cancellation correctly', () => {
    const url = 'some-url';

    expectEpic(getEpic, {
      action: {
        marbles: 'ab|',
        values: {
          a: { type: actions.FETCH_FOO, payload: { id: 123 } },
          b: { type: actions.FETCH_FOO_CANCELLED }
        }
      },
      expected: {
        marbles: '--|',
      },
      response: {
        marbles: '-a|',
        values: {
          a: { message: 'SHOULD_NOT_EMIT_THIS' }
        }
      },
      callAjaxArgs: [url, {id: 123}]
    });
  });

});







