import {Table as BackendTable, TableSession as TableSessionBackend} from '../interfaces/backend-models';
import {
  Table as FrontendTable, TableSession as TableSessionFrontend, Tables,
  TableSessions
} from '../interfaces/store-models';
import * as moment from 'moment';
import {PartialIndexedDict} from '../interfaces/index';

const tableToFront = (table: BackendTable): FrontendTable => {
  const currentSessionId = table.currentSession ? table.currentSession.id : null;
  const lastSessionId = table.lastSession ? table.lastSession.id : null;
  const sessionsHistory: ReadonlyArray<number> = [currentSessionId, lastSessionId]
    .filter((session) => typeof session === 'number') as ReadonlyArray<number>;

  return {
    name: table.name,
    id: table.id,
    tableType: table.tableType,
    isInPending: false,
    isDisabled: table.status === 'disabled',
    isSessionsHistoryInPending: false,
    sessionsHistory,
    currentSessionId,
    lastSessionId
  };
};

export const tablesToFront = (tables: ReadonlyArray<BackendTable>): Tables => {
  return tables.reduce((memo, table) => {
    const convertedTable = tableToFront(table);

    memo[convertedTable.id] = convertedTable;

    return memo;
  }, {} as PartialIndexedDict<FrontendTable>);
};

export const tableSessionToFront = (tableSession: TableSessionBackend): TableSessionFrontend => {
  const startsAtMs = moment(tableSession.startsAt, moment.ISO_8601).valueOf();

  return {
    id: tableSession.id,
    startsAt: startsAtMs,
    durationSeconds: tableSession.durationSeconds || 0,
    adminEdited: tableSession.adminEdited,
    isInPending: false
  };
};

export const tableSessionsToFront = (tableSessions: ReadonlyArray<TableSessionBackend>): TableSessions => {
  return tableSessions.reduce((memo, tableSession) => {
    const convertedTableSession = tableSessionToFront(tableSession);

    memo[convertedTableSession.id] = convertedTableSession;

    return memo;
  }, {} as PartialIndexedDict<TableSessionFrontend>);
};
