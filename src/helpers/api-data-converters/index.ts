import {Table as BackendTable, TableSession as TableSessionBackend} from '../../interfaces/backend-models';
import {
  Table as FrontendTable, TableSession as TableSessionFrontend, Tables,
  TableSessions
} from '../../interfaces/store-models';
import * as moment from 'moment';

const tableToFront = (table: BackendTable): FrontendTable => {
  const currentSessionId = table.currentSession && table.currentSession.id;
  const lastSessionId = table.lastSession && table.lastSession.id;
  const sessionsHistory: number[] = [];
  const lastSessionIdNum = Number(lastSessionId);
  const currentSessionIdNum = Number(currentSessionId);

  if (!isNaN(lastSessionIdNum)) {
    sessionsHistory.push(lastSessionIdNum);
  }

  if (!isNaN(currentSessionIdNum)) {
    sessionsHistory.push(currentSessionIdNum);
  }

  return {
    name: table.name,
    id: table.id,
    tableType: table.tableType,
    currentSessionId,
    lastSessionId,
    isInPending: false,
    isDisabled: table.status === 'disabled',
    isSessionsHistoryInPending: false,
    sessionsHistory
  };
};

export const tablesToFront = (tables: BackendTable[]): Tables => {
  return tables.reduce((memo: Tables, table) => {
    const convertedTable = tableToFront(table);

    memo[convertedTable.id] = convertedTable;

    return memo;
  }, {} as Tables);
};

export const tableSessionToFront = (tableSession: TableSessionBackend): TableSessionFrontend => {
  const startsAtMs = moment(tableSession.startsAt, moment.ISO_8601).valueOf();

  return {
    id: tableSession.id,
    startsAt: startsAtMs,
    durationSeconds: tableSession.durationSeconds,
    adminEdited: tableSession.adminEdited,
    isInPending: false
  };
};

export const tableSessionsToFront = (tableSessions: TableSessionBackend[]): TableSessions => {
  return tableSessions.reduce((memo: TableSessions, tableSession) => {
    const convertedTableSession = tableSessionToFront(tableSession);

    memo[convertedTableSession.id] = convertedTableSession;

    return memo;
  }, {} as TableSessions);
};
