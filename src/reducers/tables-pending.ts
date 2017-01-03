import {PENDING_TABLES} from '../constants/action-names';
import {ActionWithPayload} from '../interfaces/actions';

export type Structure = boolean;

const isInPending = (state: Structure = false, action: ActionWithPayload<Structure>): Structure => {
  if (action.type === PENDING_TABLES) {
    return action.payload;
  } else {
    return state;
  }
};

export default isInPending;
