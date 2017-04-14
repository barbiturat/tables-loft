import {TableSession, Table, LoginErrors, AdminTokenErrors} from './backend-models';

export interface ResponseDefaultPayload {
  readonly isOk: true;
}

export interface ResponseFailedPayload {
  readonly error: string;
}

export interface ResponseLoginFailedPayload {
  readonly errors: LoginErrors;
}

export interface ResponseGetAdminTokenFailedPayload {
  readonly errors: AdminTokenErrors;
}

export interface ResponseTablesPayload {
  readonly tables: ReadonlyArray<Table>;
}

export interface ResponseSessionsHistoryPayload {
  readonly sessions: ReadonlyArray<TableSession>;
}

export interface ResponseStartTablePayload {
  readonly session: TableSession;
}

export interface ResponseStopTablePayload {
  readonly session: TableSession;
}

export interface ResponseGetAdminTokenPayload {
  readonly adminToken: string;
}

export interface ResponseUpdateTableSessionPayload {}

