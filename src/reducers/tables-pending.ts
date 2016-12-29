import {PENDING_TABLES} from '../constants/action-names';
import {ActionType} from '../action-creators/pending-tables';

export type Structure = boolean;

const isInPending = (state: Structure = false, action: ActionType): Structure => {
  switch (action.type) {
    case PENDING_TABLES:
      return action.payload;

    default:
      return state;
  }
};

export default isInPending;
