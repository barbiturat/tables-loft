import { createAction } from 'redux-actions';

import { CHANGING_TABLE_SESSIONS } from '../constants/action-names';
import { TableSessions } from '../interfaces/store-models';

const changingTableSessions = createAction<TableSessions>(
  CHANGING_TABLE_SESSIONS
);

export default changingTableSessions;
