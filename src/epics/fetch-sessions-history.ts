import {Observable} from 'rxjs';
import {Epic} from 'redux-observable';
import {Store} from 'redux';
import {clone, assign, uniq} from 'lodash';

import {FETCHING_TABLE_SESSIONS_HISTORY} from '../constants/action-names';
import {get, getErrorMessageFromResponse, isAjaxResponseDefined} from '../helpers/requests';
import {
  ResponseFailedPayload,
  ResponseSessionsHistoryPayload
} from '../interfaces/api-responses';
import {AjaxResponseTyped, AjaxErrorTyped, AjaxResponseDefined} from '../interfaces/index';
import {urlSessionHistory} from '../constants/urls';
import {SimpleAction} from '../interfaces/actions';
import {tableSessionsToFront} from '../helpers/api-data-converters/index';
import tableSessionsChanged from '../action-creators/table-sessions-changed';
import fetchingTableSessionsHistoryFailed from '../action-creators/fetching-table-sessions-history-failed';
import {ActionType} from '../action-creators/fetching-table-sessions-history';
import {RequestSessionHistoryPayload} from '../interfaces/api-requests';
import {StoreStructure, Tables, TableSessions, Table} from '../interfaces/store-models';
import tablesChanged from '../action-creators/tables-changed';
import {API_URL} from '../constants/index';

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
      const currentTablesClone: Tables = clone( store.getState().app.tablesData.tables );
      const tablesWithSetPending = getTablesWithSetHistoryPending(currentTablesClone, tableId, true);
      const setTablesWithPending$ = Observable.of( tablesChanged(tablesWithSetPending) );

      const historyRequest$ = Observable.of(null)
        .mergeMap(() =>
          get(`${API_URL}${urlSessionHistory}`, dataToSend)
            .mergeMap((ajaxData: ResponseOk | ResponseError) => {
              if ( isAjaxResponseDefined<ResponseOkDefined>(ajaxData) ) {
                const appData = store.getState().app;
                const respSessions = ajaxData.response.sessions;
                const currentSessions = appData.tableSessionsData.tableSessions;
                const convertedRespSessions = tableSessionsToFront(respSessions);
                const respSessionsIds = Object.keys(convertedRespSessions).map((val) => Number(val));
                const newSessionsAll: TableSessions = assign({}, currentSessions, convertedRespSessions);

                const setSessionsAction = tableSessionsChanged(newSessionsAll);
                const actions: SimpleAction[] = [setSessionsAction];

                const tablesClone = clone( appData.tablesData.tables );
                const currentTable = tablesClone[tableId];

                if (currentTable) {
                  const fixedSessionsIds = uniq( currentTable.sessionsHistory.concat(respSessionsIds) );
                  const changedTables = replaceTable(tablesClone, tableId, {
                    isSessionsHistoryInPending: false,
                    sessionsHistory: fixedSessionsIds
                  });
                  const setTablesAction = tablesChanged(changedTables);

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
