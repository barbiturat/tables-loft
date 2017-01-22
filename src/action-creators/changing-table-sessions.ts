import {CHANGING_TABLE_SESSIONS} from '../constants/action-names';
import {createActionWithPayload} from '../helpers/index';
import {ActionWithPayload} from '../interfaces/actions';
import {TableSessions} from '../interfaces/store-models';

export type ActionType = ActionWithPayload<TableSessions>;

const changingTableSessions = (tableSessions: TableSessions): ActionType =>
  createActionWithPayload(CHANGING_TABLE_SESSIONS, tableSessions);

export default changingTableSessions;
