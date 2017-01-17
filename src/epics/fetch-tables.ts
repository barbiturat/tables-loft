import {Observable} from 'rxjs';
import {Epic} from 'redux-observable';

import {FETCHING_TABLES} from '../constants/action-names';
import {get, getErrorMessageFromResponse, isAjaxResponseDefined} from '../helpers/requests';
import {ResponseTablesPayload, ResponseFailedPayload} from '../interfaces/api-responses';
import {AjaxResponseTyped, AjaxErrorTyped, AjaxResponseDefined} from '../interfaces/index';
import pendingTables from '../action-creators/pending-tables';
import fetchingTablesFailed from '../action-creators/fetching-tables-failed';
import {urlTables} from '../constants/urls';
import {SimpleAction} from '../interfaces/actions';
import {tablesToFront, tableSessionsToFront} from '../helpers/api-data-converters/index';
import {TableSession, Table as TableBackend} from '../interfaces/backend-models';
import tableSessionsChanged from '../action-creators/table-sessions-changed';
import tablesChanged from '../action-creators/tables-changed';
import {Tables} from '../interfaces/store-models';
import {API_URL} from '../constants/index';

type ResponseOk = AjaxResponseTyped<ResponseTablesPayload>;
type ResponseOkDefined = AjaxResponseDefined<ResponseTablesPayload>;
type ResponseError = AjaxErrorTyped<ResponseFailedPayload>;

const getTableSessionsFromTables = (tables: TableBackend[]) => {
  return tables.reduce((memo: TableSession[], table) => {
    const {currentSession, lastSession} = table;

    if (currentSession) { memo.push(currentSession); }
    if (lastSession) { memo.push(lastSession); }

    return memo;
  }, []);
};

const fetchTables = ((action$) => {
  return action$.ofType(FETCHING_TABLES)
    .switchMap(() => {
      const tablesPendingStart$ = Observable.of(pendingTables(true));
      const tablesRequest$ = Observable.of(null)
        .mergeMap(() =>
          get(`${API_URL}${urlTables}`)
            .mergeMap((ajaxData: ResponseOk | ResponseError) => {
              if ( isAjaxResponseDefined<ResponseOkDefined>(ajaxData) ) {
                const tables = ajaxData.response.tables;
                const tableSessions = getTableSessionsFromTables(tables);
                const convertedTables: Tables = tablesToFront(tables);
                const convertedTableSessions = tableSessionsToFront(tableSessions);

                const setTables = tablesChanged(convertedTables);
                const setTableSessions = tableSessionsChanged(convertedTableSessions);
                const tablesPendingStop = pendingTables(false);

                return Observable.of<any>(
                  setTables,
                  setTableSessions,
                  tablesPendingStop
                );
              } else {
                const errorMessage = getErrorMessageFromResponse(ajaxData as ResponseError);
                const tablesPendingStop = pendingTables(false);

                return Observable.of<any>(
                  tablesPendingStop,
                  fetchingTablesFailed(errorMessage)
                );
              }
            })
        );

      return Observable.concat(
        tablesPendingStart$,
        tablesRequest$
      );
    });
}) as Epic<SimpleAction>;

export default fetchTables;
