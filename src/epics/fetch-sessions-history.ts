import { Observable } from 'rxjs';
import { Action, BaseAction } from 'redux-actions';
import { Epic } from 'redux-observable';
import { Store } from 'redux';
import { pipe, clone, merge, keys, map, concat, uniq } from 'ramda';
// tslint:disable-next-line:no-require-imports
const t = require('tcomb-validation');

import { FETCHING_TABLE_SESSIONS_HISTORY } from '../constants/action-names';
import {
  get,
  isAjaxResponseDefined,
  getRequestFailedAction
} from '../helpers/requests';
import {
  ResponseFailedPayload,
  ResponseSessionsHistoryPayload
} from '../interfaces/api-responses';
import {
  AjaxResponseTyped,
  AjaxErrorTyped,
  AjaxResponseDefined
} from '../interfaces/index';
import { urlSessionHistory } from '../constants/urls';
import { tableSessionsToFront } from '../helpers/api-data-converters';
import changingTableSessions from '../action-creators/changing-table-sessions';
import { ActionType } from '../action-creators/fetching-table-sessions-history';
import { RequestSessionHistoryPayload } from '../interfaces/api-requests';
import {
  StoreStructure,
  TablesStore,
  TableSessionsStore,
  TableStore
} from '../interfaces/store-models';
import changingTables from '../action-creators/changing-tables';
import { API_URL } from '../constants/index';
import { TableSessionBackend } from '../interfaces/backend-models';
import { validateResponse } from '../helpers/dynamic-type-validators/index';
import { tTableSession } from '../helpers/dynamic-type-validators/types';

type ResponseOk = AjaxResponseTyped<ResponseSessionsHistoryPayload>;
type ResponseOkDefined = AjaxResponseDefined<ResponseSessionsHistoryPayload>;
type ResponseError = AjaxErrorTyped<ResponseFailedPayload>;

const replaceTable = (
  tables: TablesStore,
  tableId: number,
  newTableData: Partial<TableStore>
): TablesStore => {
  const currentTable = tables[tableId];

  if (currentTable) {
    const newTable = { ...currentTable, ...newTableData };
    tables = { ...tables, ...{ [newTable.id]: newTable } };
  }

  return tables;
};

const getTablesWithSetHistoryPending = (
  tables: TablesStore,
  tableId: number,
  isInPending: boolean
): TablesStore => {
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
  return action$
    .ofType(FETCHING_TABLE_SESSIONS_HISTORY)
    .switchMap((action: ActionType) => {
      const tableId = action.payload;
      const dataToSend: RequestSessionHistoryPayload = {};
      const url = `${API_URL}${urlSessionHistory}`.replace(
        ':table_id',
        String(tableId)
      );

      const setTablesWithPending$ = pipe<
        TablesStore,
        TablesStore,
        TablesStore,
        Action<TablesStore>,
        Observable<Action<TablesStore>>
      >(
        clone,
        (currentTablesClone: TablesStore) =>
          getTablesWithSetHistoryPending(currentTablesClone, tableId, true),
        (tablesWithSetPending: TablesStore) => changingTables(tablesWithSetPending),
        (tablesPendingAction: Action<TablesStore>) =>
          Observable.of(tablesPendingAction)
      )(store.getState().app.tablesData.tables);

      const historyRequest$ = Observable.of(null).mergeMap(() =>
        get<RequestSessionHistoryPayload>(
          url,
          dataToSend
        ).mergeMap((ajaxData: ResponseOk | ResponseError) => {
          if (isAjaxResponseDefined<ResponseOkDefined>(ajaxData)) {
            assertResponse(ajaxData);

            const { tableSessionsData, tablesData } = store.getState().app;

            const convertedResponseSessions = pipe<
              ReadonlyArray<TableSessionBackend>,
              TableSessionsStore
            >((respSessions: ReadonlyArray<TableSessionBackend>) =>
              tableSessionsToFront(respSessions)
            )(ajaxData.response.sessions);

            const setSessionsAction = pipe<
              TableSessionsStore,
              TableSessionsStore,
              Action<TableSessionsStore>
            >(
              merge(tableSessionsData.tableSessions),
              (newSessionsAll: TableSessionsStore) =>
                changingTableSessions(newSessionsAll)
            )(convertedResponseSessions);

            const tablesClone = { ...tablesData.tables };
            const currentTable = tablesClone[tableId];
            const setTablesAction = currentTable
              ? pipe<
                  TableSessionsStore,
                  ReadonlyArray<string>,
                  ReadonlyArray<number>,
                  ReadonlyArray<number>,
                  ReadonlyArray<number>,
                  TablesStore,
                  Action<TablesStore>
                >(
                  keys,
                  map(Number),
                  concat(currentTable.sessionsHistory),
                  uniq,
                  (newSessionIds: ReadonlyArray<number>) =>
                    replaceTable(tablesClone, tableId, {
                      isSessionsHistoryInPending: false,
                      sessionsHistory: newSessionIds
                    }),
                  changingTables
                )(convertedResponseSessions) as Action<TablesStore>
              : null;

            const actions: ReadonlyArray<BaseAction> = <ReadonlyArray<
              BaseAction
            >>[setSessionsAction, setTablesAction].filter(Boolean);

            return Observable.from(actions);
          } else {
            const setTablesWithoutPendingAction = pipe<
              TablesStore,
              TablesStore,
              TablesStore,
              Action<TablesStore>
            >(
              clone,
              tablesClone =>
                getTablesWithSetHistoryPending(tablesClone, tableId, false),
              changingTables
            )(store.getState().app.tablesData.tables);

            const fetchFailedAction = getRequestFailedAction(
              ajaxData.status,
              'Fetching table sessions error'
            );

            return Observable.of<BaseAction>(
              setTablesWithoutPendingAction,
              fetchFailedAction
            );
          }
        })
      );

      return Observable.concat(setTablesWithPending$, historyRequest$);
    });
}) as Epic<BaseAction, StoreStructure>;

export default fetchSessionsHistory;
