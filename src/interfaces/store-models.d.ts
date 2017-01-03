import {TableType, TableSession as TableSessionBackend} from './backend-models';
import {Structure as ReducersStructure} from '../reducers/index';

export interface Table {
  name: string;
  id: number;
  tableType: TableType;
  currentSessionId?: number | null;
  lastSessionId?: number | null;
  isInPending: boolean;
  isDisabled: boolean;
}

export interface TableSession {
  id: number;
  startsAt: number;
  durationSeconds: number;
  adminEdited: boolean;
}

export type StoreStructure = ReducersStructure;
