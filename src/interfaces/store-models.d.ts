import {TableType, TableSession as TableSessionBackend} from './backend-models';
import {Structure as ReducersStructure} from '../reducers/index';

export type TableStatus = 'ready' | 'active';

export interface Table {
  name: string;
  id: number;
  tableType: TableType;
  currentSessionId: number;
  lastSessionId?: number;
  isInPending: boolean;
  isDisabled: boolean;
}

export interface TableSession extends TableSessionBackend {}

export type StoreStructure = ReducersStructure;
