import {combineEpics} from 'redux-observable';

import formValidation from './request-login';
import fetchTables from './fetch-tables';

export default combineEpics(
  formValidation,
  fetchTables
);
