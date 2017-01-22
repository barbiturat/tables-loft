import {clone} from 'ramda';

import {CHANGING_TABLES} from '../constants/action-names';
import {Tables} from '../interfaces/store-models';
import {ActionWithPayload} from '../interfaces/actions';

export type Structure = Tables;

const tables = (state: Structure = {}, action: ActionWithPayload<Structure>): Structure => {
  if (action.type === CHANGING_TABLES) {
    return clone(action.payload);
  } else {
    return state;
  }
};

export default tables;
