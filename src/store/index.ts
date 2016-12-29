import {createStore, compose, applyMiddleware} from 'redux';
import {reduxReactRouter} from 'redux-router';
import {createHistory} from 'history';
import {createEpicMiddleware, EpicMiddleware} from 'redux-observable';

import routes from '../routes';
import epics from '../epics/index';
import allReducers from '../reducers/index';

const epicMiddleware: EpicMiddleware<{}> = createEpicMiddleware(epics);
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = composeEnhancers(
  applyMiddleware(epicMiddleware),
  reduxReactRouter({
    routes,
    createHistory
  })
)(createStore)(allReducers);

export default store;
