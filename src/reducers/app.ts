import {combineReducers} from 'redux';

import {ReducersOfType} from '../interfaces/index';
import userInfo, {Structure as UserInfoStructure} from './user-info';
import tablesData, {Structure as TablesDataStructure} from './tables-data';
import tableSessionsData, {Structure as TableSessionsDataStructure} from './table-sessions-data';

export interface Structure {
  userInfo: UserInfoStructure;
  tablesData: TablesDataStructure;
  tableSessionsData: TableSessionsDataStructure;
}

const reducers: ReducersOfType<Structure> = {
  userInfo,
  tablesData,
  tableSessionsData
};

const app = combineReducers<Structure>(reducers);

export default app;
