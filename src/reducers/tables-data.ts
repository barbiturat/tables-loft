import { combineReducers } from 'redux';

import { ReducersOfType } from '../interfaces/index';
import tables, { Structure as TablesStructure } from './tables';
import isInPending, {
  Structure as IsInPendingStructure
} from './tables-pending';

export interface Structure {
  readonly tables: TablesStructure;
  readonly isInPending: IsInPendingStructure;
}

const reducers: ReducersOfType<Structure> = {
  tables,
  isInPending
};

const tablesData = combineReducers<Structure>(reducers);

export default tablesData;
