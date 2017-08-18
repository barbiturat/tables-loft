import { createStore, compose, applyMiddleware, Store, Action } from 'redux';
import { reduxReactRouter } from 'redux-router';
import { createHistory } from 'history';
import { createEpicMiddleware, EpicMiddleware } from 'redux-observable';

import routes from '../routes';
import epics from '../epics/index';
import allReducers from '../reducers/index';
import { StoreStructure } from '../interfaces/store-models';

const epicMiddleware: EpicMiddleware<
  Action,
  StoreStructure
> = createEpicMiddleware(epics);
const composeEnhancers =
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store: Store<StoreStructure> = composeEnhancers(
  applyMiddleware(epicMiddleware),
  reduxReactRouter({
    routes,
    createHistory
  })
)(createStore)(allReducers);

/*store.subscribe(() => {
  console.log('store.getState()', store.getState());
});*/

export default store;
