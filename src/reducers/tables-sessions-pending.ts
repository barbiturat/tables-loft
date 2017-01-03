import {ActionWithPayload} from '../interfaces/actions';
import {PENDING_TABLE_SESSIONS} from '../constants/action-names';

export type Structure = boolean;

const isInPending = (state: Structure = false, action: ActionWithPayload<Structure>): Structure => {
  if (action.type === PENDING_TABLE_SESSIONS) {
    return action.payload;
  } else {
    return state;
  }
};

export default isInPending;
