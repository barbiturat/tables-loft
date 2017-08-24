import { createAction } from 'redux-actions';

import { CHANGING_TABLE_SESSIONS } from '../constants/action-names';
import { TableSessionsStore } from '../interfaces/store-models';

const changingTableSessions = createAction<TableSessionsStore>(
  CHANGING_TABLE_SESSIONS
);

export default changingTableSessions;
