import {ActionWithPayload} from '../interfaces/actions';
import {TIMER_UPDATED} from '../constants/action-names';

export type Structure = number;

const timer = (state: Structure = 0, action: ActionWithPayload<Structure>): Structure => {
  if (action.type == TIMER_UPDATED) {
    return action.payload;
  } else {
    return state;
  }
};

export default timer;
