import {FETCHING_TABLE_SESSIONS_HISTORY} from '../constants/action-names';
import {createActionWithPayload} from '../helpers/index';
import {ActionWithPayload} from '../interfaces/actions';

type PayloadType = number;

export type ActionType = ActionWithPayload<PayloadType>;

const fetchingTableSessionsHistory = (tableId: PayloadType): ActionType =>
  createActionWithPayload(FETCHING_TABLE_SESSIONS_HISTORY, tableId);

export default fetchingTableSessionsHistory;
