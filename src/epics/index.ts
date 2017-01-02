import {combineEpics} from 'redux-observable';

import formValidation from './request-login';
import fetchTables from './fetch-tables';
import startTable from './start-table';
import setTablePending from './set-table-pending';
import stopTable from './stop-table';
import updateTimer from './update-timer';

export default combineEpics(
  formValidation,
  fetchTables,
  startTable,
  setTablePending,
  updateTimer,
  stopTable
);
