import {combineEpics} from 'redux-observable';

import formValidation from './request-login';
import fetchTables from './fetch-tables';
import startTable from './start-table';
import setTablePending from './set-table-pending';
import stopTable from './stop-table';
import updateUtcMilliseconds from './update-utc-milliseconds';
import requestAdminToken from './request-admin-token';
import fetchSessionsHistory from './fetch-sessions-history';

export default combineEpics(
  formValidation,
  requestAdminToken,
  fetchTables,
  fetchSessionsHistory,
  startTable,
  setTablePending,
  updateUtcMilliseconds,
  stopTable
);
