import {ActionWithPayload} from '../interfaces/actions';
import {PENDING_TABLE_SESSIONS} from '../constants/action-names';

export type Structure = boolean;

const isInPending = (state: Structure = false, action: ActionWithPayload<Structure>): Structure => {
  switch (action.type) {
    case PENDING_TABLE_SESSIONS:
      return action.payload;

    default:
      return state;
  }
};

export default isInPending;
