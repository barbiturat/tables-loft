import {TABLE_SESSIONS_CHANGED} from '../constants/action-names';
import {TableSession} from '../interfaces/store-models';
import {ActionWithPayload} from '../interfaces/actions';

export type Structure = TableSession[];

const tableSessions = (state: Structure = [], action: ActionWithPayload<Structure>): Structure => {
  if (action.type === TABLE_SESSIONS_CHANGED) {
    return action.payload;
  } else {
    return state;
  }
};

export default tableSessions;
