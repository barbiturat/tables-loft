import {Action, BaseAction} from 'redux-actions';
import {Store} from 'redux';
import {Epic} from 'redux-observable';
import {pipe, objOf, ifElse, prop, merge, clone, flip} from 'ramda';

import {CHANGING_TABLE_FIELDS} from '../constants/action-names';
import {ActionType} from '../action-creators/changing-table-fields';
import {StoreStructure, Tables, Table} from '../interfaces/store-models';
import changingTables from '../action-creators/changing-tables';
import nothingDone from '../action-creators/nothing-done';

const changeTableFields = ((action$, store: Store<StoreStructure>) => {
  return action$.ofType(CHANGING_TABLE_FIELDS)
    .map((action: ActionType) => {
      const {tableId, changedFields} = action.payload;
      const tblId = String(tableId);

      return pipe< Tables, BaseAction | undefined >(
        ifElse( prop(tblId),
          (tables: Tables) =>
            pipe< Tables, Tables, Table, Table, Tables, Tables, Action<Tables> >(
              clone,
              prop(tblId), // table
              flip(merge)(changedFields), // merge with new props
              objOf(tblId), // {tblId: table}
              merge(tables), // updated tables
              changingTables // action
            )(tables),
          (tables: Tables) => nothingDone
        )
      )(store.getState().app.tablesData.tables);
    });
}) as Epic<BaseAction, StoreStructure>;

export default changeTableFields;
