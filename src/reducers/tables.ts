import {FETCHING_TABLES_SUCCEEDED} from '../constants/action-names';
import {Table} from '../interfaces/store-models';
import {ActionType} from '../action-creators/fetching-tables-succeeded';

export type Structure = Table[];

const tables = (state: Structure = [], action: ActionType): Structure => {
  switch (action.type) {
    case FETCHING_TABLES_SUCCEEDED:
      return action.payload;

    default:
      return state;
  }
};

export default tables;
