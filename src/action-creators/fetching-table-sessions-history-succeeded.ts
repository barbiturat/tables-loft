import {FETCHING_TABLE_SESSIONS_HISTORY_SUCCEEDED} from '../constants/action-names';
import {createActionWithPayload} from '../helpers/index';
import {ActionWithPayload} from '../interfaces/actions';
import {TableSession} from '../interfaces/store-models';

type PayloadType = TableSession[];

export type ActionType = ActionWithPayload<PayloadType>;

const fetchingTableSessionsHistorySucceeded = (tableSessions: PayloadType): ActionType =>
  createActionWithPayload(FETCHING_TABLE_SESSIONS_HISTORY_SUCCEEDED, tableSessions);

export default fetchingTableSessionsHistorySucceeded;
