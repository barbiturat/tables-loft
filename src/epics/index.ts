import {combineEpics} from 'redux-observable';

import formValidation from './request-login';
import fetchTables from './fetch-tables';
import startTable from './start-table';
import setTablePending from './set-table-pending';
import stopTable from './stop-table';
import updateUtcMilliseconds from './update-utc-milliseconds';
import requestAdminToken from './request-admin-token';

export default combineEpics(
  formValidation,
  requestAdminToken,
  fetchTables,
  startTable,
  setTablePending,
  updateUtcMilliseconds,
  stopTable
);
