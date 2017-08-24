import { handleAction } from 'redux-actions';

import { CHANGING_TABLES } from '../constants/action-names';
import { TablesStore } from '../interfaces/store-models';
import { PayloadType } from '../action-creators/changing-tables';

export type Structure = TablesStore;

const tables = handleAction<Structure, PayloadType>(
  CHANGING_TABLES,
  (state, action) => ({ ...action.payload }),
  {}
);

export default tables;
