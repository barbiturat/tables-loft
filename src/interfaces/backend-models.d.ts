export type TableType = 'pool' | 'shuffleBoard' | 'tableTennis' | 'generic';
export type TableStatus = 'enabled' | 'disabled';

export interface TableSessionBackend {
  readonly id: number;
  readonly startsAt: string;
  readonly durationSeconds: number | null;
  readonly adminEdited: boolean;
}

export interface TableBackend {
  readonly name: string;
  readonly id: number;
  readonly tableType: TableType;
  readonly status: TableStatus;
  readonly currentSession: TableSessionBackend | null;
  readonly lastSession: TableSessionBackend | null;
}

export interface LoginErrors {
  readonly email: {
    readonly isRegistered: boolean;
  };
  readonly password: {
    readonly isCorrect: boolean;
  };
}

export interface AdminTokenErrors {
  readonly password: {
    readonly isCorrect: boolean;
  };
}
