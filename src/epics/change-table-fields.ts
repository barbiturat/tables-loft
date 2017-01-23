import {Store} from 'redux';
import {Epic} from 'redux-observable';
import {pipe, objOf, when, prop, merge, clone, flip} from 'ramda';

import {CHANGING_TABLE_FIELDS} from '../constants/action-names';
import {SimpleAction, ActionWithPayload} from '../interfaces/actions';
import {ActionType} from '../action-creators/changing-table-fields';
import {StoreStructure, Tables} from '../interfaces/store-models';
import changingTables from '../action-creators/changing-tables';

const changeTableFields = ((action$, store: Store<StoreStructure>) => {
  return action$.ofType(CHANGING_TABLE_FIELDS)
    .map((action: ActionType) => {
      const {tableId, changedFields} = action.payload;
      const tblId = String(tableId);

      return pipe< Tables, Tables, Tables, ActionWithPayload<Tables> >(
        clone,
        when( prop(tblId),
          (tables: Tables) =>
            pipe(
              prop(tblId), // table
              flip(merge)(changedFields), // merge with new props
              objOf(tblId), // {tblId: table}
              merge(tables) // updated tables
            )(tables)
        ),
        changingTables // action
      )(store.getState().app.tablesData.tables);

    });
}) as Epic<SimpleAction>;

export default changeTableFields;