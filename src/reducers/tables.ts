import {clone} from 'lodash';

import {TABLES_CHANGED} from '../constants/action-names';
import {Tables} from '../interfaces/store-models';
import {ActionWithPayload} from '../interfaces/actions';

export type Structure = Tables;

const tables = (state: Structure = {}, action: ActionWithPayload<Structure>): Structure => {
  if (action.type === TABLES_CHANGED) {
    return action.payload;
  } else {
    return state;
  }
};

export default tables;
