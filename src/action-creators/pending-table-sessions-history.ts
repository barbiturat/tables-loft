import {PENDING_TABLE_SESSIONS_HISTORY} from '../constants/action-names';
import {createActionWithPayload} from '../helpers/index';
import {ActionWithPayload} from '../interfaces/actions';

type PayloadType = boolean;

export type ActionType = ActionWithPayload<PayloadType>;

const pendingTableSessionsHistory = (pending: PayloadType): ActionType =>
  createActionWithPayload(PENDING_TABLE_SESSIONS_HISTORY, pending);

export default pendingTableSessionsHistory;
