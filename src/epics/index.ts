import {combineEpics} from 'redux-observable';

import formValidation from './request-login';
import fetchTables from './fetch-tables';
import startTable from './start-table';

export default combineEpics(
  formValidation,
  fetchTables,
  startTable
);
