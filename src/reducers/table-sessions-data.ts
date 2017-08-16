import { combineReducers } from 'redux';

import { ReducersOfType } from '../interfaces/index';
import isInPending, {
  Structure as IsInPendingStructure
} from './tables-sessions-pending';
import tableSessions, {
  Structure as TableSessionsStructure
} from './table-sessions';

export interface Structure {
  readonly tableSessions: TableSessionsStructure;
  readonly isInPending: IsInPendingStructure;
}

const reducers: ReducersOfType<Structure> = {
  tableSessions,
  isInPending
};

const tableSessionsData = combineReducers<Structure>(reducers);

export default tableSessionsData;
