import {ActionWithPayload} from '../interfaces/actions';
import {PENDING_TABLE_SESSIONS_HISTORY} from '../constants/action-names';

export type Structure = boolean;

const pendingTableSessionsHistory = (state: Structure = false, action: ActionWithPayload<Structure>): Structure => {
  if (action.type === PENDING_TABLE_SESSIONS_HISTORY) {
    return action.payload;
  } else {
    return state;
  }
};

export default pendingTableSessionsHistory;
