import {TableType, TableSession as TableSessionBackend} from './backend-models';
import {Structure as ReducersStructure} from '../reducers/index';
import {IndexedDict} from './index';

export interface Table {
  name: string;
  id: number;
  tableType: TableType;
  currentSessionId?: number;
  lastSessionId?: number;
  isInPending: boolean;
  isDisabled: boolean;
  isSessionsHistoryInPending: boolean;
  sessionsHistory: number[];
}

export type Tables = IndexedDict<Table>;

export interface TableSession {
  id: number;
  startsAt: number;
  durationSeconds: number;
  adminEdited: boolean;
  isInPending: boolean;
}

export type StoreStructure = ReducersStructure;

export type AdminToken = string | null;

export interface ModalSessionsHistory {
  isOpened: boolean;
  tableId?: number;
}
