import * as moment from 'moment';
import {ActionWithPayload} from '../interfaces/actions';
import {UTC_MILLISECONDS_UPDATED} from '../constants/action-names';

export type Structure = number;

const utcMilliseconds = (state: Structure = moment.utc().valueOf(), action: ActionWithPayload<Structure>): Structure => {
  if (action.type == UTC_MILLISECONDS_UPDATED) {
    return action.payload;
  } else {
    return state;
  }
};

export default utcMilliseconds;
