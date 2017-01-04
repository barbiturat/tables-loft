import {Observable} from 'rxjs';
import {Epic} from 'redux-observable';
import {MiddlewareAPI} from 'redux';
import {find} from 'lodash';

import {FETCHING_TABLE_SESSIONS_HISTORY} from '../constants/action-names';
import {get, getErrorMessageFromResponse} from '../helpers/requests';
import {
  ResponseFailedPayload,
  ResponseSessionsHistoryPayload
} from '../interfaces/api-responses';
import {AjaxResponseTyped, AjaxErrorTyped} from '../interfaces/index';
import {STATUS_OK} from '../constants/used-http-status-codes';
import {urlSessionHistory} from '../constants/urls';
import {SimpleAction} from '../interfaces/actions';
import {tableSessionsToFront} from '../helpers/api-data-converters/index';
import tableSessionsChanged from '../action-creators/table-sessions-changed';
import fetchingTableSessionsHistoryFailed from '../action-creators/fetching-table-sessions-history-failed';
import {ActionType} from '../action-creators/fetching-table-sessions-history';
import {RequestSessionHistoryPayload} from '../interfaces/api-requests';
import {StoreStructure, Table} from '../interfaces/store-models';
import tablesChanged from '../action-creators/tables-changed';

type ResponseOk = AjaxResponseTyped<ResponseSessionsHistoryPayload>;
type ResponseError = AjaxErrorTyped<ResponseFailedPayload>;

const getTablesWithSetHistoryPending = (tables: Table[], tableId: number, isInPending: boolean): Table[] => {
  const currentTable = find(tables, (table: Table) => {
    return table.id === tableId;
  });

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
      const currentTablesClone: Table[] = store.getState().app.tablesData.tables.concat([]);
      const tablesWithSetPending = getTablesWithSetHistoryPending(currentTablesClone, tableId, true);
      const setTablesWithPending$ = Observable.of( tablesChanged(tablesWithSetPending) );

      const historyRequest$ = Observable.of(null)
        .mergeMap(() =>
          get(urlSessionHistory, dataToSend)
            .mergeMap((ajaxData: ResponseOk | ResponseError) => {
              if (ajaxData.status === STATUS_OK) {
                const tablesClone = store.getState().app.tablesData.tables.concat([]);
                const sessions = (ajaxData as ResponseOk).response.sessions;
                const currentSessions = store.getState().app.tableSessionsData.tableSessions;
                const convertedNewSessions = tableSessionsToFront(sessions);
                const newSessions = currentSessions.concat(convertedNewSessions);
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
