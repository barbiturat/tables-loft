import {TableSession, Table, LoginErrors, AdminTokenErrors} from './backend-models';

export interface ResponseDefaultPayload {
  isOk: true;
}

export interface ResponseFailedPayload {
  error: string;
}

export interface ResponseLoginFailedPayload {
  errors: LoginErrors;
}

export interface ResponseGetAdminTokenFailedPayload {
  errors: AdminTokenErrors;
}

export interface ResponseTablesPayload {
  tables: Table[];
}

export interface ResponseSessionsHistoryPayload {
  sessions: TableSession[];
}

export interface ResponseStartTablePayload {
  session: TableSession;
}

export interface ResponseStopTablePayload {
  session: TableSession;
}

export interface ResponseGetAdminTokenPayload {
  accessToken: string;
}

export interface ResponseUpdateTableSessionPayload {}

