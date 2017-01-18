import {Observable} from 'rxjs';
import {Epic} from 'redux-observable';
import {Store} from 'redux';
import {clone, assign, uniq, chain} from 'lodash';

import {FETCHING_TABLE_SESSIONS_HISTORY} from '../constants/action-names';
import {get, getErrorMessageFromResponse, isAjaxResponseDefined} from '../helpers/requests';
import {
  ResponseFailedPayload,
  ResponseSessionsHistoryPayload
} from '../interfaces/api-responses';
import {AjaxResponseTyped, AjaxErrorTyped, AjaxResponseDefined} from '../interfaces/index';
import {urlSessionHistory} from '../constants/urls';
import {SimpleAction, ActionWithPayload} from '../interfaces/actions';
import {tableSessionsToFront} from '../helpers/api-data-converters/index';
import tableSessionsChanged from '../action-creators/table-sessions-changed';
import fetchingTableSessionsHistoryFailed from '../action-creators/fetching-table-sessions-history-failed';
import {ActionType} from '../action-creators/fetching-table-sessions-history';
import {RequestSessionHistoryPayload} from '../interfaces/api-requests';
import {StoreStructure, Tables, TableSessions, Table} from '../interfaces/store-models';
import tablesChanged from '../action-creators/tables-changed';
import {API_URL} from '../constants/index';
import {TableSession} from '../interfaces/backend-models';

type ResponseOk = AjaxResponseTyped<ResponseSessionsHistoryPayload>;
type ResponseOkDefined = AjaxResponseDefined<ResponseSessionsHistoryPayload>;
type ResponseError = AjaxErrorTyped<ResponseFailedPayload>;

const replaceTable = (tables: Tables, tableId: number, newTableData: Partial<Table>): Tables => {
  const currentTable = tables[tableId];

  if (currentTable) {
    const newTable = assign({}, currentTable, newTableData);
    tables[newTable.id] = newTable;
  }

  return tables;
};

const getTablesWithSetHistoryPending = (tables: Tables, tableId: number, isInPending: boolean): Tables => {
  return replaceTable(tables, tableId, {
    isSessionsHistoryInPending: isInPending
  });
};

const fetchSessionsHistory = ((action$, store: Store<StoreStructure>) => {
  return action$.ofType(FETCHING_TABLE_SESSIONS_HISTORY)
    .switchMap((action: ActionType) => {
      const tableId = action.payload;
      const dataToSend: RequestSessionHistoryPayload = {
        tableId
      };

      const setTablesWithPending$ = chain(store.getState().app.tablesData.tables)
        .clone()
        .thru((currentTablesClone: Tables) => getTablesWithSetHistoryPending(currentTablesClone, tableId, true) )
        .thru((tablesWithSetPending: Tables) => tablesChanged(tablesWithSetPending))
        .thru((tablesPendingAction: ActionWithPayload<Tables>) => Observable.of(tablesPendingAction) )
        .value();

      const historyRequest$ = Observable.of(null)
        .mergeMap(() =>
          get(`${API_URL}${urlSessionHistory}`, dataToSend)
            .mergeMap((ajaxData: ResponseOk | ResponseError) => {
              if ( isAjaxResponseDefined<ResponseOkDefined>(ajaxData) ) {
                const appData = store.getState().app;
                const tablesClone = clone( appData.tablesData.tables );
                const currentTable = tablesClone[tableId];

                const convertedResponseSessions: TableSessions = chain(ajaxData.response.sessions)
                  .thru((respSessions: TableSession[]) => tableSessionsToFront(respSessions))
                  .value();

                const setSessionsAction = chain(convertedResponseSessions)
                  .defaults(appData.tableSessionsData.tableSessions, {})
                  .thru((newSessionsAll: TableSessions) => tableSessionsChanged(newSessionsAll))
                  .value();

                const actions: SimpleAction[] = [setSessionsAction];

                if (currentTable) {
                  const setTablesAction = chain(convertedResponseSessions)
                    .keys()
                    .map((key: string) => Number(key))
                    .concat(currentTable.sessionsHistory)
                    .uniq()
                    .thru((newSessionIds: number[]) => replaceTable(tablesClone, tableId, {
                      isSessionsHistoryInPending: false,
                      sessionsHistory: newSessionIds
                    }))
                    .thru((changedTables: Tables) => tablesChanged(changedTables))
                    .value();

                  actions.push(setTablesAction);
                }

                return Observable.from(actions);
              } else {
                const errorMessage = getErrorMessageFromResponse(ajaxData as ResponseError);
                const tablesClone = clone( store.getState().app.tablesData.tables );
                const tablesWithUnsetPending = getTablesWithSetHistoryPending(tablesClone, tableId, false);
                const setTablesWithoutPendingAction = tablesChanged(tablesWithUnsetPending);

                return Observable.of<any>(
                  setTablesWithoutPendingAction,
                  fetchingTableSessionsHistoryFailed(errorMessage)
                );
              }
            })
        );

      return Observable.concat(
        setTablesWithPending$,
        historyRequest$
      );
    });
}) as Epic<SimpleAction>;

export default fetchSessionsHistory;
