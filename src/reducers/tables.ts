import {TABLES_CHANGED} from '../constants/action-names';
import {Table} from '../interfaces/store-models';
import {ActionWithPayload} from '../interfaces/actions';

export type Structure = Table[];

const tables = (state: Structure = [], action: ActionWithPayload<Structure>): Structure => {
  if (action.type === TABLES_CHANGED) {
    return action.payload.concat([]);
  } else {
    return state;
  }
};

export default tables;
