export interface RequestLoginPayload {
  readonly email?: string;
  readonly password?: string;
}

export interface RequestSessionHistoryPayload {}

export interface RequestGetAdminTokenPayload {
  readonly password: string;
}

export interface RequestUpdateTableSessionPayload {
  readonly sessionId: number;
  readonly durationSeconds: number;
  readonly adminToken?: string;
}
