import {FETCHING_TABLE_SESSIONS_HISTORY} from '../constants/action-names';
import {ActionWithPayload} from '../interfaces/actions';
import {createActionWithPayload} from '../helpers/actions';

type PayloadType = number;

export type ActionType = ActionWithPayload<PayloadType>;

const fetchingTableSessionsHistory = (tableId: PayloadType): ActionType =>
  createActionWithPayload(FETCHING_TABLE_SESSIONS_HISTORY, tableId);

export default fetchingTableSessionsHistory;
