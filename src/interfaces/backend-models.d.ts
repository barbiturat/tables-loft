export type TableType = 'pool' | 'shuffleBoard' | 'tableTennis' | 'generic';
export type TableStatus = 'ready' | 'active' | 'disabled';

export interface TableSession {
  id: number;
  starts_at: string;
  durationSeconds: number;
  adminEdited: boolean;
}

export interface Table {
  name: string;
  id: number;
  tableType: TableType;
  status: TableStatus;
  currentSession: TableSession;
  lastSession: TableSession;
}

export interface LoginErrors {
  email: {
    isRegistered?: boolean;
  };
  password: {
    isCorrect?: boolean;
  };
}
