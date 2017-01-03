import {ActionWithPayload} from '../interfaces/actions';
import {MODAL_SESSIONS_HISTORY_OPENED} from '../constants/action-names';

export type Structure = boolean;

const modalSessionsHistory = (state: Structure = false, action: ActionWithPayload<Structure>): Structure => {
  if (action.type === MODAL_SESSIONS_HISTORY_OPENED) {
    return action.payload;
  } else {
    return state;
  }
};

export default modalSessionsHistory;
