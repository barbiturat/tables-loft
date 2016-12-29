import {TableSession, Table, LoginErrors} from './backend-models';

export interface ResponseDefaultPayload {
  isOk: true;
}

export interface ResponseFailedPayload {
  error: string;
}

export interface ResponseLoginFailedPayload {
  errors: LoginErrors;
}

export interface ResponseTablesPayload {
  tables: Table[];
}

export interface ResponseSessionHistoryPayload {
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

