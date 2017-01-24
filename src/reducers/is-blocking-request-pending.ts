import {ActionWithPayload} from '../interfaces/actions';
import {PENDING_BLOCKING_REQUEST} from '../constants/action-names';

export type Structure = boolean;

const isBlockingRequestPending = (state: Structure = false, action: ActionWithPayload<Structure>): Structure => {
  if (action.type === PENDING_BLOCKING_REQUEST) {
    return action.payload;
  } else {
    return state;
  }
};

export default isBlockingRequestPending;
