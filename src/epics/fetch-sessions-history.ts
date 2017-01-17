import {Observable} from 'rxjs';
import {Epic} from 'redux-observable';
import {MiddlewareAPI} from 'redux';
import {clone, assign} from 'lodash';

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
import {StoreStructure, Tables, TableSessions} from '../interfaces/store-models';
import tablesChanged from '../action-creators/tables-changed';
import {API_URL} from '../constants/index';

type ResponseOk = AjaxResponseTyped<ResponseSessionsHistoryPayload>;
type ResponseOkDefined = AjaxResponseDefined<ResponseSessionsHistoryPayload>;
type ResponseError = AjaxErrorTyped<ResponseFailedPayload>;

const getTablesWithSetHistoryPending = (tables: Tables, tableId: number, isInPending: boolean): Tables => {
  const currentTable = tables[tableId];

  if (currentTable) {
    currentTable.isSessionsHistoryInPending = isInPending;
  }

  return tables;
};

const fetchSessionsHistory = ((action$, store: MiddlewareAPI<StoreStructure>) => {
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
                const tablesClone = clone( appData.tablesData.tables );
                const sessions = ajaxData.response.sessions;
                const currentSessions = appData.tableSessionsData.tableSessions;
                const convertedNewSessions = tableSessionsToFront(sessions);
                const newSessions: TableSessions = assign({}, currentSessions, convertedNewSessions);
                const tablesWithUnsetPending = getTablesWithSetHistoryPending(tablesClone, tableId, false);

                const setTableSessionsAction = tableSessionsChanged(newSessions);
                const setTablesWithoutPendingAction = tablesChanged(tablesWithUnsetPending);

                return Observable.of<any>(
                  setTablesWithoutPendingAction,
                  setTableSessionsAction
                );
              } else {
                const errorMessage = getErrorMessageFromResponse(ajaxData as ResponseError);

                return Observable.of<any>(
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
