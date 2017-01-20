import {clone} from 'ramda';

import {TABLE_SESSIONS_CHANGED} from '../constants/action-names';
import {TableSessions} from '../interfaces/store-models';
import {ActionWithPayload} from '../interfaces/actions';

export type Structure = TableSessions;

const tableSessions = (state: Structure = {}, action: ActionWithPayload<Structure>): Structure => {
  if (action.type === TABLE_SESSIONS_CHANGED) {
    return clone(action.payload);
  } else {
    return state;
  }
};

export default tableSessions;
