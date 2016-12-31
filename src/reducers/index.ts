import {combineReducers} from 'redux';
import {routerStateReducer, ReduxRouter} from 'redux-router';

import formsData, {Structure as FormsDataStructure} from './forms';
import {ReducersOfType} from '../interfaces/index';
import app, {Structure as AppStructure} from './app';

export interface Structure {
  router: ReduxRouter.LocationDescriptor;
  formsData: FormsDataStructure;
  app: AppStructure;
}

const reducers: ReducersOfType<Structure> = {
  router: routerStateReducer,
  formsData,
  app
};

const allReducers = combineReducers<Structure>(reducers);

export default allReducers;
