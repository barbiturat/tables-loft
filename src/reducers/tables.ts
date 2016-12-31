import {FETCHING_TABLES_SUCCEEDED, CHANGING_TABLES} from '../constants/action-names';
import {Table} from '../interfaces/store-models';
import {ActionWithPayload} from '../interfaces/actions';

export type Structure = Table[];

const tables = (state: Structure = [], action: ActionWithPayload<Structure>): Structure => {
  if (action.type == FETCHING_TABLES_SUCCEEDED || action.type == CHANGING_TABLES) {
    return action.payload.concat([]);
  } else {
    return state;
  }
};

export default tables;
