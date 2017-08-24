import * as R from 'ramda';

import {
  TableBackend,
  TableSessionBackend
} from '../interfaces/backend-models';
import {
  TableStore,
  TableSessionStore,
  TablesStore,
  TableSessionsStore
} from '../interfaces/store-models';
import * as moment from 'moment';
import { PartialIndexedDict } from '../interfaces/index';

const tableToFront = (table: TableBackend): TableStore => {
  const currentSessionId = table.currentSession
    ? table.currentSession.id
    : null;
  const lastSessionId = table.lastSession ? table.lastSession.id : null;
  const sessionsHistory: ReadonlyArray<number> = [
    currentSessionId,
    lastSessionId
  ].filter(session => typeof session === 'number') as ReadonlyArray<number>;

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

export const tablesToFront = (
  tables: ReadonlyArray<TableBackend>
): TablesStore => {
  return tables.reduce((memo, table) => {
    const convertedTable = tableToFront(table);

    return R.merge(memo, { [convertedTable.id]: convertedTable });
  }, {} as PartialIndexedDict<TableStore>);
};

export const tableSessionToFront = (
  tableSession: TableSessionBackend
): TableSessionStore => {
  const startsAtMs = moment(tableSession.startsAt, moment.ISO_8601).valueOf();

  return {
    id: tableSession.id,
    startsAt: startsAtMs,
    durationSeconds: tableSession.durationSeconds || 0,
    adminEdited: tableSession.adminEdited,
    isInPending: false
  };
};

export const tableSessionsToFront = (
  tableSessions: ReadonlyArray<TableSessionBackend>
): TableSessionsStore => {
  return tableSessions.reduce((memo, tableSession) => {
    const convertedTableSession = tableSessionToFront(tableSession);

    return R.merge(memo, { [convertedTableSession.id]: convertedTableSession });
  }, {} as PartialIndexedDict<TableSessionStore>);
};
