export interface RequestLoginPayload {
  email?: string;
  password?: string;
}

export interface RequestSessionHistoryPayload {
}

export interface RequestGetAdminTokenPayload {
  password: string;
}

export interface RequestUpdateTableSessionPayload {
  sessionId: number;
  durationSeconds: number;
  adminToken: string;
}

