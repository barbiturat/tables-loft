import Mock = jest.Mock;
import {Epic} from 'redux-observable';
import {Observable} from 'rxjs';

import {expectEpic} from './expect-epic';

const actions = {
  FETCH_FOO: 'FETCH_FOO',
  FETCH_FOO_FULFILLED: 'FETCH_FOO_FULFILLED',
  FETCH_FOO_CANCELLED: 'FETCH_FOO_CANCELLED',
  FETCH_FOO_REJECTED: 'FETCH_FOO_REJECTED',
};

const ajaxDependencies = {
  getAjax: null
};

const testEpic: Epic<{payload: {}}, {}> = (action$, store) => {
  return action$.ofType(actions.FETCH_FOO)
    .switchMap(action => {
      const dataToSend = action.payload;

      return ajaxDependencies.getAjax('some-url', dataToSend)
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

describe('expectEpic', () => {
  it('calls the correct API', () => {
    const responseData = {id: 123, name: 'Bilbo'};

    expectEpic(testEpic, {
      action: {
        marbles: '(a|)',
        values: {
          a: {
            type: actions.FETCH_FOO,
            payload: {id: 123}
          }
        }
      },
      expected: {
        marbles: '-a|',
        values: {
          a: {
            type: actions.FETCH_FOO_FULFILLED,
            payload: responseData
          }
        }
      },
      response: {
        marbles: '-a|',
        values: {
          a: responseData
        }
      },
      callAjaxArgs: ['some-url', {id: 123}],
      dependenciesObj: ajaxDependencies
    });
  });

});







