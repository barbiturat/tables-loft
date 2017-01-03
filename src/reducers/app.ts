import {combineReducers} from 'redux';

import {ReducersOfType} from '../interfaces/index';
import userInfo, {Structure as UserInfoStructure} from './user-info';
import tablesData, {Structure as TablesDataStructure} from './tables-data';
import tableSessionsData, {Structure as TableSessionsDataStructure} from './table-sessions-data';
import utcMilliseconds, {Structure as UtcMillisecondsDataStructure} from './utc-milliseconds';
import adminToken, {Structure as AdminTokenStructure} from './admin-token';
import modals, {Structure as ModalsStructure} from './modals';

export interface Structure {
  adminToken: AdminTokenStructure;
  modals: ModalsStructure;
  utcMilliseconds: UtcMillisecondsDataStructure;
  userInfo: UserInfoStructure;
  tablesData: TablesDataStructure;
  tableSessionsData: TableSessionsDataStructure;
}

const reducers: ReducersOfType<Structure> = {
  adminToken,
  modals,
  utcMilliseconds,
  userInfo,
  tablesData,
  tableSessionsData
};

const app = combineReducers<Structure>(reducers);

export default app;
