import Mock = jest.Mock;
import {BaseAction} from 'redux-actions';
import {TestScheduler, Observable} from 'rxjs';
import {ActionsObservable, Epic} from 'redux-observable';
import {MiddlewareAPI} from 'redux';
import configureMockStore from 'redux-mock-store';

import {ActionWithPayload} from '../../interfaces/actions';
import {Dict} from '../../interfaces/index';

interface TestObservableData <T> {
  readonly marbles: string;
  readonly values?: Dict<T>;
  readonly error?: any;
}

const mockStore = configureMockStore();

export const expectEpic = (getEpic: (getAjax: (url: string, dataToSend: any) => Observable<any>) => Epic<any, any>,
                           options: {
                             action: TestObservableData<BaseAction | ActionWithPayload<any>>,
                             expected: TestObservableData<BaseAction | ActionWithPayload<any>>,
                             response: TestObservableData<any>,
                             store?: MiddlewareAPI<any>
                             callAjaxArgs: ReadonlyArray<any>
                           }) => {
  const {action, expected, response, callAjaxArgs} = options;
  const store = options.store || mockStore();
  const testScheduler = new TestScheduler((actual: any, expectedData: any) => {
    return expect(actual).toEqual(expectedData);
  });

  const action$: ActionsObservable<{}> = new ActionsObservable<{}>(
    testScheduler.createHotObservable<{}>(action.marbles, action.values, action.error)
  );
  const response$ = testScheduler.createColdObservable(response.marbles, response.values, response.error);
  const getAjax = jest.fn(() => response$);
  const callsOfGetAjax = (getAjax as Mock<any>).mock.calls;
  const responseMarbles = '^!';
  const epic = getEpic(getAjax);
  const test$ = epic(action$, store);

  testScheduler.expectObservable(test$).toBe(expected.marbles, expected.values);
  testScheduler.flush();

  expect(callsOfGetAjax.length).toEqual(1);
  expect(callsOfGetAjax[0]).toEqual(callAjaxArgs);

  testScheduler.expectSubscriptions(response$.subscriptions).toBe(responseMarbles);
};
