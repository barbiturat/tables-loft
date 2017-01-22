import {clone} from 'ramda';

import {CHANGING_TABLE_SESSIONS} from '../constants/action-names';
import {TableSessions} from '../interfaces/store-models';
import {ActionWithPayload} from '../interfaces/actions';

export type Structure = TableSessions;

const tableSessions = (state: Structure = {}, action: ActionWithPayload<Structure>): Structure => {
  if (action.type === CHANGING_TABLE_SESSIONS) {
    return clone(action.payload);
  } else {
    return state;
  }
};

export default tableSessions;
