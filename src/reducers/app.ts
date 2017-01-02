import {combineReducers} from 'redux';

import {ReducersOfType} from '../interfaces/index';
import userInfo, {Structure as UserInfoStructure} from './user-info';
import tablesData, {Structure as TablesDataStructure} from './tables-data';
import tableSessionsData, {Structure as TableSessionsDataStructure} from './table-sessions-data';
import timer, {Structure as TimerDataStructure} from './timer';

export interface Structure {
  timer: TimerDataStructure;
  userInfo: UserInfoStructure;
  tablesData: TablesDataStructure;
  tableSessionsData: TableSessionsDataStructure;
}

const reducers: ReducersOfType<Structure> = {
  timer,
  userInfo,
  tablesData,
  tableSessionsData
};

const app = combineReducers<Structure>(reducers);

export default app;
