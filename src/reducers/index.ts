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


/*
const tempStoreScheme = {
  userInfo: {},
  tablesData: {
    isInPending: false,
    tables: [
      {
        name: 'someTableName',
        id: 55,
        tableType: 'pool',
        status: 'ready',
        currentSessionId: 476,
        lastSessionId: 333
      },
      {
        name: 'otherName',
        id: 12,
        tableType: 'pool',
        status: 'ready',
        currentSessionId: 43,
        lastSessionId: 5434
      }
    ]
  },
  tableSessionsData: {
    isInPending: false,
    tableSessions: [
      {
        id: 12,
        starts_at: 'dfggfddfg',
        durationSeconds: 3454345,
        adminEdited: false
      },
      {
        id: 534,
        starts_at: 'dfggfdddf dfg fg',
        durationSeconds: 4323,
        adminEdited: false
      }
    ]

  }
};
*/
