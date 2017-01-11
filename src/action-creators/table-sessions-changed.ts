import {TABLE_SESSIONS_CHANGED} from '../constants/action-names';
import {createActionWithPayload} from '../helpers/index';
import {ActionWithPayload} from '../interfaces/actions';
import {TableSessions} from '../interfaces/store-models';

export type ActionType = ActionWithPayload<TableSessions>;

const tableSessionsChanged = (tableSessions: TableSessions): ActionType =>
  createActionWithPayload(TABLE_SESSIONS_CHANGED, tableSessions);

export default tableSessionsChanged;
