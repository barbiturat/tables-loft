export type TableType = 'pool' | 'shuffleBoard' | 'tableTennis' | 'generic';
export type TableStatus = 'enabled' | 'disabled';

export interface TableSession {
  readonly id: number;
  readonly startsAt: string;
  readonly durationSeconds: number | null;
  readonly adminEdited: boolean;
}

export interface Table {
  readonly name: string;
  readonly id: number;
  readonly tableType: TableType;
  readonly status: TableStatus;
  readonly currentSession: TableSession | null;
  readonly lastSession: TableSession | null;
}

export interface LoginErrors {
  readonly email: {
    isRegistered: boolean;
  };
  readonly password: {
    isCorrect: boolean;
  };
}

export interface AdminTokenErrors {
  readonly password: {
    isCorrect: boolean;
  };
}
