import {FETCHING_TABLE_SESSIONS_HISTORY_FAILED} from '../constants/action-names';
import {createActionWithPayload} from '../helpers/index';
import {ActionWithPayload} from '../interfaces/actions';

type PayloadType = string;

export type ActionType = ActionWithPayload<PayloadType>;

const fetchingTableSessionsHistoryFailed = (errorMessage: PayloadType): ActionType =>
  createActionWithPayload(FETCHING_TABLE_SESSIONS_HISTORY_FAILED, errorMessage);

export default fetchingTableSessionsHistoryFailed;
