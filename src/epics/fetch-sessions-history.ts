/// <reference path="../custom-typings/ramda.d.ts" />

import {Observable} from 'rxjs';
import {Epic} from 'redux-observable';
import {Store} from 'redux';
import {pipe, clone, merge, keys, map, concat, uniq} from 'ramda';
// tslint:disable-next-line:no-require-imports
const t = require('tcomb-validation');

import {FETCHING_TABLE_SESSIONS_HISTORY} from '../constants/action-names';
import {
  get, isAjaxResponseDefined,
  getRequestFailedAction
} from '../helpers/requests';
import {
  ResponseFailedPayload,
  ResponseSessionsHistoryPayload
} from '../interfaces/api-responses';
import {AjaxResponseTyped, AjaxErrorTyped, AjaxResponseDefined} from '../interfaces/index';
import {urlSessionHistory} from '../constants/urls';
import {SimpleAction, ActionWithPayload} from '../interfaces/actions';
import {tableSessionsToFront} from '../helpers/api-data-converters';
import changingTableSessions from '../action-creators/changing-table-sessions';
import {ActionType} from '../action-creators/fetching-table-sessions-history';
import {RequestSessionHistoryPayload} from '../interfaces/api-requests';
import {StoreStructure, Tables, TableSessions, Table} from '../interfaces/store-models';
import changingTables from '../action-creators/changing-tables';
import {API_URL} from '../constants/index';
import {TableSession} from '../interfaces/backend-models';
import {validateResponse} from '../helpers/dynamic-type-validators/index';
import {tTableSession} from '../helpers/dynamic-type-validators/types';

type ResponseOk = AjaxResponseTyped<ResponseSessionsHistoryPayload>;
type ResponseOkDefined = AjaxResponseDefined<ResponseSessionsHistoryPayload>;
type ResponseError = AjaxErrorTyped<ResponseFailedPayload>;

const replaceTable = (tables: Tables, tableId: number, newTableData: Partial<Table>): Tables => {
  const currentTable = tables[tableId];

  if (currentTable) {
    const newTable = {...currentTable, ...newTableData};
    tables = {...tables, ...{[newTable.id]: newTable}};
  }

  return tables;
};

const getTablesWithSetHistoryPending = (tables: Tables, tableId: number, isInPending: boolean): Tables => {
  return replaceTable(tables, tableId, {
    isSessionsHistoryInPending: isInPending
  });
};

const assertResponse = (ajaxData: ResponseOk) => {
  const tResponse = <ResponseSessionsHistoryPayload>t.interface({
    sessions: t.list(tTableSession)
  });

  validateResponse(tResponse, ajaxData);
};

const fetchSessionsHistory = ((action$, store: Store<StoreStructure>) => {
  return action$.ofType(FETCHING_TABLE_SESSIONS_HISTORY)
    .switchMap((action: ActionType) => {
      const tableId = action.payload;
      const dataToSend: RequestSessionHistoryPayload = {};
      const url = `${API_URL}${urlSessionHistory}`.replace(':table_id', String(tableId));

      const setTablesWithPending$ = pipe< Tables, Tables, Tables, ActionWithPayload<Tables>, Observable<ActionWithPayload<Tables>> >(
        clone,
        (currentTablesClone: Tables) => getTablesWithSetHistoryPending(currentTablesClone, tableId, true),
        (tablesWithSetPending: Tables) => changingTables(tablesWithSetPending),
        (tablesPendingAction: ActionWithPayload<Tables>) => Observable.of(tablesPendingAction)
      )(store.getState().app.tablesData.tables);

      const historyRequest$ = Observable.of(null)
        .mergeMap(() =>
          get<RequestSessionHistoryPayload>(url, dataToSend)
            .mergeMap((ajaxData: ResponseOk | ResponseError) => {
              if ( isAjaxResponseDefined<ResponseOkDefined>(ajaxData) ) {
                assertResponse(ajaxData);

                const {tableSessionsData, tablesData} = store.getState().app;

                const convertedResponseSessions = pipe<ReadonlyArray<TableSession>, TableSessions>(
                  (respSessions: ReadonlyArray<TableSession>) => tableSessionsToFront(respSessions)
                )(ajaxData.response.sessions);

                const setSessionsAction = pipe<TableSessions, TableSessions, ActionWithPayload<TableSessions> >(
                  merge(tableSessionsData.tableSessions),
                  (newSessionsAll: TableSessions) => changingTableSessions(newSessionsAll)
                )(convertedResponseSessions);

                const tablesClone = {...tablesData.tables};
                const currentTable = tablesClone[tableId];
                const setTablesAction = currentTable ?
                  pipe< TableSessions, ReadonlyArray<string>, ReadonlyArray<number>, ReadonlyArray<number>, ReadonlyArray<number>, Tables, ActionWithPayload<Tables> >(
                    keys,
                    map(Number),
                    concat(currentTable.sessionsHistory),
                    uniq,
                    (newSessionIds: ReadonlyArray<number>) => replaceTable(tablesClone, tableId, {
                      isSessionsHistoryInPending: false,
                      sessionsHistory: newSessionIds
                    }),
                    changingTables
                  )(convertedResponseSessions) as ActionWithPayload<Tables> :
                  null;

                const actions: ReadonlyArray<SimpleAction> = < ReadonlyArray<SimpleAction> >[setSessionsAction, setTablesAction]
                  .filter(Boolean);

                return Observable.from(actions);
              } else {
                const setTablesWithoutPendingAction = pipe<Tables, Tables, Tables, ActionWithPayload<Tables> >(
                  clone,
                  (tablesClone) => getTablesWithSetHistoryPending(tablesClone, tableId, false),
                  changingTables
                )(store.getState().app.tablesData.tables);

                const fetchFailedAction = getRequestFailedAction(ajaxData.status, 'Fetching table sessions error');

                return Observable.of<SimpleAction>(
                  setTablesWithoutPendingAction,
                  fetchFailedAction
                );
              }
            })
        );

      return Observable.concat(
        setTablesWithPending$,
        historyRequest$
      );
    });
}) as Epic<SimpleAction, StoreStructure>;

export default fetchSessionsHistory;
