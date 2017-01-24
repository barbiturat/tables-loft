import {combineReducers} from 'redux';

import {ReducersOfType} from '../interfaces/index';
import userInfo, {Structure as UserInfoStructure} from './user-info';
import tablesData, {Structure as TablesDataStructure} from './tables-data';
import tableSessionsData, {Structure as TableSessionsDataStructure} from './table-sessions-data';
import utcMilliseconds, {Structure as UtcMillisecondsDataStructure} from './utc-milliseconds';
import adminToken, {Structure as AdminTokenStructure} from './admin-token';
import modals, {Structure as ModalsStructure} from './modals';
import globalErrors, {Structure as GlobalErrorsStructure} from './global-errors';
import isBlockingRequestPending, {Structure as BlockingRequestPendingStructure} from './is-blocking-request-pending';

export interface Structure {
  adminToken: AdminTokenStructure;
  isBlockingRequestPending: BlockingRequestPendingStructure;
  modals: ModalsStructure;
  utcMilliseconds: UtcMillisecondsDataStructure;
  userInfo: UserInfoStructure;
  tablesData: TablesDataStructure;
  tableSessionsData: TableSessionsDataStructure;
  globalErrors: GlobalErrorsStructure;
}

const reducers: ReducersOfType<Structure> = {
  adminToken,
  isBlockingRequestPending,
  modals,
  utcMilliseconds,
  userInfo,
  tablesData,
  tableSessionsData,
  globalErrors
};

const app = combineReducers<Structure>(reducers);

export default app;
