export type TableType = 'pool' | 'shuffleBoard' | 'tableTennis' | 'generic';
export type TableStatus = 'enabled' | 'disabled';

export interface TableSession {
  id: number;
  startsAt: string;
  durationSeconds: number | null;
  adminEdited: boolean;
}

export interface Table {
  name: string;
  id: number;
  tableType: TableType;
  status: TableStatus;
  currentSession: TableSession | null;
  lastSession: TableSession | null;
}

export interface LoginErrors {
  email: {
    isRegistered: boolean;
  };
  password: {
    isCorrect: boolean;
  };
}

export interface AdminTokenErrors {
  password: {
    isCorrect: boolean;
  };
}

