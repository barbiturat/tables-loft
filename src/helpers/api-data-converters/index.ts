import {Table as BackendTable, TableSession as TableSessionBackend} from '../../interfaces/backend-models';
import {Table as FrontendTable, TableSession as TableSessionFrontend} from '../../interfaces/store-models';
import * as moment from 'moment';

export const tablesToFront = (tables: BackendTable[]): FrontendTable[] => {
  return tables.map((table) => {
    const currentSessionId = table.currentSession ? table.currentSession.id : null;
    const lastSessionId = table.lastSession ? table.lastSession.id : null;

    return {
      name: table.name,
      id: table.id,
      tableType: table.tableType,
      currentSessionId,
      lastSessionId,
      isInPending: false,
      isDisabled: table.status === 'disabled'
    };
  });
};

export const tableSessionToFront = (tableSession: TableSessionBackend): TableSessionFrontend => {
  const startsAtMs = moment(tableSession.starts_at, moment.ISO_8601).valueOf();

  return {
    id: tableSession.id,
    startsAt: startsAtMs,
    durationSeconds: tableSession.durationSeconds,
    adminEdited: tableSession.adminEdited
  };
};

export const tableSessionsToFront = (tableSessions: TableSessionBackend[]): TableSessionFrontend[] => {
  return tableSessions.map((session) => tableSessionToFront(session));
};