import {MiddlewareAPI} from 'redux';
import {Epic} from 'redux-observable';
import {find} from 'lodash';

import {PENDING_REQUEST_TABLE_START} from '../constants/action-names';
import {SimpleAction} from '../interfaces/actions';
import {ActionType} from '../action-creators/pending-request-table-start';
import {StoreStructure} from '../interfaces/store-models';
import changingTables from '../action-creators/changing-tables';

const setTablePending = ((action$, store: MiddlewareAPI<StoreStructure>) => {
  return action$.ofType(PENDING_REQUEST_TABLE_START)
    .map((action: ActionType) => {
      const {isInPending, tableId} = action.payload;
      const currentTables = store.getState().app.tablesData.tables;
      const changedTable = find(currentTables, (table) => table.id === tableId);

      if (changedTable) {
        changedTable.isInPending = isInPending;
      }

      return changingTables(currentTables);
    });
}) as Epic<SimpleAction>;

export default setTablePending;
