import {
  TableSessionBackend,
  TableBackend,
  LoginErrors,
  AdminTokenErrors
} from './backend-models';

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
  readonly tables: ReadonlyArray<TableBackend>;
}

export interface ResponseSessionsHistoryPayload {
  readonly sessions: ReadonlyArray<TableSessionBackend>;
}

export interface ResponseStartTablePayload {
  readonly session: TableSessionBackend;
}

export interface ResponseStopTablePayload {
  readonly session: TableSessionBackend;
}

export interface ResponseGetAdminTokenPayload {
  readonly adminToken: string;
}

export interface ResponseUpdateTableSessionPayload {}
