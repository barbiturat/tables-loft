import { Action, BaseAction } from 'redux-actions';
import { Store } from 'redux';
import { Epic } from 'redux-observable';
import { pipe, objOf, ifElse, prop, merge, clone, flip } from 'ramda';

import { CHANGING_TABLE_FIELDS } from '../constants/action-names';
import { ActionType } from '../action-creators/changing-table-fields';
import { StoreStructure, TablesStore, TableStore } from '../interfaces/store-models';
import changingTables from '../action-creators/changing-tables';
import nothingDone from '../action-creators/nothing-done';

const changeTableFields = ((action$, store: Store<StoreStructure>) => {
  return action$.ofType(CHANGING_TABLE_FIELDS).map((action: ActionType) => {
    const { tableId, changedFields } = action.payload;
    const tblId = String(tableId);

    return pipe<TablesStore, BaseAction | undefined>(
      ifElse(
        prop(tblId),
        (tables: TablesStore) =>
          pipe<
            TablesStore,
            TablesStore,
            TableStore,
            TableStore,
            TablesStore,
            TablesStore,
            Action<TablesStore>
          >(
            clone,
            prop(tblId), // table
            flip(merge)(changedFields), // merge with new props
            objOf(tblId), // {tblId: table}
            merge(tables), // updated tables
            changingTables // action
          )(tables),
        (tables: TablesStore) => nothingDone
      )
    )(store.getState().app.tablesData.tables);
  });
}) as Epic<BaseAction, StoreStructure>;

export default changeTableFields;
