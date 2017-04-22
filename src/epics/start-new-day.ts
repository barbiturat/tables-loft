import {Store} from 'redux';
import {BaseAction} from 'redux-actions';
import {Epic} from 'redux-observable';
import {pipe, clone, map} from 'ramda';

import {NEW_DAY_BEGUN} from '../constants/action-names';
import {StoreStructure, Tables, Table} from '../interfaces/store-models';
import changingTables from '../action-creators/changing-tables';
import {ActionWithPayload} from '../interfaces/actions';

const startNewDay = ((action$, store: Store<StoreStructure>) => {
  return action$.ofType(NEW_DAY_BEGUN)
    .map(() => pipe< Tables, Tables, Tables, ActionWithPayload<Tables> >(
      clone,
      map((table: Table) => ({...table, ...{lastSessionId: null}})),
      changingTables
    )(store.getState().app.tablesData.tables));
}) as Epic<BaseAction, StoreStructure>;

export default startNewDay;
