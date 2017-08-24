import { TableType as TableTypeBackend } from './backend-models';
import { Structure as ReducersStructure } from '../reducers/index';
import { IndexedDict } from './index';

export type TableType = TableTypeBackend;

export interface TableStore {
  readonly name: string;
  readonly id: number;
  readonly tableType: TableType;
  readonly currentSessionId: number | null;
  readonly lastSessionId: number | null;
  readonly isInPending: boolean;
  readonly isDisabled: boolean;
  readonly isSessionsHistoryInPending: boolean;
  readonly sessionsHistory: ReadonlyArray<number>;
}

export type TablesStore = IndexedDict<TableStore>;

export interface TableSessionStore {
  readonly id: number;
  readonly startsAt: number;
  readonly durationSeconds: number;
  readonly adminEdited: boolean;
  readonly isInPending: boolean;
}

export type TableSessionsStore = IndexedDict<TableSessionStore>;

export type StoreStructure = ReducersStructure;

export type AdminToken = string | null;

export interface ModalSessionsHistory {
  readonly isOpened: boolean;
  readonly tableId?: number;
}

export interface GlobalError {
  readonly message: string;
  readonly date: number;
}
