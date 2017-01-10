import {MiddlewareAPI} from 'redux';
import {Epic} from 'redux-observable';

import {PENDING_REQUEST_TABLE_STATUS_CHANGED} from '../constants/action-names';
import {SimpleAction} from '../interfaces/actions';
import {ActionType} from '../action-creators/pending-request-table-status-change';
import {StoreStructure} from '../interfaces/store-models';
import tablesChanged from '../action-creators/tables-changed';

const setTablePending = ((action$, store: MiddlewareAPI<StoreStructure>) => {
  return action$.ofType(PENDING_REQUEST_TABLE_STATUS_CHANGED)
    .map((action: ActionType) => {
      const {isInPending, tableId} = action.payload;
      const currentTables = store.getState().app.tablesData.tables;
      const changedTable = currentTables[tableId];

      if (changedTable) {
        changedTable.isInPending = isInPending;
      }

      return tablesChanged(currentTables);
    });
}) as Epic<SimpleAction>;

export default setTablePending;
