import {combineReducers} from 'redux';

import {ReducersOfType} from '../interfaces/index';
import userInfo, {Structure as UserInfoStructure} from './user-info';
import tablesData, {Structure as TablesDataStructure} from './tables-data';
import tableSessionsData, {Structure as TableSessionsDataStructure} from './table-sessions-data';
import utcMilliseconds, {Structure as UtcMillisecondsDataStructure} from './utc-milliseconds';

export interface Structure {
  utcMilliseconds: UtcMillisecondsDataStructure;
  userInfo: UserInfoStructure;
  tablesData: TablesDataStructure;
  tableSessionsData: TableSessionsDataStructure;
}

const reducers: ReducersOfType<Structure> = {
  utcMilliseconds,
  userInfo,
  tablesData,
  tableSessionsData
};

const app = combineReducers<Structure>(reducers);

export default app;
