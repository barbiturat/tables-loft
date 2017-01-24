import {TableSession, Table} from '../../interfaces/backend-models';
// tslint:disable-next-line:no-require-imports
const t = require('tcomb-validation');

export const tTableType = t.enums.of(['pool', 'shuffleBoard', 'tableTennis', 'generic']);
export const tTableStatus = t.enums.of(['enabled', 'disabled']);
export const tNullableNumber = <number | null>t.union([t.Number, t.Nil]);

export const tTableSession = <TableSession>t.interface({
  id: t.Number,
  startsAt: t.String,
  durationSeconds: tNullableNumber,
  adminEdited: t.Boolean
});

export const tNullableSession = <TableSession | null>t.union([tTableSession, t.Nil]);

export const tTable = <Table>t.interface({
  name: t.String,
  id: t.Number,
  tableType: tTableType,
  status: tTableStatus,
  currentSession: tNullableSession,
  lastSession: tNullableSession
});
