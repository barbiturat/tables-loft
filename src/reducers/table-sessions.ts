import {TABLE_SESSIONS_CHANGED} from '../constants/action-names';
import {ActionType} from '../action-creators/table-sessions-changed';
import {TableSession} from '../interfaces/store-models';

export type Structure = TableSession[];

const tableSessions = (state: Structure = [], action: ActionType): Structure => {
  switch (action.type) {
    case TABLE_SESSIONS_CHANGED:
      return action.payload;

    default:
      return state;
  }
};

export default tableSessions;
