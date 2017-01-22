import {combineEpics} from 'redux-observable';

import formValidation from './request-login';
import fetchTables from './fetch-tables';
import startTable from './start-table';
import stopTable from './stop-table';
import updateUtcMilliseconds from './update-utc-milliseconds';
import requestAdminToken from './request-admin-token';
import fetchSessionsHistory from './fetch-sessions-history';
import requestTableSessionChange from './request-table-session-change';
import changeTableFields from './change-table-fields';

export default combineEpics(
  formValidation,
  requestAdminToken,
  fetchTables,
  fetchSessionsHistory,
  startTable,
  updateUtcMilliseconds,
  stopTable,
  requestTableSessionChange,
  changeTableFields
);
