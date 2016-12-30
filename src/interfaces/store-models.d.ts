import {TableType, TableStatus, TableSession as TableSessionBackend} from './backend-models';
import {Structure as ReducersStructure} from '../reducers/index';

export interface Table {
  name: string;
  id: number;
  tableType: TableType;
  status: TableStatus;
  currentSessionId: number;
  lastSessionId?: number;
  isInPending: boolean;
}

export interface TableSession extends TableSessionBackend {}

export type StoreStructure = ReducersStructure;
