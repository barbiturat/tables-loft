import Mock = jest.Mock;
import {TestScheduler, Observable} from 'rxjs';
import {ActionsObservable, Epic} from 'redux-observable';
import {MiddlewareAPI} from 'redux';
import configureMockStore from 'redux-mock-store';

import {ActionWithPayload, SimpleAction} from '../../interfaces/actions';
import {Dict, Writable} from '../../interfaces/index';

interface TestObservableData <T>{
  readonly marbles: string;
  readonly values?: Dict<T>;
  readonly error?: any;
}

interface AjaxDependencies {
  readonly getAjax: () => Observable<any>;
}

const mockStore = configureMockStore();

export const expectEpic = (epic: Epic<any, any>, options: {
  action: TestObservableData< SimpleAction | ActionWithPayload<any> >,
  expected: TestObservableData< SimpleAction | ActionWithPayload<any> >,
  response: TestObservableData<any>,
  store?: MiddlewareAPI<any>
  callAjaxArgs: ReadonlyArray<any>,
  dependenciesObj?: Writable<AjaxDependencies>
}) => {
  const {action, expected, response, callAjaxArgs, dependenciesObj} = options;
  const store = options.store || mockStore();
  const testScheduler = new TestScheduler((actual: any, expectedData: any) => {
    return expect(actual).toEqual(expectedData);
  });

  const action$: ActionsObservable<{}> = new ActionsObservable<{}>(
    testScheduler.createHotObservable<{}>(action.marbles, action.values, action.error)
  );
  const response$ = testScheduler.createColdObservable(response.marbles, response.values, response.error);

  dependenciesObj.getAjax = jest.fn(() => response$);

  const callsOfGetAjax = (dependenciesObj.getAjax as Mock<any>).mock.calls;
  const responseMarbles = '^!';
  const test$ = epic(action$, store);

  testScheduler.expectObservable(test$).toBe(expected.marbles, expected.values);
  testScheduler.flush();

  expect(callsOfGetAjax.length).toEqual(1);
  expect(callsOfGetAjax[0]).toEqual(callAjaxArgs);

  testScheduler.expectSubscriptions(response$.subscriptions).toBe(responseMarbles);
};
