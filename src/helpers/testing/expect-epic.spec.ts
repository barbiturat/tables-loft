import Mock = jest.Mock;
import {Epic} from 'redux-observable';
import {Observable} from 'rxjs';

import {expectEpic} from './expect-epic';

describe('expectEpic', () => {

  const actions = {
    FETCH_FOO: 'FETCH_FOO',
    FETCH_FOO_FULFILLED: 'FETCH_FOO_FULFILLED',
    FETCH_FOO_CANCELLED: 'FETCH_FOO_CANCELLED',
    FETCH_FOO_REJECTED: 'FETCH_FOO_REJECTED'
  };

  const dataProvider = (url) => {
    const getEpic = (getAjax: (url: string, dataToSend: any) => Observable<any>): Epic<{payload: {}}, {}> => {
      return (action$, store) => {
        return action$.ofType(actions.FETCH_FOO)
          .switchMap(action => {
            const dataToSend = action.payload;

            return getAjax(url, dataToSend)
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

    return {
      url,
      getEpic
    };
  };

  it('calls the correct API', () => {
    const url = 'some-url';
    const responseData = {id: 123, name: 'Bilbo'};
    const getEpic = dataProvider(url).getEpic;

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
    const getEpic = dataProvider(url).getEpic;

    expectEpic(getEpic, {
      action: {
        marbles: '(a|)',
        values: {
          a: { type: actions.FETCH_FOO, payload: {id: 123} }
        }
      },
      expected: {
        marbles: '-(a|)',
        values: {
          a: { type: actions.FETCH_FOO_REJECTED, error: true }
        }
      },
      response: {
        marbles: '-#',
        values: null,
        error: { xhr: { responseData } }
      },
      callAjaxArgs: [url, {id: 123}]
    });
  });


});







